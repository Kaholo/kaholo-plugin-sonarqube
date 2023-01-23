const { default: axios } = require("axios");
const { URLSearchParams } = require("url");

async function makeAuthenticatedApiCall(params) {
  const {
    method,
    hostUrl,
    token,
    path,
  } = params;

  try {
    const { data } = await axios.request({
      method,
      url: path,
      baseURL: hostUrl,
      auth: {
        username: token,
      },
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
  return (params) => {
    const {
      hostUrl,
      token,
      urlSearchParams: urlSearchParamsObject,
    } = params;

    const urlSearchParams = new URLSearchParams(urlSearchParamsObject);
    const path = `${endpoint}?${urlSearchParams.toString()}`;

    return makeAuthenticatedApiCall({
      method,
      hostUrl,
      token,
      path,
    });
  };
}

module.exports = {
  createProject: createSimpleApiCallFunction("POST", "api/projects/create"),
  getComponentMeasures: createSimpleApiCallFunction("GET", "api/measures/component"),
};
