/**
 * Helpers Functions
 */
import moment from 'moment';

import deviceParser from 'ua-parser-js';

import api from '../api';

import setAuthToken from '../utils/setAuthToken';

//Added by salim
import axios from 'axios';
import { configureStore } from '../store';
import AppConfig from 'Constants/AppConfig';
import { formatPhoneNumber } from 'react-phone-number-input';
import $ from "jquery";
import validator from 'validator';
const qs = require('querystring');
var ip = require('ip');

var ipAddress = '';
/*
import {
    isMobileOnly    
  } from "react-device-detect"; 
  */

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (validator.matches(hex, /^#([A-Fa-f0-9]{3}){1,2}$/)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format, addBit) {
    var timestamp = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
    // return moment(time).format(formatDate);
    if (addBit) {
        return moment(timestamp).add(330, 'minutes').format(formatDate);
    } else {
        return moment(timestamp).format(formatDate);
    }
}

/**
 * Convert Date To Timestamp
*/
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}

/**
 * Get cookie by its name
 */
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Set cookie with name and value
 */
export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * return device info
 * Change by salim...
 */
export function getDeviceInfo() {
    var myParser = new deviceParser.UAParser();
    var deviceInfo = myParser.getResult();

    var strDevice = deviceInfo.browser.name + '_' + deviceInfo.browser.version;
    strDevice = strDevice + '|' + deviceInfo.os.name + '_' + deviceInfo.os.version;
    strDevice = strDevice + '|' + deviceInfo.cpu.architecture;
    /* strDevice = strDevice + '|' + deviceInfo.engine.name + '_' + deviceInfo.engine.version;
    strDevice = strDevice + '|' + screen.colorDepth;
    strDevice = strDevice + '|' + screen.pixelDepth;
    strDevice = strDevice + '|' + screen.width;
    strDevice = strDevice + '|' + screen.height; */

    return strDevice;
}

/**
 * return device info
 */
function getDeviceInfo2(callback) {
    var myParser = new deviceParser.UAParser();
    var device = myParser.getResult();
    device.colorDepth = screen.colorDepth;
    device.pixelDepth = screen.pixelDepth;
    device.width = screen.width;
    device.height = screen.height;
    //return device;
    callback(device);
}

/**
* get security token from api and stored in localstorage
*/
export function setSessionToken() {
    // var deviceInfo = getDeviceInfo2();
    //console.log('here');
    getDeviceInfo2(function (deviceInfo) {
        //console.log(deviceInfo);
        api.post('/public/generateToken', { data: deviceInfo })
            .then(function (response) {
                // console.log("setSessionToken",response.data);
                //console.log(response.data.data.token_id);
                // localStorage.setItem('access_token', response.data.token);        
                // localStorage.setItem('id_token', response.data.refreshToken);
                //Added by Devangbhai..
                localStorage.setItem('front_access_token', response.data.tokenData.token);
                localStorage.setItem('front_refresh_token', response.data.tokenData.refreshToken);
                //return {accessToken:response.data.data.token_id, idToken: response.data.data.refresh_token_id}

                //console.log('set jwt tokwn in header');
                //setAuthToken(response.data.tokenData.token);
                ipAddress = response.data.ipAddress;
            })
            .catch(error => error, {});
    })

}

/**
 * Added by salim
 * Function to Alpha with space
 */
export function isAlphaWithSpace(string) {
    let check = validator.matches(string,/^[a-zA-Z ]*$/g);
    return check
}

/**
 * Added by salim
 * Function to Country list
 */
