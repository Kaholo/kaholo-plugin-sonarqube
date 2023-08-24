const util = require("util");
const childProcess = require("child_process");
const { EMPTY_RETURN_VALUE } = require("./consts.json");

const sonarqubeApiService = require("./sonarqube-api-service");

function createSimpleApiPluginMethod(prepareFunction, sonarQubeApiServiceFunction) {
  return (params) => {
    const {
      urlSearchParams,
      hostUrl,
      token,
    } = prepareFunction.call(null, params);

    return sonarQubeApiServiceFunction.call(sonarqubeApiService, {
      urlSearchParams,
      hostUrl,
      token,
    });
  };
}

async function liveLogExec(params) {
  const {
    command,
    onProgressFn,
    options = {},
  } = params;

  let childProcessInstance;
  const stderrArray = ["sonar-scanner finished with the following errors..."]; // leave redundant "Error: " on its own line
  try {
    childProcessInstance = childProcess.exec(command, options);
  } catch (error) {
    throw new Error(error);
  }

  childProcessInstance.stdout.on("data", (data) => {
    onProgressFn?.(data);
  });
  childProcessInstance.stderr.on("data", (data) => {
    // collect ERROR lines for when sonar-scanner exits with integer value
    stderrArray.push(data);
  });

  try {
    await util.promisify(childProcessInstance.on.bind(childProcessInstance))("close");
  } catch (error) {
    stderrArray.push(`Exit Value: ${error}`);
    throw new Error(stderrArray.join("\n")); // throw error lines to Final Result
  }

  return EMPTY_RETURN_VALUE;
}

module.exports = {
  liveLogExec,
  createSimpleApiPluginMethod,
};
