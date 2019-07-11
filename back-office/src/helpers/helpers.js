/**
 * Helpers Functions
 */
import moment from 'moment';
import deviceParser from 'ua-parser-js';
import api from '../api';
import validator from 'validator';
//Added by salim
import axios from 'axios';
import { configureStore } from '../store';
import AppConfig from 'Constants/AppConfig';
import $ from "jquery";
import { formatPhoneNumber } from 'react-phone-number-input';
const qs = require('querystring');

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    let c;
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

    return str.length > length ? str.substring(0, length - ending.length) + ending : str;
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format, addBit) {
    let timeStamp = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';

    return addBit ? moment(timeStamp).add(330, 'minutes').format(formatDate) : moment(timeStamp).format(formatDate);
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
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
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
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * return device info
 * Change by salim...
 */
export function getDeviceInfo() {
    let myParser = new deviceParser.UAParser();
    let deviceInfo = myParser.getResult();

    let strDevice = deviceInfo.browser.name + '_' + deviceInfo.browser.version;
    strDevice = strDevice + '|' + deviceInfo.os.name + '_' + deviceInfo.os.version;
    strDevice = strDevice + '|' + deviceInfo.cpu.architecture;

    return strDevice;
}

/**
 * return device info
 */
function getDeviceInfo2(callback) {
    let myParser = new deviceParser.UAParser();
    let device = myParser.getResult();
    device.colorDepth = screen.colorDepth;
    device.pixelDepth = screen.pixelDepth;
    device.width = screen.width;
    device.height = screen.height;

    callback(device);
}

/**
* get security token from api and stored in localstorage
*/
export function setSessionToken() {
    getDeviceInfo2(function (deviceInfo) {
        api.post('/public/generateToken', { data: deviceInfo })
            .then(function (response) {
                localStorage.setItem('access_token', response.data.tokenData.token);
                localStorage.setItem('id_token', response.data.tokenData.refreshToken);
            })
            .catch(error => error, {});
    })
}

/**
 * Added by salim
 * Function to Alpha with space
 */
export function isAlphaWithSpace(string) {
    let check = validator.matches(string, /^[a-zA-Z ]*$/g);
    return check
}

/**
 * Added by salim
 * Function to Alpha Numeric with space
 */
export function isAlphaNumWithSpace(string) {
    let check = validator.matches(string, /^[a-zA-Z0-9 ]*$/g);
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
    let headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    let responseData = await axios.post(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    let response = {};
    try {

        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }
    } catch (error) {
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}


//Added By Sanjay
export const swaggerDeleteAPI = async (methodName, request, authHeaders = false) => {
    let headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    let responseData = await axios.delete(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    let response = {};
    try {
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }
    } catch (error) {
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}

//Added By Sanjay
export const swaggerPutAPI = async (methodName, request, authHeaders = false) => {
    let headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    let responseData = await axios.put(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    let response = {};
    try {
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }
    } catch (error) {
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}

export const swaggerPostHeaderFormAPI = async (methodName, request) => {
    delete axios.defaults.headers.common;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    let responseData = await axios.post(AppConfig.backofficeSwaggerUrl + methodName, qs.stringify(request))
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    let response = {};
    try {
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = {
                ReturnCode: 0,
                ErrorCode: 0,
                ReturnMsg: 'Success',
                access_token: responseData.data.access_token,
                refresh_token: responseData.data.refresh_token,
                id_token: responseData.data.id_token
            }
        }
    } catch (error) {
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    return response;
}

export const swaggerGetAPI = async (methodName, request, authHeaders = false) => {
    // code by devang parekh for getting latest token value in request
    let headers = {};
    if (authHeaders) {
        headers.Authorization = AppConfig.authorizationToken + localStorage.getItem('gen_access_token');
    }

    axios.defaults.headers.common = headers;
    let responseData = await axios.get(AppConfig.backofficeSwaggerUrl + methodName, request)
        .then(response => JSON.parse(JSON.stringify(response)))
        .catch(error => JSON.parse(JSON.stringify(error.response)));

    const errCode = statusErrCode();
    const lgnErrCode = loginErrCode();
    let response = {};
    try {
        if (lgnErrCode.includes(responseData.status)) {
            redirectToLogin();
        } else if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else {
            response = responseData.data;
        }
    } catch (error) {
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
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
    let response = {
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
    let timeStamp = convertDateToTimeStamp(date, format)
    let cDate = getTheDate(timeStamp, format, addBit);
    return cDate;
}

/**
 * Added by salim
 * Function to get IP Address from the node api create by kushalbhai
 */
async function nodeIPAddress() {
    let _ipAddress = '';
    if (window.location.hostname === 'localhost' || ValidateIPaddress(window.location.hostname)) {
        _ipAddress = '45.116.123.43';

    } else {
        await api.get('/api/private/v1/sitesetting/getIpAddress')
            .then(function (response) {
                if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
                    _ipAddress = response.data.ipAddress;
                }
            })
            .catch(error => error, {});
    }
    return _ipAddress;
}

/**
 * Added by salim
 * Function to get IP Address
 */
export function getIPAddress() {
    return nodeIPAddress();
}

/**
 * Added by salim
 * Function to check host name as local ip address
 */
function ValidateIPaddress(ipaddress) {
    return validator.matches(ipaddress, /^172\.20\.65\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) ? true : false;
}

/**
 * Added by salim
 * Function to get hostname
 */
export function getHostName() {
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
    var textString = textStr.toUpperCase()
    var tCtx = document.getElementById('textCanvas').getContext('2d');
    tCtx.canvas.width = tCtx.measureText(textString).width + 50;
    tCtx.font = "12px Arial";
    tCtx.fillText(textString, 0, 20);
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
    let validMobile = formatPhoneNumber(str_mobile, 'International');
    let countryCode = validMobile.substr(1, validMobile.indexOf(' ')).trim();
    validMobile = validMobile.substring(validMobile.indexOf(" ") + 1);
    validMobile = validMobile.replace(/\s/g, '');

    let mobObj = {};
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
    let check = validator.matches(string, /<script.*?>([\s\S]*?)<\/script>/);
    return check
}

/**
 * Added by salim
 * Function to refresh token
 */
export function autoRefreshToken() {
    let store = configureStore();
    var now = new Date();
    let diffTime = localStorage.getItem('timestamp') - now.getTime();

    (function callRefreshFunction(NewTime) {
        setTimeout(function () {
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
    let statusType = {
        'sidebar.open': 1,
        'sidebar.close': 2,
        'sidebar.pending': 3,
    }
    return statusType;
}

/**
 * Added by salim
 * Function to get Complain Status
 */
export function getComplainType() {
    let complainType = {
        'sidebar.transaction': 2,
        'sidebar.wallet': 5,
        'sidebar.myAccount': 6,
    }
    return complainType;
}

/**
 * Added by salim
 * Function to get Visible Profile
 */
export function getVisibleProfile() {
    let visibleProfile = {
        'sidebar.public': 1,
        'sidebar.private': 2
    }
    return visibleProfile;
}

/**
 * Added by salim
 * Function to get Volume Time
 */
export function getVolumeTime() {
    let volumeTime = {
        'sidebar.day': 1,
        'sidebar.week': 2,
        'sidebar.month': 3,
        'sidebar.quarter': 4,
        'sidebar.year': 5
    }
    return volumeTime;
}

/**
 * Added by salim
 * Function to get Change Frequency
 */
export function getChangeFrequency() {
    let changeFrequency = {
        'sidebar.oneTime': 1,
        'sidebar.daily': 2,
        'sidebar.weekly': 3,
        'sidebar.monthly': 4,
        'sidebar.quarterly': 5,
        'sidebar.yearly': 6
    }
    return changeFrequency;
}

/**
 * Added by salim
 * Function to get Yes/No
 */
export function getYesNo() {
    let yesNo = {
        'sidebar.yes': 1,
        'sidebar.no': 2
    }
    return yesNo;
}

/**
 * Added by salim
 * Function to get Yes/No
 */
export function getKycStatus() {
    let kycStatus = [
        { id: 1, label: 'sidebar.approval' },
        { id: 2, label: 'sidebar.reject' },
        { id: 4, label: 'sidebar.pending' },
    ]
    return kycStatus
}

//Added by Saloni
export function getAffiliateType() {
    let AffiliateStatus = [
        { id: 0, label: 'sidebar.selType' },
        { id: 1, label: 'sidebar.buytrade' },
        { id: 2, label: 'sidebar.selltrade' },
        { id: 3, label: 'sidebar.signup' },
        { id: 4, label: 'sidebar.deposite' },
        { id: 5, label: 'sidebar.withdraw' },
    ]
    return AffiliateStatus;
}

export function getSignupStatus() {
    let kycStatus = [
        { id: 0, label: 'sidebar.selStatus' },
        { id: 1, label: 'sidebar.approval' },
        { id: 2, label: 'sidebar.reject' },
        { id: 4, label: 'sidebar.pending' },
    ]
    return kycStatus;
}
export function getCommissionLevel() {
    let kycStatus = [
        { id: 0, label: 'sidebar.sellevel' },
        { id: 1, label: 'sidebar.level1' },
        { id: 2, label: 'sidebar.level2' },
        { id: 3, label: 'sidebar.level3' },
        { id: 4, label: 'sidebar.level4' },
        { id: 5, label: 'sidebar.level5' },
    ]
    return kycStatus;
}

export function getActiveInactiveStatus() {
    let genStatus = [
        { id: 1, label: 'sidebar.active' },
        { id: 0, label: 'sidebar.inactive' }
    ];
    return genStatus;
}

//Added by saloni rathod.
export function getRuleStatus() {
    let ruleStatus = [
        { id: 0, label: 'sidebar.readOnly' },
        { id: 1, label: 'sidebar.write' },
        { id: 9, label: 'sidebar.invisible' },
    ];
    return ruleStatus;
}

export function getRuleVisibility() {
    let ruleVisibility = [
        { id: 0, label: "sidebar.hide" },
        { id: 1, label: "sidebar.show" }
    ];
    return ruleVisibility;
}

export function getUserStatus() {
    let Status = [
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
    let genStatus = [
        { id: 1, label: 'sidebar.active' },
        { id: 0, label: 'sidebar.inactive' },
        { id: 9, label: 'sidebar.delete' }
    ];
    return genStatus;
}

export function getCommissionType() {
    let commissionType = [
        { id: 0, label: "sidebar.perTransaction" },
        { id: 1, label: "my_account.hourly" },
        { id: 2, label: "my_account.daily" },
        { id: 3, label: "my_account.weekly" }
    ];
    return commissionType;
}

export function getDistributionType() {
    let distributionType = [
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
    let check = validator.matches(string, /(<([^>]+)>)/ig);
    return check;
}

// code added by devang parekh for check menu permission or menu exists or not in menu list (26-3-2019)
export function checkAndGetMenuAccessDetail(GUID) {
    if (localStorage.getItem('role') !== null) {
        return findById(JSON.parse(localStorage.getItem('role')), GUID); // call recursive function for getting info by GUID if not found then return Undefined
    } else {
        return false;
    }
}

// code for recursively check menu detail by GUID or traverse all the object and find GUID which is pass from components
function findById(menuDetail, id) {
    //Early return when found first of an object
    if (menuDetail && menuDetail.GUID && menuDetail.GUID.toLowerCase() === id.toLowerCase()) {
        return menuDetail; // return menuDetail != undefined ? menuDetail : false; //Commented By Bharat Jograna (condition will true every time) 
    }

    let result, p;
    // make loop or traverse all the nested object till GUID not found
    for (p in menuDetail) {
        if (menuDetail.hasOwnProperty(p) && typeof menuDetail[p] === 'object' && menuDetail[p] !== null) {
            result = findById(menuDetail[p], id); // call recursvily for checking GUID exists or not
            if (result) {
                return result; // return result != undefined ? result : false; //Commented By Bharat Jograna (condition will true every time) 
            }
        }
    }
    return result !== undefined ? result : false;
}
// end

// added by devang parekh (2-4-2019)
// code for store menu detail in cache
export function generateLocalStorageMenu(menuAccessList) {
    if (menuAccessList.Modules) {
        localStorage.setItem('role', JSON.stringify(menuAccessList.Modules));
        let now = new Date();
        localStorage.setItem('roleTime', now.getTime());
    }
}
// end

// added by Tejas for set types 10/5/2019
export function getMenuType(menuType) {
    if (menuType === '625CAE5E') {
        return "Main";
    } else if (menuType === '7253F413') {
        return "Card";
    } else if (menuType === '3425D53F') {
        return "List";
    } else if (menuType === '9AAD5A4E') {
        return "Form";
    } else if (menuType === '70D4AD9A') {
        return "Chart";
    } else if (menuType === '256BFF65') {
        return "Slider";
    }
}
