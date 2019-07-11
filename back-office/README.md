## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build
```

## Configuration 

All below Configuration change for backoffice.

-> File Path : backoffice/src/constants/AppConfig.js


## Change following configuration:

-> appLogo : Change company logo path (backoffice/src/assets/img/cool_dex_one.png)
-> brandName : change Company Name/Title
-> darkMode : Theme Change (Dark/Light)
-> sidebarImage : Change Sidebar Image path (backoffice/src/assets/img/sidebar-4.jpg)
-> locale : Default Lanuage
-> enableUserTour : Display intro popup.
-> copyRightText : Change copy right text for fotter.
-> backofficeSwaggerUrl : Swagger API Url
-> defaultCountryCode : Default country code for signup.
-> facebookProviderID : Facebook provider ID.
-> googleClientID : Google Client ID.
-> afterLoginRedirect : After login redirect to page.
-> totalRecordDisplayInList : Total record display in table.
-> coinlistImageurl : Set coin list image url for swagger.
-> rowsPerPageOptions : For Table display row per page option in footer.


## Node API Configuration:

1. File Path : backoffice/src/api/index.js
baseURL : Change your node api url.


## Change Favicon configuration

1. File Path : backoffice/public/favicon.ico
Put your favicon image with this formate/file name (favicon.ico & favicon.png)

## Change Logo configuration

1. File Path : backoffice/src/assets/img/cool_dex_one.png
Put your company logo image with this formate/file name (cool_dex_one.png)

## Change Title for table

1. File Path : backoffice/public/index.html
Put your company name replace with (COOLDEX Backoffice)