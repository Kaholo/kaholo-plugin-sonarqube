const kaholoPluginLibrary = require("@kaholo/plugin-library");

const { DOCKER_IMAGE } = require("./consts.json");
const { exec } = require("./helpers");

async function runCommand(params) {
  const {
    command,
    environmentVariables,
    workingDirectory,
  } = params;

  const dockerCommand = kaholoPluginLibrary.docker.buildDockerCommand({
    image: DOCKER_IMAGE,
    command,
    environmentVariables,
    workingDirectory,
  });

  let stdout;
  let stderr;
  try {
    ({ stdout, stderr } = await exec(dockerCommand, {
      env: environmentVariables,
    }));
  } catch (error) {
    console.error(`Error occurred while executing command: ${dockerCommand}`);
    console.error(error.stdout);
    throw error;
  }

  if (stderr) {
    console.error(stderr);
  }
  return stdout;
}

module.exports = {
  runCommand,
};
