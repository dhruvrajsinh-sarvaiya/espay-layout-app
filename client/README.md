## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build
```

### Configurations
APP CONFIGURATION
File Path : {ROOT}\src\constants\AppConfig.js

## Change following configurations

1. appLogo: require('Assets/img/cool_dex_one.png'), 
- Change logo path what do you want to use.

2. brandName: 'COOLDEX',
- Change or modify brand name of the explorer.

3. darkMode: false,
- To change default mode (true : default dark mode, false : default white mode)

4. copyRightText: 'COOLDEX © 2019 All Rights Reserved.',
- Change copy right text for the explorer

5. myAccountSwaggerUrl : 'https://6768-2901zz03.azurewebsites.net/frontapi/'
- Set swagger API URL

6. signalRURL : 'https://6768-2901zz03.azurewebsites.net/frontapi/Market',
- Set signalR URL 

7. coinlistImageurl: 'https://6768-2901zz03.azurewebsites.net/frontapi/CurrencyLogo',
- Set coin image list URL 

8. signalRChatURL: 'https://6768-2901zz03.azurewebsites.net/frontapi/Chat',
- Set Chat SignalR URL 


## NODE API CONFIGURATION

File Path : {ROOT}\src\api\index.js

1. baseURL: 'https://6768-2901zz06.azurewebsites.net/',
- Set Node API URL.
