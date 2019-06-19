/**
 * Helpers Functions
 */
import moment from 'moment';

import deviceParser from 'ua-parser-js';

import api from '../api';
import validator from 'validator';
//import setAuthToken from '../utils/setAuthToken';

//Added by salim
import axios from 'axios';

import { configureStore } from '../store';
import AppConfig from 'Constants/AppConfig';
// var ip = require('ip');
import $ from "jquery";
import { formatPhoneNumber } from 'react-phone-number-input';

//import menuData from './menuDetail.js';

const qs = require('querystring');
//var ipAddress = '';
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
    getDeviceInfo2(function (deviceInfo) {
        // console.log(deviceInfo);
        api.post('/public/generateToken', { data: deviceInfo })
            .then(function (response) {
                // console.log("setSessionToken", response.data);
                localStorage.setItem('access_token', response.data.tokenData.token);
                localStorage.setItem('id_token', response.data.tokenData.refreshToken);
                //return {accessToken:response.data.data.token_id, idToken: response.data.data.refresh_token_id}
                // setAuthToken(response.data.tokenData.token);
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
 * Function to Alpha Numeric with space
 */
export function isAlphaNumWithSpace(string) {
    let check = validator.matches(string,/^[a-zA-Z0-9 ]*$/g);
    return check
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
 * Function to Department list
 */
export function departmentList() {
    let list = [
        { id: 1, name: 'Account' },
        { id: 2, name: 'Android' },
        { id: 3, name: 'PHP' },
        { id: 4, name: 'Support' },
        { id: 5, name: 'Sales' },
        { id: 6, name: 'Account' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to Ticket Owner list
 */
export function ticketOwnerList() {
    let list = [
        { id: 1, name: 'Kartik Waghela' },
        { id: 2, name: 'Ravi Balani' },
        { id: 3, name: 'Tushar Jagad' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to Priority list
 */
export function priorityList() {
    let list = [
        { id: 1, name: 'High' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to Response list
 */
export function responseList() {
    let list = [
        { id: 1, name: 'Minutes' },
        { id: 2, name: 'Hours' },
        { id: 3, name: 'Days' }
    ];
    return list;
}

/**
 * Added by salim
 * Function to Resolve list
 */
export function resolveList() {
    let list = [
        { id: 1, name: 'Minutes' },
        { id: 2, name: 'Hours' },
        { id: 3, name: 'Days' }
    ];
    return list;
}

export const swaggerPostAPI = async (methodName, request, authHeaders = false) => {

    // code by devang parekh for getting latest token value in request
    var headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    var responseData = await axios.post(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    // console.log('Response :',responseData.status);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        // console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }

    } catch (error) {
        // console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    // console.log('End Response :',response);
    // delete axios.defaults.headers.common;
    return response;
}


//Added By Sanjay
export const swaggerDeleteAPI = async (methodName, request, authHeaders = false) => {

    var headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    var responseData = await axios.delete(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    // console.log('Response :',responseData.status);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        // console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }

    } catch (error) {
        // console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    // console.log('End Response :',response);
    // delete axios.defaults.headers.common;
    return response;
}


//Added By Sanjay
export const swaggerPutAPI = async (methodName, request, authHeaders = false) => {
    var headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    var responseData = await axios.put(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    // console.log('Response :',responseData.status);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        // console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }

    } catch (error) {
        // console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    // console.log('End Response :',response);
    // delete axios.defaults.headers.common;
    return response;
}

export const swaggerPostHeaderFormAPI = async (methodName, request) => {
    delete axios.defaults.headers.common;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    var responseData = await axios.post(AppConfig.backofficeSwaggerUrl + methodName, qs.stringify(request))
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));
    /* .catch(function (error) {
        var errCode = statusErrCode();
        var resError = JSON.parse(JSON.stringify(error.response));
        // console.log('Catch',resError);
        var error = {};
  
        if (errCode.includes(resError.status)) {
            error = staticResponseObj(resError.status);
        } else {
            error = resError.data;
        }
        return error;
    }); */
    // console.log('sdfdsf',responseData.status);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        // console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
            // console.log('if',response);
        } else {
            response = {
                ReturnCode: 0,
                ErrorCode: 0,
                ReturnMsg: 'Success',
                access_token: responseData.data.access_token,
                refresh_token: responseData.data.refresh_token,
                id_token: responseData.data.id_token
            }
            // console.log('else',response);
        }
    } catch (error) {
        // console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}

export const swaggerGetAPI = async (methodName, request, authHeaders = false) => {

    // code by devang parekh for getting latest token value in request
    var headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    var responseData = await axios.get(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    // console.log('Response :',responseData);
    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    var response = {};
    try {
        // console.log('try',errCode.includes(responseData.status));
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }
    } catch (error) {
        // console.log('catch',staticResponseObj(responseData.status));
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    // console.log('End Response :',response);
    // delete axios.defaults.headers.common;
    return response;
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

function staticResponseObj(statusCode) {
    response = {
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

// code added by devang parekh for redirect to login function
export function redirectToLogin() {
    // localStorage.removeItem('tokenID');    
    localStorage.removeItem('gen_access_token');
    localStorage.removeItem('gen_id_token');
    localStorage.removeItem('gen_refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('timestamp');
    sessionStorage.removeItem("simgUrl");
    sessionStorage.removeItem("role"); // by devang parekh for clear role info
    window.location.href = '/';
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
 * Added by salim
 * Function to get IP Address from the node api create by kushalbhai
 */
async function nodeIPAddress() {
    var _ipAddress = '';
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
 * Function to get Complain Status
 */
export function getComplainStatus() {
    var statusType = {
        'sidebar.open': 1,
        'sidebar.close': 2,
        'sidebar.pending': 3,
    }
    return statusType
}

/**
 * Added by salim
 * Function to get Complain Status
 */
export function getComplainType() {
    var complainType = {
        'sidebar.transaction': 2,
        'sidebar.wallet': 5,
        'sidebar.myAccount': 6,
    }
    return complainType
}

/**
 * Added by salim
 * Function to get Visible Profile
 */
export function getVisibleProfile() {
    var visibleProfile = {
        'sidebar.public': 1,
        'sidebar.private': 2
    }
    return visibleProfile
}

/**
 * Added by salim
 * Function to get Volume Time
 */
export function getVolumeTime() {
    var volumeTime = {
        'sidebar.day': 1,
        'sidebar.week': 2,
        'sidebar.month': 3,
        'sidebar.quarter': 4,
        'sidebar.year': 5
    }
    return volumeTime
}

/**
 * Added by salim
 * Function to get Change Frequency
 */
export function getChangeFrequency() {
    var changeFrequency = {
        'sidebar.oneTime': 1,
        'sidebar.daily': 2,
        'sidebar.weekly': 3,
        'sidebar.monthly': 4,
        'sidebar.quarterly': 5,
        'sidebar.yearly': 6
    }
    return changeFrequency
}

/**
 * Added by salim
 * Function to get Yes/No
 */
export function getYesNo() {
    var yesNo = {
        'sidebar.yes': 1,
        'sidebar.no': 2
    }
    return yesNo
}

/**
 * Added by salim
 * Function to get Yes/No
 */
export function getKycStatus() {
    var kycStatus = [
        { id: 1, label: 'sidebar.approval' },
        { id: 2, label: 'sidebar.reject' },
        { id: 4, label: 'sidebar.pending' },
    ]
    return kycStatus
}

//Added by Saloni
export function getAffiliateType() {
    var AffiliateStatus = [
        { id: 0, label: 'sidebar.selType' },
        { id: 1, label: 'sidebar.buytrade' },
        { id: 2, label: 'sidebar.selltrade' },
        { id: 3, label: 'sidebar.signup' },
        { id: 4, label: 'sidebar.deposite' },
        { id: 5, label: 'sidebar.withdraw' },
    ]
    return AffiliateStatus
}

export function getSignupStatus() {
    var kycStatus = [
        { id: 0, label: 'sidebar.selStatus' },
        { id: 1, label: 'sidebar.approval' },
        { id: 2, label: 'sidebar.reject' },
        { id: 4, label: 'sidebar.pending' },
    ]
    return kycStatus
}
export function getCommissionLevel() {
    var kycStatus = [
        { id: 0, label: 'sidebar.sellevel' },
        { id: 1, label: 'sidebar.level1' },
        { id: 2, label: 'sidebar.level2' },
        { id: 3, label: 'sidebar.level3' },
        { id: 4, label: 'sidebar.level4' },
        { id: 5, label: 'sidebar.level5' },
    ]
    return kycStatus
}


export function getActiveInactiveStatus() {
    var genStatus = [
        { id: 1, label: 'sidebar.active' },
        { id: 0, label: 'sidebar.inactive' }
    ]
    return genStatus;
}

//Added by saloni rathod.
export function getRuleStatus() {
    var ruleStatus = [
        { id: 0, label: 'sidebar.readOnly' },
        { id: 1, label: 'sidebar.write' },
        { id: 9, label: 'sidebar.invisible' },
    ];

    return ruleStatus;
}

export function getRuleVisibility() {
    var ruleVisibility = [
        { id: 0, label: "sidebar.hide" },
        { id: 1, label: "sidebar.show" }
    ];

    return ruleVisibility;
}

export function getUserStatus() {
    var Status = [
        { id: 0, label: "sidebar.inactive" },
        { id: 1, label: "sidebar.active" },
        { id: 2, label: "sidebar.confirmed" },
        { id: 3, label: "sidebar.unConfirmed" },
        { id: 4, label: "sidebar.unAssigned" },
        { id: 5, label: "sidbar.suspended" },
        { id: 6, label: "sidebar.block" },
        { id: 7, label: "sidebar.reqDeleted" },
        { id: 8, label: "sidebar.suspicious" },
        { id: 9, label: "sidebar.delete" },
        { id: 10, label: "sidebar.policyViolated" },
    ];

    return Status;
}

export function getSchemeStatus() {
    var genStatus = [
        { id: 1, label: 'sidebar.active' },
        { id: 0, label: 'sidebar.inactive' },
        { id: 9, label: 'sidebar.delete' }
    ]
    return genStatus;
}

export function getCommissionType() {
    var commissionType = [
        { id: 0, label: "sidebar.perTransaction" },
        { id: 1, label: "my_account.hourly" },
        { id: 2, label: "my_account.daily" },
        { id: 3, label: "my_account.weekly" }
    ];

    return commissionType;
}

export function getDistributionType() {
    var distributionType = [
        { id: 1, label: "sidebar.dependOnTransAmount" },
        { id: 2, label: "sidebar.CommissionBasedOnPreviousLevel" },
        { id: 3, label: "sidebar.CalculatedForEachTrans" },
    ];
    return distributionType;
}

/**
 * Added by dhara gajera 27/2/2019
 * Function to Strip and HTML Tags validation
 */
 export function isHtmlTag(string) {
     let check = validator.matches(string,/(<([^>]+)>)/ig);
     return check
 }
// code added by devang parekh for check menu permission or menu exists or not in menu list (26-3-2019)
export function checkAndGetMenuAccessDetail(GUID) {

    /* if (GUID.toLowerCase() === ('599E46F4-134F-6A4E-7EB0-9602D27FA72B').toLowerCase()) { // for add

        return { "Fields": [{ "FiledID": 63, "FieldName": "Currency Name", "Required": 1, "AccessRight": 1, "GUID": "27d380c0-5233-33d6-32e6-9e3b394b7679" }, { "FiledID": 64, "FieldName": "Status", "Required": 1, "AccessRight": 1, "GUID": "3923ee7c-1968-62e2-75e5-b1cf57070b59" }], "Tools": [], "ChildNodes": [], "SubModuleID": 0, "ID": 84, "Status": 1, "SubModuleName": "Add Manage Markets", "ParentID": 83, "Type": "9AAD5A4E", "Utility": ["D42A3D17", "204CE299", "8B92994B", "18736530", "8E6956F5"], "CrudOption": ["04F44CE0", "0BB7ACAC", "B873B896", "5645F321", "419E988B", "6AF64827"], "GUID": "599e46f4-134f-6a4e-7eb0-9602d27fa72b", "ParentGUID": "8b793242-783c-9c1e-2fd2-7cf8ec0e0142", "HasChild": false, "HasFields": true };

    } else if (GUID.toLowerCase() === ('48A57958-6D01-91F1-9736-7A503CB90D52').toLowerCase()) { // for edit

        return { "Fields": [{ "FiledID": 63, "FieldName": "Currency Name", "Required": 1, "AccessRight": 1, "GUID": "27d380c0-5233-33d6-32e6-9e3b394b7679" }, { "FiledID": 64, "FieldName": "Status", "Required": 1, "AccessRight": 1, "GUID": "3923ee7c-1968-62e2-75e5-b1cf57070b59" }], "Tools": [], "ChildNodes": [], "SubModuleID": 0, "ID": 85, "Status": 1, "SubModuleName": "Update Manage Markets", "ParentID": 83, "Type": "9AAD5A4E", "Utility": ["D42A3D17", "204CE299", "8B92994B", "18736530", "8E6956F5"], "CrudOption": ["04F44CE0", "0BB7ACAC", "B873B896", "5645F321", "419E988B", "6AF64827"], "GUID": "48a57958-6d01-91f1-9736-7a503cb90d52", "ParentGUID": "8b793242-783c-9c1e-2fd2-7cf8ec0e0142", "HasChild": false, "HasFields": false }

    } else {
 */
    //return findById(menuData,GUID);

    if (localStorage.getItem('role') !== null) {
        return findById(JSON.parse(localStorage.getItem('role')), GUID); // call recursive function for getting info by GUID if not found then return Undefined
    } else {
        return false;
    }
    /*    return { "GUID": "18FCC217-A78E-9CF9-6904-F17706051384", "Utility": ["D42A3D17", "204CE299", "8B92994B", "18736530", "8E6956F5"], "CrudOption": ["04F44CE0", "0BB7ACAC", "B873B896", "5645F321", "419E988B", "6AF64827"], "HasChild": true, "ChildNodes": [{ "GUID": "18FCC217-A78E-9CF9-6904-F17706051384", "Utility": ["D42A3D17", "204CE299", "8B92994B", "18736530", "8E6956F5"], "CrudOption": ["04F44CE0", "0BB7ACAC", "B873B896", "5645F321", "419E988B", "6AF64827"], "HasChild": true, "ChildNodes": [{ "GUID": "18FCC217-A78E-9CF9-6904-F17706051384", "Utility": ["D42A3D17", "204CE299", "8B92994B", "18736530", "8E6956F5"], "CrudOption": ["04F44CE0", "0BB7ACAC", "B873B896", "5645F321", "419E988B", "6AF64827"], "HasChild": true }] }] }
   } */

    //return findById(menuData,GUID); // call recursive function for getting info by GUID if not found then return Undefined

}

// code for recursively check menu detail by GUID or traverse all the object and find GUID which is pass from components
function findById(menuDetail, id) {

    //Early return when found first of an object
    if (menuDetail && menuDetail.GUID && menuDetail.GUID.toLowerCase() === id.toLowerCase()) {
        return menuDetail !== undefined ? menuDetail : false;
    }

    var result, p;
    // make loop or traverse all the nested object till GUID not found
    for (p in menuDetail) {
        if (menuDetail.hasOwnProperty(p) && typeof menuDetail[p] === 'object' && menuDetail[p] !== null) {
            result = findById(menuDetail[p], id); // call recursvily for checking GUID exists or not
            if (result) {
                return result !== undefined ? result : false;
            }
        }
    }

    // return 
    return result !== undefined ? result : false;
}
// end

// added by devang parekh (2-4-2019)
// code for store menu detail in cache
export function generateLocalStorageMenu(menuAccessList) {

    if (menuAccessList.Modules) {

        localStorage.setItem('role', JSON.stringify(menuAccessList.Modules));
        var now = new Date();
        localStorage.setItem('roleTime', now.getTime());

    }

}
// end

// added by Tejas for set types 10/5/2019
export function getMenuType(menuType){

    if(menuType === '625CAE5E'){

        return "Main";
    } else if(menuType === '7253F413'){
      
        return "Card";
    } else if(menuType === '3425D53F'){
      
      return "List";
    } else if(menuType === '9AAD5A4E'){
      
        return "Form";
    } else if(menuType === '70D4AD9A'){
      
      return "Chart";
    } else if(menuType === '256BFF65'){
      
      return "Slider";
  }
}