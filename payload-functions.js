const { SONAR_SCANNER_CLI_NAME } = require("./consts.json");

function prepareRunSonarScannerCommand(params) {
  const {
    hostUrl,
    login,
    additionalArguments,
    projectKey,
    sources,
  } = params;

  const commandArguments = [
    SONAR_SCANNER_CLI_NAME,
    "-Dsonar.sources=$SOURCES",
    "-Dsonar.projectKey=$PROJECT_KEY",
  ];
  const environmentVariables = new Map([
    ["SOURCES", sources.join(",")],
    ["PROJECT_KEY", projectKey],
  ]);

  if (hostUrl) {
    commandArguments.push("-Dsonar.host.url=$HOST_URL");
    environmentVariables.set("HOST_URL", hostUrl);
  }
  if (login) {
    commandArguments.push("-Dsonar.login=$LOGIN");
    environmentVariables.set("LOGIN", login);
  }
  if (additionalArguments?.length) {
    commandArguments.push(...additionalArguments);
  }

  return {
    command: commandArguments.join(" "),
    environmentVariables: Object.fromEntries(environmentVariables.entries()),
  };
}

module.exports = {
  prepareRunSonarScannerCommand,
};
