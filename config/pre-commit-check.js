const { execSync } = require("child_process");

try {
  // Get staged files
  const stagedFiles = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  })
    .trim()
    .split("\n");

  // Check if files from each package are staged
  const codeGuardFiles = stagedFiles.filter((file) =>
    file.startsWith("code-guard/")
  );
  const reactWebpackFiles = stagedFiles.filter((file) =>
    file.startsWith("react-webpack/")
  );

  const isCodeGuardChange = !!codeGuardFiles.length;
  const isReactWebpackChange = !!reactWebpackFiles.length;

  if (isCodeGuardChange && isReactWebpackChange) {
    console.error(
      "Error: change statge changes in multiple packages. Commit change in one package at a time"
    );

    process.exit(1);
  }

  if (!isCodeGuardChange && !isReactWebpackChange) {
    console.error(`
      Error: no files change!
      To commit files out of packages scope: use --nm flag, ex: git commit -nm "commit_message_here"
      `);

    process.exit(1);
  }

  if (isCodeGuardChange) {
    console.log("Running lint staged on package code-guard");

    execSync("cd packages/code-guard && npm run lint-staged");
  }

  if (isReactWebpackChange) {
    console.log("Running lint staged on package react-webpack");

    execSync("cd packages/react-webpack && npm run lint-staged");
  }
} catch (error) {
  console.error("Error running precommit check: ", error.message);

  process.exit(1);
}
