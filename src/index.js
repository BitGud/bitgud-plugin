import scms from './scms'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const main = (currentDirectory, { since, staged, branch, onFoundSinceRevision, onFoundChangedFiles } = {}) => {
  const scm = scms(currentDirectory)
  if (!scm) {
    throw new Error('Unable to detect a source control manager.')
  }
  const directory = scm.rootDirectory

  const revision = since || scm.getSinceRevision(directory, { staged, branch })
  const longRevision = scm.getLongHash(directory, { staged, branch })

  onFoundSinceRevision && onFoundSinceRevision(scm.name, revision)

  const changedFiles = scm.getChangedFiles(directory, revision, staged)
  const linesChanged = scm.getLinesChanged(directory, revision, staged) || 0

  onFoundChangedFiles && onFoundChangedFiles(changedFiles)

  const failReasons = new Set()

  const gitEmail = scm.getGitEmail(directory)
  const gitName = scm.getGitName(directory)
  const remoteOrigin = scm.getRemoteOrigin(directory)
  const currentBranchName = scm.getCurrentBranchName(directory)

  const payload = {
    userName: gitName,
    userEmail: gitEmail,
    commitHash: longRevision,
    filesChanged: changedFiles.length,
    linesChanged: linesChanged,
    branchName: currentBranchName,
    commitMessage: '',
    remoteOrigin: remoteOrigin,
  }

  // Send data to API
  axios.post(`${process.env.API_URL}/commit/add`, payload)

  return {
    success: failReasons.size === 0,
    errors: Array.from(failReasons),
  }
}

export default main
