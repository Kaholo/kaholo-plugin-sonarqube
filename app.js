const childProcess = require("child_process");
const { genericRestAPI, splitByNewLine } = require("./helpers");

async function runTest(action, settings) {
  /**
     * This command will execute sonar-scanner cli.
     * Parameter are as following cli example:
     * sonar-scanner \
        -Dsonar.projectKey=kaholo_example \
        -Dsonar.sources=. \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=###########
     */
  const sonarScanner = settings.SONAR_SCANNER ? `"${settings.SONAR_SCANNER}"` : "sonar-scanner";
  const hostURL = action.params.HOST_URL || settings.HOST_URL;
  const login = action.params.LOGIN || settings.LOGIN;
  const extraArgsStr = (action.params.args || "").trim();

  const cmdArgs = [
    sonarScanner,
  ];

  if (action.params.PROJECT_KEY) {
    cmdArgs.push(`-Dsonar.projectKey=${action.params.PROJECT_KEY}`);
  }
  if (hostURL) {
    cmdArgs.push(`-Dsonar.host.url=${hostURL}`);
  }
  if (action.params.SOURCES) {
    cmdArgs.push(`-Dsonar.sources=${splitByNewLine(action.params.SOURCES).join(",")}`);
  }
  if (login) {
    cmdArgs.push(`-Dsonar.login=${login}`);
  }
  if (extraArgsStr) {
    cmdArgs.push(...splitByNewLine(extraArgsStr));
  }

  const command = cmdArgs.join(" ");
  return new Promise((resolve, reject) => {
    childProcess.exec(command, {
      cwd: action.params.workDir || null,
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

async function createNewProject(action, settings) {
  /**
     * Creates a new Project
     * Based on Docs here: https://sonarcloud.io/web_api/api/projects
     */
  const hostURL = action.params.HOST_URL || settings.HOST_URL;
  const projectName = action.params.NAME;
  const organization = action.params.ORGANIZATION || undefined;
  const projectKey = action.params.PROJECT_KEY;
  const visibility = action.params.VISIBILITY;
  const userToken = action.params.restToken || settings.restToken;

  let url = `${hostURL}/api/projects/create?name=${projectName}&project=${projectKey}&visibility=${visibility}`;
  if (organization) {
    url += `&organization=${organization}`;
  }
  return genericRestAPI("POST", url, userToken);
}

module.exports = {
  RUN_TEST: runTest,
  CREATE_PROJECT: createNewProject,
};