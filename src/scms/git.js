import findUp from 'find-up'
import execa from 'execa'
import { dirname, join } from 'path'
import * as fs from 'fs'

export const name = 'git'

export const detect = (directory) => {
  if (fs.existsSync(join(directory, '.git'))) {
    return directory
  }

  const gitDirectory = findUp.sync('.git', {
    cwd: directory,
    type: 'directory',
  })
  if (gitDirectory) {
    return dirname(gitDirectory)
  }
}

const runGit = (directory, args) =>
  execa.sync('git', args, {
    cwd: directory,
  })

const getOutputFromGit = (obj) => String(obj.stdout).trim()

const getLines = (execaResult) => execaResult.stdout.split('\n')

export const getSinceRevision = (directory, { staged, branch }) => {
  try {
    const revision = staged ? 'HEAD' : runGit(directory, ['merge-base', 'HEAD', branch || 'master']).stdout.trim()
    return runGit(directory, ['rev-parse', '--short', revision]).stdout.trim()
  } catch (error) {
    if (/HEAD/.test(error.message) || (staged && /Needed a single revision/.test(error.message))) {
      return null
    }
    throw error
  }
}

export const getLongHash = (directory, { staged, branch }) => {
  try {
    const revision = staged ? 'HEAD' : runGit(directory, ['merge-base', 'HEAD', branch || 'master']).stdout.trim()
    return runGit(directory, ['rev-parse', revision]).stdout.trim()
  } catch (error) {
    if (/HEAD/.test(error.message) || (staged && /Needed a single revision/.test(error.message))) {
      return null
    }
    throw error
  }
}

export const getChangedFiles = (directory, revision, staged) => {
  return [
    ...getLines(
      runGit(
        directory,
        ['diff', '--name-only', staged ? '--cached' : null, '--diff-filter=ACMRTUB', revision].filter(Boolean)
      )
    ),
    ...(staged ? [] : getLines(runGit(directory, ['ls-files', '--others', '--exclude-standard']))),
  ].filter(Boolean)
}

export const getLinesChanged = (directory, revision, staged) => {
  const output = getLines(runGit(directory, ['diff', '--numstat']))

  let totalLinesChanged = 0

  for (const obj of output) {
    let [added, removed, fileName] = obj.split('\t')
    added = parseInt(added, 10)
    removed = parseInt(removed, 10)

    if (!isNaN(added) && !isNaN(removed)) {
      totalLinesChanged += added + removed
    }
  }
  return totalLinesChanged
}

export const getUnstagedChangedFiles = (directory) => {
  return getChangedFiles(directory, null, false)
}

export const getGitEmail = (directory) => {
  return getOutputFromGit(runGit(directory, ['config', 'user.email']))
}

export const getGitName = (directory) => {
  return getOutputFromGit(runGit(directory, ['config', 'user.name']))
}

export const getRemoteOrigin = (directory) => {
  return getOutputFromGit(runGit(directory, ['config', '--get', 'remote.origin.url']))
}

export const getCurrentBranchName = (directory) => {
  return getOutputFromGit(runGit(directory, ['rev-parse', '--abbrev-ref', 'HEAD']))
}

export const stageFile = (directory, file) => {
  runGit(directory, ['add', file])
}
