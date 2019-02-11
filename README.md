# README #

### What is this repository for? ###

* CloudUAV data cloud
* Upload any UAV data (images, json, log, .laz/.las)
* View the uploaded data. User can download, delete, and share the data.

### How do I get set up? ###
* Clone the repository
* Setup gulp on your machine using npm.
    * ```cd frontend-v1.0```
    * Install all package dependencies from package.json ```npm install```
* Once gulp has been setup and all package dependencies have been installed, run ```gulp build --dev``` and a localhost should be running. Navigate to http://localhost:4006/ in the browser and the project should be displayed.
    * Note: if you do not have clouduav_backend running on your machine please do not run it on dev mode b/c the site will not work instead run it on prod mode.
    * to run in production, ```gulp build --prod```
    * ```gulp build``` will by default run in development mode.
* If you need to install more gulp plugins for your project, run ```npm install [gulp-plugin-name] --save-dev```
* This project contains a config file that points to the backend. The backend is contained in the repository called clouduav_backend. If running this project in development, the backend should be running on your localhost. 

### Contribution guidelines ###

* Code review