const { default: axios } = require("axios");
const { URLSearchParams } = require("url");

async function makeAuthenticatedApiCall(params) {
  const {
    method,
    url,
    token,
  } = params;

  const { data } = await axios.request({
    method,
    url,
    auth: {
      username: token,
    },
  });

  return data;
}

function createSimpleApiCallFunction(method, endpoint) {
  return (params) => {
    const {
      hostUrl,
      token,
      urlSearchParams: urlSearchParamsObject,
    } = params;

    const baseUrl = `${hostUrl}${endpoint}`;
    const urlSearchParams = new URLSearchParams(urlSearchParamsObject);
    const url = `${baseUrl}${urlSearchParams.toString()}`;

    return makeAuthenticatedApiCall({
      method,
      url,
      token,
    });
  };
}

module.exports = {
  createProject: createSimpleApiCallFunction("POST", "/api/projects/create"),
  getComponentMeasures: createSimpleApiCallFunction("GET", "/api/measures/component"),
};
