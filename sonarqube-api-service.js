const { default: axios } = require("axios");

async function makeAuthenticatedApiCall(params) {
  const {
    method,
    hostUrl,
    token,
    endpoint,
    urlSearchParams: urlSearchParamsObject,
  } = params;

  try {
    const { data } = await axios.request({
      method,
      url: endpoint,
      baseURL: hostUrl,
      auth: {
        username: token,
      },
      params: urlSearchParamsObject,
    });

    return data;
  } catch (error) {
    console.error("API Call failed, error details:");
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }

    throw error;
  }
}

function createSimpleApiCallFunction(method, endpoint) {
  return (params) => makeAuthenticatedApiCall({
    method,
    endpoint,
    hostUrl: params.hostUrl,
    token: params.token,
    urlSearchParams: params.urlSearchParams,
  });
}

module.exports = {
  createProject: createSimpleApiCallFunction("POST", "api/projects/create"),
  getComponentMeasures: createSimpleApiCallFunction("GET", "api/measures/component"),
};
