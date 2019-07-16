Go To Project 'app' folder and open Terminal

# install dependencies
npm install
Add google-service.json file in android/app/ path

# serve with hot reload
npm start

# build App
react-native run-android

For Test in Live/Stagging : 

	Config file : src\controllers\AppConfig.js

	Use below configuration for live
	baseURL: 'https://6768-2901zz03.azurewebsites.net/',
	hostName: 'FrontAPI',
	
	Use below configuration for stagging
	baseURL: 'https://cleandevtest.azurewebsites.net/',
	hostName: 'SSOAccountStaging',