export function countryList() {
    let list = [
        { id: 1, name: 'Afghanistan' },
        { id: 2, name: 'Bhutan' },
        { id: 3, name: 'Colombia' },
        { id: 4, name: 'Denmark' },
        { id: 5, name: 'Egypt' },
        { id: 6, name: 'France' },
        { id: 7, name: 'Germany' },
        { id: 8, name: 'Haiti' },
        { id: 9, name: 'India' },
        { id: 10, name: 'Japan' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to Country list
 */
export function complainTypeList() {
    let list = [
        { id: 1, name: 'Help with Deposits' },
        { id: 2, name: 'Help with Withdrawals' },
        { id: 3, name: 'Not Received Email' },
        { id: 4, name: 'Help with Authentication' },
        { id: 5, name: 'Help with Account' },
        { id: 6, name: 'Help with Trade' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to get IP Address from the node api create by kushalbhai
 */
async function nodeIPAddress() {
    var _ipAddress = '';

    //Check internet connection...
    if (!checkInternet()) {
        return {
            _ipAddress: '',
            ReturnMsg: 'sidebar.checkInternet'
        }
    } else {
        if (window.location.hostname === 'localhost' || ValidateIPaddress(window.location.hostname)) {
            _ipAddress = '45.116.123.43';
            // } else if(ipAddress === '') {
        } else {
            await api.get('/api/private/v1/sitesetting/getIpAddress')
                .then(function (response) {
                    if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
                        _ipAddress = response.data.ipAddress;
                    }
                })
                .catch(error => error, {});
        } /* else {
            _ipAddress = ipAddress;
        } */
    }

    return _ipAddress;
}

/**
 * Added by salim
 * Function to get IP Address
 */
export function getIPAddress() {
    // return ipAddress; //'45.116.123.43'; //ip.address();
    // return window.location.hostname === 'localhost' ? '45.116.123.43' : ipAddress;
    return nodeIPAddress();
}

/**
 * Added by salim
 * Function to check host name as local ip address
 */
function ValidateIPaddress(ipaddress) {
    if (validator.matches(ipaddress,/^172\.20\.65\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        return (true)
    }
    return (false)
}

/**
 * Added by salim
 * Function to get hostname
 */
export function getHostName() {
    //return 'paro'; //window.location.hostname;
    return window.location.hostname === 'localhost' ? AppConfig.brandName : window.location.hostname;
}

/**
 * Added by salim
 * Function to get mode
 */
export function getMode() {
    return 'Web';
}

/**
 * Added by salim
 * Function to 401 Error Token Expire
 */
export function redirectToLogin() {
    // localStorage.removeItem('tokenID');    
    localStorage.removeItem('gen_access_token');
    localStorage.removeItem('gen_id_token');
    localStorage.removeItem('gen_refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('timestamp');
    sessionStorage.removeItem("simgUrl");
    window.location.href = '/';
}

/**
 * Added by salim
 * Function to refresh token
 */
export function autoRefreshToken() {
    // console.log('autoRefreshToken');
    let store = configureStore();

    var now = new Date();
    let diffTime = localStorage.getItem('timestamp') - now.getTime();

    (function callRefreshFunction(NewTime) {
        setTimeout(function () {
            // console.log('callRefreshFunction');
            var now = new Date();
            localStorage.setItem('timestamp', now.getTime() + AppConfig.refreshTokenInterval);
            store.dispatch({ type: 'REFRESH_TOKEN', payload: {} });
            callRefreshFunction(AppConfig.refreshTokenInterval);
        }, NewTime);
    }(diffTime));
}

/**
 * Added by salim
 * Function to Convert text to image
 */
export function textToImage(textStr) {
    var textStr = textStr.toUpperCase()
    var tCtx = document.getElementById('textCanvas').getContext('2d');
    tCtx.canvas.width = tCtx.measureText(textStr).width + 50;
    tCtx.font = "12px Arial";
    tCtx.fillText(textStr, 0, 20);
    var imgUrl = tCtx.canvas.toDataURL();

    return imgUrl
}

/**
 * Added by salim
 * Function to Change Date Format
 */
export function changeDateFormat(date, format, addBit = true) {
    var timeStamp = convertDateToTimeStamp(date, format)
    var cDate = getTheDate(timeStamp, format, addBit);

    return cDate;
}

/**
 * Added by salim (dt:26/10/2018)
 * Function to After login generate localstorage variable
 */
export function generateLocalStorageVariable(access_token, id_token, refresh_token = '') {
    // localStorage.setItem('tokenID', tokenID);
    localStorage.setItem('gen_access_token', access_token);
    localStorage.setItem('gen_id_token', id_token);
    if (refresh_token !== '') {
        localStorage.setItem('gen_refresh_token', refresh_token);
    }
    localStorage.setItem('user_id', 'user-id');
    var now = new Date();
    localStorage.setItem('timestamp', now.getTime() + AppConfig.refreshTokenInterval);
}

/**
 * Added by salim (dt:27/10/2018)
 * Function to Swagger Post API
 */
var isCheckInternet = true;
export const swaggerPostAPI = async (methodName, request, headers = {}) => {

    //added by salim dt:06/02/2019
    //Check internet connection.
    if(!checkInternet() && isCheckInternet) {
        alert('Please check you internet connection.');
        isCheckInternet = false;
        var closeInterval = setInterval(() => {
            if(checkInternet()) {
                clearIntervalForInternet(closeInterval);
            }
        },1000);
    } else if(!isCheckInternet) {
        return false;
    } else {
        // code by devang parekh for getting latest token value in request
        if (typeof headers.Authorization !== 'undefined' && headers.Authorization !== '') {
            headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
        }

        axios.defaults.headers.common = headers;
        var responseData = await axios.post(AppConfig.myAccountSwaggerUrl + methodName, request)
            .then(response => JSON.parse(JSON.stringify(response)))
            .catch(error => JSON.parse(JSON.stringify(error.response)));
        /* .interceptors.response.use(null, (error) => {
            console.log('interceptors',error);
        }); */
        /* .catch(function (error) {
            var errCode = statusErrCode();
            var resError = JSON.parse(JSON.stringify(error.response));
            var error = {};
            console.log('swaggerPostAPI',resError);

            if (errCode.includes(resError.status)) {
                error = staticResponseObj(resError.status);
            } else {
                error = resError.data;
            }
            return error;
        }); */
        // console.log('Response :',responseData.status);
        const errCode = statusErrCode();
        const lgnErrCode = loginErrCode();
        var response = {};
        try {
            //console.log('try',errCode.includes(responseData.status));
            if (lgnErrCode.includes(responseData.status)) {
                redirectToLogin();
            } else if (errCode.includes(responseData.status)) {
                response = staticResponseObj(responseData.status);
            } else {
                response = responseData.data;
            }

        } catch (error) {
            //console.log('catch',staticResponseObj(responseData.status));
            response = staticResponseObj(responseData.status);
        }
        response.statusCode = responseData.status;
        // console.log('End Response :',response);
        // delete axios.defaults.headers.common;
        return response;
    }
}

/**
 * Added by salim (dt:04/12/2018)
 * Function to Swagger Post with header form API
 */
export const swaggerPostHeaderFormAPI = async (methodName, request) => {
    delete axios.defaults.headers.common;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    var responseData = await axios.post(AppConfig.myAccountSwaggerUrl + methodName, qs.stringify(request))
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));
    /* .catch(function (error) {
        var errCode = statusErrCode();
        var resError = JSON.parse(JSON.stringify(error.response));
        console.log('Catch',resError);
        var error = {};

        if (errCode.includes(resError.status)) {
            error = staticResponseObj(resError.status);
        } else {
            error = resError.data;
        }
        return error;
    }); */
    //console.log('sdfdsf',responseData.status);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        //console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
            //console.log('if',response);
        } else {
            response = {
                ReturnCode: 0,
                ErrorCode: 0,
                ReturnMsg: 'Success',
                access_token: responseData.data.access_token,
                refresh_token: responseData.data.refresh_token,
                id_token: responseData.data.id_token
            }
            //console.log('else',response);
        }
    } catch (error) {
        //console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}

/**
 * Added by salim (dt:27/10/2018)
 * Function to Swagger Get API
 */
export const swaggerGetAPI = async (methodName, request, headers = {}) => {

    //added by salim dt:06/02/2019
    //Check internet connection.
    if(!checkInternet() && isCheckInternet) {
        alert('Please check you internet connection.');
        isCheckInternet = false;
        var closeInterval = setInterval(() => {
            if(checkInternet()) {
                clearIntervalForInternet(closeInterval);
            }
        },1000);
    } else if(!isCheckInternet) {
        return false;
    } else {
        // code by devang parekh for getting latest token value in request
        if (typeof headers.Authorization !== 'undefined' && headers.Authorization !== '') {
            headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
        }

        axios.defaults.headers.common = headers;
        var responseData = await axios.get(AppConfig.myAccountSwaggerUrl + methodName, request)
            .then(response => JSON.parse(JSON.stringify(response)))
            .catch(error => JSON.parse(JSON.stringify(error.response)));

        /* delete axios.defaults.headers.common; 
        return responseData; */
        // console.log('Response :',responseData);
        const errCode = statusErrCode();
        const lgnErrCode = loginErrCode();
        var response = {};
        try {
            //console.log('try',errCode.includes(responseData.status));
            if (lgnErrCode.includes(responseData.status)) {
                redirectToLogin();
            } else if (errCode.includes(responseData.status)) {
                response = staticResponseObj(responseData.status);
            } else {
                response = responseData.data;
            }
        } catch (error) {
            //console.log('catch',staticResponseObj(responseData.status));
            response = staticResponseObj(responseData.status);
        }
        response.statusCode = responseData.status;
        // console.log('End Response :',response);
        // delete axios.defaults.headers.common;
        return response;
    }
}


/**
 * Added by salim (dt:27/10/2018)
 * Function to define status code array
 */
function statusErrCode() {
    let list = [404, 500, 502, 503];
    return list;
}
export function statusErrCodeList() {
    return statusErrCode();
}

/**
 * Added by salim (dt:27/10/2018)
 * Function to define redirct to login status code array
 */
export function loginErrCode() {
    let list = [401, 498];
    return list;
}

/**
 * Added by salim (dt:27/10/2018)
 * Function to static response
 */
function staticResponseObj(statusCode) {
    var response = {
        ErrorCode: statusCode,
        ReturnCode: 1,
        ReturnMsg: "Please try after sometime.",
        statusCode: statusCode,
    };

    return response;
}

export function staticResponse(statusCode) {
    return staticResponseObj();
}

/**
 * Added by Tejas (dt:9/10/2018)
 * Function to Swagger Delete API
 */
var isCheckInternet = true;
export const swaggerDeleteAPI = async (methodName, request, headers = {}) => {

    //Check internet connection.
    if(!checkInternet() && isCheckInternet) {
        alert('Please check you internet connection.');
        isCheckInternet = false;
        var closeInterval = setInterval(() => {
            if(checkInternet()) {
                clearIntervalForInternet(closeInterval);
            }
        },1000);
    } else if(!isCheckInternet) {
        return false;
    } else {
        // code by devang parekh for getting latest token value in request
        if (typeof headers.Authorization !== 'undefined' && headers.Authorization !== '') {
            headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
        }

        axios.defaults.headers.common = headers;
        var responseData = await axios.delete(AppConfig.myAccountSwaggerUrl + methodName, request)
            .then(response => JSON.parse(JSON.stringify(response)))
            .catch(error => JSON.parse(JSON.stringify(error.response)));
        
        const errCode = statusErrCode();
        const lgnErrCode = loginErrCode();
        var response = {};
        try {
            //console.log('try',errCode.includes(responseData.status));
            if (lgnErrCode.includes(responseData.status)) {
                redirectToLogin();
            } else if (errCode.includes(responseData.status)) {
                response = staticResponseObj(responseData.status);
            } else {
                response = responseData.data;
            }

        } catch (error) {
            //console.log('catch',staticResponseObj(responseData.status));
            response = staticResponseObj(responseData.status);
        }
        response.statusCode = responseData.status;        
        return response;
    }
}

/* 
    Developer : Nishant Vadgama
    Added to get explorer link in transfer in & out report
*/
export function getExplorerLink(coin, trn) {
    let link = "";
    switch (coin.toLowerCase()) {
        case 'btc':
            link = 'https://www.blockchain.com/btc/tx/' + trn;
            break;
        case 'eth':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'ltc':
            link = 'http://explorer.litecoin.net/tx/' + trn;
            break;
        case 'xrp':
            link = 'https://xrpcharts.ripple.com/#/transactions/' + trn;
            break;
        case 'btg':
            link = 'https://btgexplorer.com/tx/' + trn;
            break;
        case 'bch':
            link = 'https://bch.btc.com/' + trn;
            break;
        case 'aristo':
            link = 'http://explorer.aristocoin.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'bcim':
            link = 'http://explorer.bitcoinimprove.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'cvc':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'rep':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'omg':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'pay':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'gnt':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'bat':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'knc':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'zrx':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'fun':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'eos':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'qrl':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'nmr':
            link = 'https://etherscan.io/tx/' + trn;
            break;
        case 'lmx':
            link = 'http://explorer.lumaxcoin.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'atcp':
            link = 'http://explorer.atccoinplus.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'atcc':
            link = 'http://explorer.atccoin.com/ExplorerATCC/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'btslk':
            link = 'http://explorer.bitcoinsleek.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'cym':
            link = 'http://explorer.coinyummy.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'btf':
            link = 'http://explorer.bitfoodie.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'stw':
            link = 'http://explorer.stewcoin.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'pcp':
            link = 'http://explorer.procoinpay.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'pcpl':
            link = 'http://explorer.procoinplus.com/BlockChain/Explorer/Tx/' + trn;
            break;
        case 'tusd':
            link = 'https://etherscan.io/tx/' + trn;
            break;
    }
    return link;
}

/* 
    Addedby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 03-11-2018
    UpdatedDate : 20-11-2018
    Description : get sitesetting and stored in localstorage
*/
export function setSitesetting() {
    api.get('/api/private/v1/sitesetting/getSiteSettingById/' + AppConfig.siteId)
        .then(function (response) {
            if (typeof response.data.data != 'undefined' && response.data.responseCode == 0) {
                var setting = response.data.data;
                localStorage.setItem('appLogo', setting.image.logoPreviewUrl);
                localStorage.setItem('general', JSON.stringify(setting.general));
                localStorage.setItem('social', JSON.stringify(setting.social));

                //Add by Jayesh on 26-12-2018
                localStorage.setItem('chat', btoa(JSON.stringify(setting.chatscript)));
                //localStorage.setItem('ganalytics',btoa(JSON.stringify(setting.seo)));

                // Added by Jayesh for google analytics on 28-12-2018 updated on 23-01-2019
                /* <!-- Global site tag (gtag.js) - Google Analytics --> */
                if (typeof setting.seo !== 'undefined' && setting.seo !== null) {
                    try {
                        let ganalytics = setting.seo;

                        if (typeof ganalytics.googleanalytics_url !== 'undefined' && ganalytics.googleanalytics_url !== '') {
                            const scripttag = document.createElement("script");
                            scripttag.setAttribute('async', '');
                            scripttag.src = ganalytics.googleanalytics_url;
                            document.head.appendChild(scripttag);
                        }
                        if (typeof ganalytics.googleanalytics !== 'undefined' && ganalytics.googleanalytics !== '') {
                            var regexformula = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
                            var matchregex;
                            while (matchregex = regexformula.exec(ganalytics.googleanalytics)) {
                                const script_anlytics = document.createElement("script");
                                const scriptText_analytics = document.createTextNode(matchregex[1]);
                                script_anlytics.appendChild(scriptText_analytics);
                                document.head.appendChild(script_anlytics);
                            }
                        }
                    } catch (error) {
                    }
                }

                if (typeof setting.server.maintenance_mode != 'undefined' && setting.server.maintenance_mode !== null && setting.server.maintenance_mode != '' && setting.server.maintenance_mode == 1 && window.location.pathname !== '/maintenance') {
                    window.location.href = '/maintenance';
                }
                if (typeof setting.server.maintenance_mode != 'undefined' && setting.server.maintenance_mode == 0 && window.location.pathname == '/maintenance') {
                    window.location.href = '/';
                }
            }
        })
        .catch(error => error, {});
}

/**
 * Added by salim (dt:06/11/2018)
 * Function to MUIDatatable Option language text.
 */
/* export function dataTableOptionsText() {
    let textLabels = {
        body: {
            noMatch: <IntlMessages id="wallet.emptyTable" />,
            toolTip: <IntlMessages id="wallet.sort" />,
        },
        pagination: {
            next: <IntlMessages id="datatable.nextPage" />,
            previous: <IntlMessages id="datatable.previousPage" />,
            rowsPerPage: <IntlMessages id="datatable.rowsPerPage" />,
            displayRows: <IntlMessages id="datatable.of" />,
        },
        toolbar: {
            search: <IntlMessages id="datatable.search" />,
            downloadCsv: <IntlMessages id="datatable.downloadCSV" />,
            print: <IntlMessages id="datatable.print" />,
            viewColumns: <IntlMessages id="datatable.viewColumns" />,
            filterTable: <IntlMessages id="datatable.filterTable" />,
        },
        filter: {
            all: <IntlMessages id="datatable.all" />,
            title: <IntlMessages id="datatable.filters" />,
            reset: <IntlMessages id="datatable.reset" />,
        },
        viewColumns: {
            title: <IntlMessages id="datatable.showColumns" />,
            titleAria: <IntlMessages id="datatable.show_hide_table_cols" />,
        },
        selectedRows: {
            text: <IntlMessages id="datatable.rowsSelected" />,
            delete: <IntlMessages id="datatable.delete" />,
            deleteAria: <IntlMessages id="datatable.deleteSelectedRows" />,
        }
    }

    return textLabels;
} */

/*
* Added by salim (dt:26-11-2018)
* Function to get original mobile with country code.
*/
export function getMobileNoWithCountryCode(str_mobile) {
    var validMobile = formatPhoneNumber(str_mobile, 'International');
    var countryCode = validMobile.substr(1, validMobile.indexOf(' ')).trim();
    validMobile = validMobile.substring(validMobile.indexOf(" ") + 1);
    validMobile = validMobile.replace(/\s/g, '');

    var mobObj = {};
    mobObj.mobile = validMobile;
    mobObj.country_code = countryCode;

    return mobObj;
}

/*
* Added by salim (dt:06-12-2018)
* Function to convert object to form-data.
*/
export function convertObjToFormData(ObjData) {
    const formData = new FormData();
    $.map(ObjData, (item, key) => {
        formData.append([key], item);
    });

    return formData;
}

/**
 * Added by salim
 * Function to <Script> validation
 */
export function isScriptTag(string) {
    let check = validator.matches(string,/<script.*?>([\s\S]*?)<\/script>/);
    return check
}


/**
 * Added by salim
 * Function to Convert Object to string with seprated value
 */
export function convertObjectToString(obj, sepration = ',') {
    // console.log('convert string :',Object.keys(obj).map(function(k){return items[k]}).join(sepration)); 
    return Object.values(obj).join(sepration);
}

/**
 * Added by salim
 * Function to Convert Check Internet Connection
 */
function checkInternet() {
    return navigator.onLine ? true : false;
}

function clearIntervalForInternet(closeInterval) {
    clearInterval(closeInterval);
    window.location.reload();
}

export function checkInternetByExptFun() {
    return checkInternet();
}

export function splitString(str, tag, accessElement = '') {
    var response = str.split(tag);
    if(accessElement >= 0) {
        response = response[accessElement];
    }
    return response;
}

export function languageArray(lanKey = '') {
    var languages = {
        'en' : {
            languageId: "english",
            locale: "en",
            name: "English",
            icon: "en",
            rtlLayout: 0
        },
        'zh' : {
            languageId: "chinese",
            locale: "zh",
            name: "Chinese",
            icon: "zh",
            rtlLayout: 0
        },
        'ru' : {
            languageId: "russian",
            locale: "ru",
            name: "Russian",
            icon: "ru",
            rtlLayout: 0
        },
        'he' : {
            languageId: "hebrew",
            locale: "he",
            name: "Hebrew",
            icon: "he",
            rtlLayout: 1
        },
        'fr' : {
            languageId: "french",
            locale: "fr",
            name: "French",
            icon: "fr",
            rtlLayout: 0
        },
        'ar' : {
            languageId: "saudi-arabia",
            locale: "ar",
            name: "Arabic",
            icon: "ar",
            rtlLayout: 1
        },
        'de' : {
            languageId: "german",
            locale: "de",
            name: "German",
            icon: "de",
            rtlLayout: 0
        },
        'es' : {
            languageId: "spanish",
            locale: "es",
            name: "Spanish",
            icon: "es",
            rtlLayout: 0
        },
        'ja' : {
            languageId: "japanese",
            locale: "ja",
            name: "Japanese",
            icon: "ja",
            rtlLayout: 0
        },
        'ko' : {
            languageId: "korean",
            locale: "ko",
            name: "Korean",
            icon: "ko",
            rtlLayout: 0
        },
        'it' : {
            languageId: "italian",
            locale: "it",
            name: "Italian",
            icon: "it",
            rtlLayout: 0
        },
        'hu' : {
            languageId: "hungarian",
            locale: "hu",
            name: "Hungarian",
            icon: "hu",
            rtlLayout: 0
        },
        'nl' : {
            languageId: "dutch",
            locale: "nl",
            name: "Dutch",
            icon: "du",
            rtlLayout: 0
        },
        'pt' : {
            languageId: "portuguese",
            locale: "pt",
            name: "Portuguese",
            icon: "pt",
            rtlLayout: 0
        }
    }

    if(lanKey !== '') {
        languages =  languages[lanKey];
    }
    
    return languages;   
}

// Url Encription
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function setServiceManager() {

    let isSubscribed = false;
    let swRegistration = null;
    let applicationKey = "BM0yH9JtGnmzF8Mm3Tn_ua36PA9FZzufsmFYF2Ul8MZOoXW13hvZo9NYVeIPDZCaG_gBrdE20QwoYetxpo0wuh8";
    // Installing service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
        navigator.serviceWorker.register('sw.js')
            .then(function (swReg) {
                console.log('service worker registered');

                swRegistration = swReg;

                swRegistration.pushManager.getSubscription()
                    .then(function (subscription) {
                        console.log("subscription", subscription);
                        isSubscribed = !(subscription === null);

                        if (isSubscribed) {
                            console.log('User is subscribed');
                        } else {
                            swRegistration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlB64ToUint8Array(applicationKey)
                            })
                                .then(function (subscription) {
                                    console.log(subscription);
                                    console.log('User is subscribed');

                                    saveSubscription(subscription);

                                    isSubscribed = true;
                                })
                                .catch(function (err) {
                                    console.log('Failed to subscribe user: ', err);
                                })
                        }
                    })
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
    }
}

// Send request to database for add new subscriber
function saveSubscription(subscription) {
    console.log("=======", JSON.stringify(subscription));
    let jsondata = JSON.stringify(subscription);
    api.post('/api/private/v1/subscribe', { jsondata })

        .then(function (response) {
            console.log("response", response);
            // if (typeof response.data.data != 'undefined' && response.data.responseCode == 0) {

            // }
        })
        .catch(error => error, {});

    // let xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("POST", "http://localhost:5000/api/private/v1/subscribe");
    // xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xmlHttp.setRequestHeader("Authorization", 'JWT ' + localStorage.getItem('front_access_token'));
    // xmlHttp.onreadystatechange = function () {
    //     if (xmlHttp.readyState != 4) return;
    //     if (xmlHttp.status != 200 && xmlHttp.status != 304) {
    //         console.log('HTTP error ' + xmlHttp.status, null);
    //     } else {
    //         console.log("User subscribed to server");
    //     }
    // };

    // xmlHttp.send(JSON.stringify(subscription));

    // await api.post('/api/private/v1/contactus/addContact', {contactdata})
    // .then(response => response)
    // .catch(error => JSON.parse(JSON.stringify(error.response)));

}

/**
 * Added by dhara gajera 29/1/2019
 * Function to Strip and HTML Tags validation
 */
export function isHtmlTag(string) {
    let check = validator.matches(string,/(<([^>]+)>)/ig);
    return check
}