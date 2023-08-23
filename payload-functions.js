const { SONAR_SCANNER_CLI_NAME } = require("./consts.json");

function prepareRunSonarScannerCommand(params) {
  const {
    hostUrl,
    token,
    additionalArguments,
    projectKey,
    sources,
  } = params;

  const commandArguments = [
    SONAR_SCANNER_CLI_NAME,
    "-Dsonar.projectKey=$PROJECT_KEY",
  ];

  const environmentVariables = new Map([
    ["PROJECT_KEY", projectKey],
  ]);

  if (sources) {
    commandArguments.push("-Dsonar.sources=$SOURCES")
    environmentVariables.set("SOURCES", sources.join(","));
  }

  if (hostUrl) {
    commandArguments.push("-Dsonar.host.url=$HOST_URL");
    environmentVariables.set("HOST_URL", hostUrl);
  }
  if (token) {
    commandArguments.push("-Dsonar.login=$SONAR_TOKEN");
    environmentVariables.set("SONAR_TOKEN", token);
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
    token,
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
    token,
    hostUrl,
  };
}

function prepareGetViolationsPayload(params) {
  const {
    hostUrl,
    token,
    componentName,
  } = params;

  const urlSearchParams = new Map([
    ["component", componentName],
    ["metricKeys", "violations"],
  ]);

  return {
    urlSearchParams: Object.fromEntries(urlSearchParams.entries()),
    token,
    hostUrl,
  };
}

function prepareGetCoveragePayload(params) {
  const {
    hostUrl,
    token,
    componentName,
  } = params;

  const urlSearchParams = new Map([
    ["component", componentName],
    ["metricKeys", "coverage"],
  ]);

  return {
    urlSearchParams: Object.fromEntries(urlSearchParams.entries()),
    token,
    hostUrl,
  };
}

function prepareSearchProjectsPayload(params) {
  const {
    hostUrl,
    token,
    query,
  } = params;

  return {
    token,
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
