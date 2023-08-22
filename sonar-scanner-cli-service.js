const { docker } = require("@kaholo/plugin-library");

const { DOCKER_IMAGE } = require("./consts.json");
const { exec } = require("./helpers");

async function runCommand(params) {
  const {
    command,
    environmentVariables,
    workingDirectory,
  } = params;

  const projectDirVolumeDefinition = docker.createVolumeDefinition(workingDirectory);

  const fullEnvironmentVariables = {
    ...mapEnvironmentVariablesFromVolumeDefinitions([
      projectDirVolumeDefinition,
    ]),
    ...environmentVariables,
  };

  const dockerCommand = docker.buildDockerCommand({
    image: DOCKER_IMAGE,
    command,
    environmentVariables: fullEnvironmentVariables,
    volumeDefinitionsArray: [projectDirVolumeDefinition],
    workingDirectory: `$${projectDirVolumeDefinition.mountPoint.name}`,
  });

  let stdout;
  let stderr;
  try {
    ({ stdout, stderr } = await exec(dockerCommand, {
      env: fullEnvironmentVariables,
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

function mapEnvironmentVariablesFromVolumeDefinitions(volumeDefinitions) {
  return volumeDefinitions.reduce((acc, cur) => ({
    ...acc,
    [cur.mountPoint.name]: cur.mountPoint.value,
    [cur.path.name]: cur.path.value,
  }), {});
}

module.exports = {
  runCommand,
};
