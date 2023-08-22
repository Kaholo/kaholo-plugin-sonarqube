const { promisify } = require("util");
const { exec: execWithCallback } = require("child_process");

const sonarqubeApiService = require("./sonarqube-api-service");

const exec = promisify(execWithCallback);

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
  createSimpleApiPluginMethod,
};
