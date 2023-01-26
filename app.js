const path = require("path");
const kaholoPluginLibrary = require("@kaholo/plugin-library");

const sonarScannerCliService = require("./sonar-scanner-cli-service");
const sonarQubeApiService = require("./sonarqube-api-service");

const {
  prepareRunSonarScannerCommand,
  prepareCreateProjectPayload,
  prepareGetViolationsPayload,
  prepareGetCoveragePayload,
  prepareSearchProjectsPayload,
} = require("./payload-functions");
const {
  assertPath,
  createSimpleApiPluginMethod,
} = require("./helpers");

async function runSonarScanner(params) {
  const absoluteWorkingDirectory = path.resolve(params.workingDirectory || "./");
  await assertPath(absoluteWorkingDirectory);

  const {
    command,
    environmentVariables,
  } = prepareRunSonarScannerCommand(params);

  return sonarScannerCliService.runCommand({
    command,
    environmentVariables,
    workingDirectory: absoluteWorkingDirectory,
  });
}

module.exports = kaholoPluginLibrary.bootstrap({
  runSonarScanner,
  createProject: createSimpleApiPluginMethod(
    prepareCreateProjectPayload,
    sonarQubeApiService.createProject,
  ),
  getViolations: createSimpleApiPluginMethod(
    prepareGetViolationsPayload,
    sonarQubeApiService.getComponentMeasures,
  ),
  getCoverage: createSimpleApiPluginMethod(
    prepareGetCoveragePayload,
    sonarQubeApiService.getComponentMeasures,
  ),
  searchProjects: createSimpleApiPluginMethod(
    prepareSearchProjectsPayload,
    sonarQubeApiService.searchProjects,
  ),
});
