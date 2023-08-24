# Kaholo SonarQube Plugin

## Prerequisites

## Access and Authentication
Access and Authentication are by means of a Base URL and a Token, which are covered below in section [Plugin Settings](#plugin-settings). For information about generating tokens, please see the [SonarQube Documentation](https://docs.sonarsource.com/sonarqube/latest/user-guide/user-account/generating-and-using-tokens/).

Username and password authentication are not implemented in the plugin. If you would like that as a feature, [please let us know](https://kaholo.io/contact/).

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
Plugin Settings and Accounts are accessible using either of two methods:
* In Settings | Plugins, the name of the plugin is a blue hyperlink leading to Settings and Accounts, or
* After selecting a method for an action, the drop-down for parameter "Account" has a feature "Add New Plugin Account".

This plugin requires a plugin account and the account has two parameters:

### Parameter: Base URL
This parameter is equivalent to `-Dsonar.host.url` when using the command line tool.

This is the base URL of your SonarQube server. It may be the root of the FQDN address or a path within, depending on how SonarQube was deployed. For example `https://sonar.kaholodemo.net` or maybe `https://sonar.kaholodemo.net/sonarqube`.

### Parameter: Token
This parameter is equivalent to `-Dsonar.login` when using the command line tool.

This is a SonarQube-issued token, which may be any of a User, Project Analysis, or Global Analysis token to authenticate with SonarQube. The token must be stored in the Kaholo Vault so it does not appear in the UI, error messages or log files. This can be done using the "Add New Vault Item" feature in the drop-down for the Token parameter while configuring the account.

## Method: Run Sonar Scanner
This method runs sonar-scanner on a code project on the Kaholo agent, using Docker image `sonarsource/sonar-scanner-cli`. To do this the code project is typically first cloned to the agent using the [Git Plugin](https://github.com/Kaholo/kaholo-plugin-git).

### Parameter: Working Directory
Working Directory is the base directory where the command will be run. Often but not necessarily it is the root of the code repository. If you wish to scan only certain parts of the project, parameter "Sources Path" is available to narrow the scope. If left empty, the default working directory on the Kaholo agent will be used.

It is recommended to always use the default Kaholo working directory and work with relative paths, for convenience.

If you have cloned a git project relying on default configuration, for example `https://github.com/facefusion/facefusion.git`, it will land in a subdirectory of the default working directory named the same as the git repository, in this case `facefusion` would be the Working Directory. It can also be given in absolute format, for example on a default Kaholo agent the directory would be `/twiddlebug/workspace/facefusion`.

If there's any confusion about where the repository might be, it may be helpful to run a command using the [Command Line Plugin](https://github.com/Kaholo/kaholo-plugin-cmd), for example `find . -type d`. Note Command Line actions also have a working directory that if left empty will be the default Kaholo agent working directory. To see every directory in the agent set the working directory to `/` (root) instead.

### Parameter: Project Key
This parameter is equivalent to `-Dsonar.projectKey` when using the command line tool.

Every project in SonarQube has an identifier called the Project Key. It may be up to 400 alphanumeric characters with no spaces and at least one numeric digit. It may also contain one or more of these four characters `-_.:` (dash, underscore, period, and colon).

SonarQube projects typically correspond one-to-one with code repositories and are named similarly.

### Parameter: Sources Path
This parameter is equivalent to `-Dsonar.sources` when using the command line tool.

If you want to scan the entire project (Working Directory) this parameter may be left empty.

In the event there are only parts of the source code project that you wish to scan, specify the paths relative to the Working Directory here, one per line. For example in a Java project you might want to direct to the compiled jar and not the code files, so you might specify `target`.

### Parameter: Additional Arguments
Any number of **optional** additional arguments may be supplied here, one argument per line. For example

    --debug                        (get extra output)
    -Dsonar.sourceEncoding=UTF-16  (code written in Chinese)
    
## Method: Create Project
To create a new project in the SonarQube server. This may not be a necessary step, for running Sonar Scanner with sufficient privileges will automatically create a new project for the results.

### Parameter: Project Name
The user-friendly name for the new project.

### Parameter: Project Key
Every project in SonarQube requires a unique identifier called the Project Key. It may be up to 400 alphanumeric characters with no spaces and at least one numeric digit. It may also contain one or more of these four characters `-_.:` (dash, underscore, period, and colon).

### Parameter: Organization Key
If using the SonarCloud version of the project, an Organization Key is required as well.

### Parameter: Visibility
Either Public or Private, if Public then any authenticated user may browse your project. If Private then more granular security rules are used to determine who may or may not access the project and how.

## Method: Get Violations
This method gets the total number of issues in all states for a project. This includes bugs, smells, and vulnerabilities.

### Parameter: Project Key
The Project Key of the project for which you want a count of violations.

## Method: Get Code Coverage
This method gets the percentage of code coverage (by unit tests) for a project.

### Parameter: Project Key
The Project Key of the project for which you want the code coverage statistic.

## Method: Search Projects
This method searches for projects in the SonarQube server.

### Parameter: Query
A substring that is matched against Project Key. Only projects with matching keys will be returned. If left empty, all projects are returned.

For example if the list of projects include:

    kaholo-plugin-github
    kaholo-trigger-github
    kaholo-plugin-docker

A query of `git` will return the first two projects, a query of `trigger` will return only the second, a query of `kaholo-plug` will return the first and third, and an empty parameter (no query at all) will return all three.
