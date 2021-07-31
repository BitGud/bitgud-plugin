const main = (
  currentDirectory,
  { onFoundSinceRevision, onFoundChangedFiles } = {}
) => {
  const scm = scms(currentDirectory);
  if (!scm) {
    throw new Error("Unable to detect a source control manager.");
  }
  const directory = scm.rootDirectory;

  const revision = since || scm.getSinceRevision(directory, { staged, branch });

  onFoundSinceRevision && onFoundSinceRevision(scm.name, revision);

  const changedFiles = scm.getChangedFiles(directory, revision, staged);

  onFoundChangedFiles && onFoundChangedFiles(changedFiles);

  const failReasons = new Set();

  scm.getGitEmail(directory);

  return {
    success: failReasons.size === 0,
    errors: Array.from(failReasons),
  };
};

export default main;
