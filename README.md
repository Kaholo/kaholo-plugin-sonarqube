# kaholo-plugin-sonarqube
Kaholo Plugin for SonarQube

## Settings

## Method: Create Project
This method will create a new project.
This method is wrapping SonarQube RestAPI. You can see the API documentation [here](https://docs.sonarqube.org/latest/extend/web-api/)

### Parameters:
1) Home URL: the URL to the SonarQube server. For exaple: http://localhost:9000 ```Required```
2) Project Name: Name of the project. If name is longer than 500, it is abbreviated. ```Required```
3) Organization: If you are using Git Repo you should also provide the Organization name.```Required```
4) Project Key: Key of the project **Maximum length 400.** ```Required```
5) Visability: Whether the created project should be visible to everyone, or only specific user/groups. 
If no visibility is specified, the default project visibility of the organization will be used. ```Optional```
