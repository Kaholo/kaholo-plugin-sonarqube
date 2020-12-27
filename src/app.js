const fetch = require('node-fetch');
const base64 = require('base-64');
const child_process = require("child_process")

///////////////////// METHODS ///////////////////// 
async function runTest(action, settings) {
    /**
     * This command will execute sonar-scanner cli.
     * Parameter are as following cli example:
     * sonar-scanner \
        -Dsonar.projectKey=kaholo_example \
        -Dsonar.sources=. \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=###########
     */
    const sonarScanner = action.params.SONAR_SCANNER;
    const projectKey = action.params.PROJECT_KEY;
    const sourcesPath = action.params.SOURCES;
    const hostURL = action.params.HOST_URL;
    const login = action.params.LOGIN;
    const command = `${sonarScanner} -Dsonar.projectKey=${projectKey} -Dsonar.sources=${sourcesPath} -Dsonar.host.url=${hostURL} -Dsonar.login=${login}`;
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`${stdout}`)
                return reject(`exec error: ${error}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            return resolve(stdout);
        });
    })
}


async function createNewProject(action, settings) {
    /**
     * Creates a new Project 
     * Based on Docs here: https://sonarcloud.io/web_api/api/projects
     */
    const method = "POST";
    const projectName = action.params.NAME;
    const sonarQubeHome = action.params.HOME_URL
    let url = sonarQubeHome + "/api/projects/create";
    const organization = action.params.ORGANIZATION || undefined;
    const projectKey = action.params.PROJECT_KEY;
    const visability = action.params.VISIBILITY;
    const userToken = settings.TOKEN;
    url = `${url}?name=${projectName}&project=${projectKey}&visability=${visability}`;
    if (organization) {
        url = url + `&organization=${organization}`
    }
    return await genericRestAPI(method, url, userToken);
}

///////////////////// HELPERS ///////////////////// 
async function genericRestAPI(method, url, userToken) {
    /**
     * Send Default API Request
     */
    let user = base64.encode(userToken + ":")
    let request = {
        method: `${method}`,
        'headers': {
            'Authorization': `Basic ${user}`
        }
    };
    response = await fetch(url, request);
    if (!response.ok) {
        throw response
    }
    return response.json();
}

module.exports = {
    RUN_TEST: runTest,
    CREATE_PROJECT: createNewProject
    // autocomplete
};