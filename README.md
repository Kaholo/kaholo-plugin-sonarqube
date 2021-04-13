# kaholo-plugin-sonarqube
Kaholo Plugin for SonarQube.
This plugin is wrapping SonarQube CLI. You can download it from [here](https://docs.sonarqube.org/latest/setup/get-started-2-minutes/).

## Settings
1. Sonar Scanner (String) **Optional** - The cli command to execute sonar-scanner. default is "sonar-sacanner". Can specify path to .bat file for example.
2. Host URL (String) **Optional** - The URL to the default SonarQube server.
3. CLI Token (Vault) **Required For Run Test** - The token to authenticate when running the CLI.
4. REST API Token (Vault) **Required For Create Project** - The token to authenticate with in API requests.

## Method: Run Test
Run sonar-scanner on provided project.

### Parameters:
1. Host URL (String) **Optional** - The URL to the SonarQube server. Required in case wasn't provided in settings.
2. Login **Optional** - The token to authenticate when running the CLI. Required in case wasn't provided in settings.
3. Working Directory (String) **Optional** - The working directory to run this command from.
4. Project Key (String) **Required** - Key of the project. **Maximum length 400.** 
5. Sources Path (Text) **Required** - Path to the directory containing main source files to test. Can enter multiple values by seperating each with a new line.
6. Additional Arguments (Text) **Optional** - Any other arguments to send to the CLI. Can Enter multiple values by seperating each with new line.

## Method: Create Project
This method will create a new project.
This method is wrapping SonarQube RestAPI. You can see the API documentation [here](https://docs.sonarqube.org/latest/extend/web-api/).

### Parameters:
1. Host URL (String) **Optional** - The URL to the SonarQube server. Required in case wasn't provided in settings.
2. Project Name (String) **Required** - Name of the project. If name is longer than 500, it is abbreviated.
3. Organization (String) **Required** - If you are using Git Repo you should also provide the Organization name.
4. Project Key (String) **Required** - Key of the project. **Maximum length 400.** 
5. Visability (String) **Optional** - Whether the created project should be visible to everyone, or only specific user/groups. 
If no visibility is specified, the default project visibility of the organization will be used.\
