const { docker } = require("@kaholo/plugin-library");

const { DOCKER_IMAGE } = require("./consts.json");
const { liveLogExec } = require("./helpers");

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

  return liveLogExec({
    command: dockerCommand,
    options: {
      env: fullEnvironmentVariables,
    },
    onProgressFn: process.stdout.write.bind(process.stdout),
  });}

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
