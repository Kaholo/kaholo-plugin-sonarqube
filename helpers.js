const { promisify } = require("util");
const { exec: execWithCallback } = require("child_process");
const fs = require("fs");

const sonarqubeApiService = require("./sonarqube-api-service");

const exec = promisify(execWithCallback);

async function assertPath(pathToAssert) {
  try {
    await fs.promises.access(pathToAssert, fs.constants.F_OK);
  } catch {
    throw new Error(`Path ${pathToAssert} does not exist on agent!`);
  }
}

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

module.exports = {
  exec,
  assertPath,
  createSimpleApiPluginMethod,
};
