const { SONAR_SCANNER_CLI_NAME } = require("./consts.json");

function prepareRunSonarScannerCommand(params) {
  const {
    hostUrl,
    cliLogin,
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
  if (cliLogin) {
    commandArguments.push("-Dsonar.login=$CLI_LOGIN");
    environmentVariables.set("CLI_LOGIN", cliLogin);
  }
  if (additionalArguments?.length) {
    commandArguments.push(...additionalArguments);
  }

  return {
    command: commandArguments.join(" "),
    environmentVariables: Object.fromEntries(environmentVariables.entries()),
  };
}

function prepareCreateProjectPayload(params) {
  const {
    hostUrl,
    projectName,
    organization,
    projectKey,
    restToken,
    visibility,
  } = params;

  const urlSearchParams = new Map([
    ["name", projectName],
    ["project", projectKey],
    ["visibility", visibility],
  ]);
  if (organization) {
    urlSearchParams.set("organization", organization);
  }

  return {
    urlSearchParams: Object.fromEntries(urlSearchParams.entries()),
    token: restToken,
    hostUrl,
  };
}

function prepareGetViolationsPayload(params) {
  const {
    hostUrl,
    restToken,
    componentName,
  } = params;

  const urlSearchParams = new Map([
    ["component", componentName],
    ["metricKeys", "violations"],
  ]);

  return {
    urlSearchParams: Object.fromEntries(urlSearchParams.entries()),
    token: restToken,
    hostUrl,
  };
}

function prepareGetCoveragePayload(params) {
  const {
    hostUrl,
    restToken,
    componentName,
  } = params;

  const urlSearchParams = new Map([
    ["component", componentName],
    ["metricKeys", "coverage"],
  ]);

  return {
    urlSearchParams: Object.fromEntries(urlSearchParams.entries()),
    token: restToken,
    hostUrl,
  };
}

function prepareSearchProjectsPayload(params) {
  const {
    hostUrl,
    restToken,
    query,
  } = params;

  return {
    token: restToken,
    hostUrl,
    urlSearchParams: query,
  };
}

module.exports = {
  prepareRunSonarScannerCommand,
  prepareCreateProjectPayload,
  prepareGetViolationsPayload,
  prepareGetCoveragePayload,
  prepareSearchProjectsPayload,
};
