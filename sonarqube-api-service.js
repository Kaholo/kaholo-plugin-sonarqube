const { default: axios } = require("axios");

const { DEFAULT_PAGE_SIZE } = require("./consts.json");

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
    ...params,
    method,
    endpoint,
  });
}

async function searchProjects(params, options = {}) {
  const {
    urlSearchParams: query,
    hostUrl,
    token,
  } = params;

  const {
    page = 1,
  } = options;

  const urlSearchParams = {
    q: query,
    ps: DEFAULT_PAGE_SIZE,
    p: page,
  };

  const { components } = await makeAuthenticatedApiCall({
    endpoint: "api/projects/search",
    method: "GET",
    urlSearchParams,
    hostUrl,
    token,
  });

  if (components.length < DEFAULT_PAGE_SIZE) {
    return components;
  }

  const recursiveResult = await searchProjects(params, {
    page: page + 1,
  });
  return components.concat(recursiveResult);
}

module.exports = {
  searchProjects,
  createProject: createSimpleApiCallFunction("POST", "api/projects/create"),
  getComponentMeasures: createSimpleApiCallFunction("GET", "api/measures/component"),
};
