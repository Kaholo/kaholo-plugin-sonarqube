const { promisify } = require("util");
const { exec: execWithCallback } = require("child_process");
const fs = require("fs");

const exec = promisify(execWithCallback);

async function assertPath(pathToAssert) {
  try {
    await fs.promises.access(pathToAssert, fs.constants.F_OK);
  } catch {
    throw new Error(`Path ${pathToAssert} does not exist on agent!`);
  }
}

module.exports = {
  exec,
  assertPath,
};
