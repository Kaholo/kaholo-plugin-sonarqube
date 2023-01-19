const fetch = require("node-fetch");
const base64 = require("base-64");

async function genericRestAPI(method, url, userToken) {
  /**
     * Send Default API Request
     */
  const user = base64.encode(`${userToken}:`);
  const request = {
    method: `${method}`,
    headers: {
      Authorization: `Basic ${user}`,
    },
  };
  const response = await fetch(url, request);
  if (!response.ok) {
    throw response;
  }
  return response.json();
}

function splitByNewLine(str) {
  return str.split("\n").map((line) => line.trim()).filter((line) => line);
}

module.exports = {
  genericRestAPI,
  splitByNewLine,
};