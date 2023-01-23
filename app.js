const request = require("request");
const path = require("path");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const { genericRestAPI, assertPath } = require("./helpers");
const sonarScannerService = require("./sonar-scanner-service");
const { prepareRunSonarScannerCommand } = require("./payload-functions");

async function runSonarScanner(params) {
  const absoluteWorkingDirectory = path.resolve(params.workingDirectory || "./");
  await assertPath(absoluteWorkingDirectory);

  const {
    command,
    environmentVariables,
  } = prepareRunSonarScannerCommand(params);

  return sonarScannerService.runCliCommand({
    command,
    environmentVariables,
    workingDirectory: absoluteWorkingDirectory,
  });
}

async function createProject(params) {
  /**
     * Creates a new Project
     * Based on Docs here: https://sonarcloud.io/web_api/api/projects
     */
  const {
    hostUrl,
    projectName,
    organization,
    projectKey,
    restToken,
    visibility,
  } = params;

  let url = `${hostUrl}/api/projects/create?name=${projectName}&project=${projectKey}&visibility=${visibility}`;
  if (organization) {
    url += `&organization=${organization}`;
  }

  return genericRestAPI("POST", url, restToken);
}

function getViolations(action) {
  /**
     * violations http://34.175.179.136/api/measures/component?component=kaholo&metricKeys=violations
     */

  const hostURL = action.params.HOST_URL;
  const componentName = action.params.COMPONENT_NAME;

  const url = `${hostURL}/api/measures/component?component=${componentName}&metricKeys=violations`;

  let auth;
  if (action.params.bearerToken) {
    auth = {
      bearer: action.params.bearerToken,
      sendImmediately: true,
    };
  } else if (action.params.username || action.params.password) {
    auth = {
      user: action.params.username,
      pass: action.params.password,
      sendImmediately: true,
    };
  }

  const requestOptions = {
    url,
    method: action.params.method || "GET",
    body: action.params.body || undefined,
    json: true,
    headers: action.params.headers || {},
    auth,
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function getCoverage(action) {
  // http://34.175.179.136/api/measures/component?component=kaholo&metricKeys=coverage

  const hostURL = action.params.HOST_URL;
  const componentName = action.params.COMPONENT_NAME;

  const url = `${hostURL}/api/measures/component?component=${componentName}&metricKeys=coverage`;

  let auth;
  if (action.params.bearerToken) {
    auth = {
      bearer: action.params.bearerToken,
      sendImmediately: true,
    };
  } else if (action.params.username || action.params.password) {
    auth = {
      user: action.params.username,
      pass: action.params.password,
      sendImmediately: true,
    };
  }

  const requestOptions = {
    url,
    method: action.params.method || "GET",
    body: action.params.body || undefined,
    json: true,
    headers: action.params.headers || {},
    auth,
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

module.exports = {
};

module.exports = kaholoPluginLibrary.bootstrap({
  runSonarScanner,
  createProject,
  getViolations,
  getCoverage,
});
