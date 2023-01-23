const request = require("request");
const childProcess = require("child_process");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const { genericRestAPI } = require("./helpers");

const DEFAULT_SONAR_SCANNER_NAME = "sonar-scanner";

async function runTest(params, { settings }) {
  /**
     * This command will execute sonar-scanner cli.
     * Parameter are as following cli example:
     * sonar-scanner \
        -Dsonar.projectKey=kaholo_example \
        -Dsonar.sources=. \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=###########
     */
  const {
    hostUrl,
    login,
    args,
    projectKey,
    sources,
  } = params;
  const sonarScanner = `"${settings.sonarScanner || DEFAULT_SONAR_SCANNER_NAME}"`;

  const cmdArgs = [
    sonarScanner,
  ];

  if (projectKey) {
    cmdArgs.push(`-Dsonar.projectKey=${projectKey}`);
  }
  if (hostUrl) {
    cmdArgs.push(`-Dsonar.host.url=${hostUrl}`);
  }
  if (sources) {
    cmdArgs.push(`-Dsonar.sources=${sources.join(",")}`);
  }
  if (login) {
    cmdArgs.push(`-Dsonar.login=${login}`);
  }
  if (args?.length) {
    cmdArgs.push(...args);
  }

  const command = cmdArgs.join(" ");
  return new Promise((resolve, reject) => {
    childProcess.exec(command, {
      cwd: params.workDir || null,
    }, (error, stdout, stderr) => {
      if (error) {
        console.info(`${stdout}`);
        return reject(new Error(`exec error: ${error}`));
      }
      if (stderr) {
        console.info(`stderr: ${stderr}`);
      }
      return resolve(stdout);
    });
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
  runTest,
  createProject,
  getViolations,
  getCoverage,
});
