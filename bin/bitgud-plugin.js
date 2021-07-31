#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const mri = require('mri')

const bitgud = require('..').default

const args = mri(process.argv.slice(2), {
  alias: {
    'resolve-config': 'resolveConfig',
    'ignore-path': 'ignorePath',
  },
})

const bitgudResult = bitgud(
  process.cwd(),
  Object.assign({}, args, {
    onFoundSinceRevision: (scm, revision) => {
      console.log(`🔍  Finding changed files since ${chalk.bold(scm)} revision ${chalk.bold(revision)}.`)
    },

    onFoundChangedFiles: (changedFiles) => {
      console.log(
        `🎯  Found ${chalk.bold(changedFiles.length)} changed ${changedFiles.length === 1 ? 'file' : 'files'}.`
      )
    },
  })
)

if (bitgudResult.success) {
  console.log('✅  Everything is awesome!')
} else {
  if (bitgudResult.errors.indexOf('SERVER_ERROR') !== -1) {
    console.log('✗ Server Connection Error' + ` ${chalk.bold('Please update stage before committing')}.`)
  }
  process.exit(1) // ensure git hooks abort
}
