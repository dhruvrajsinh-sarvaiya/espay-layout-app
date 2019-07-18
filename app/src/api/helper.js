import axios from 'axios';
import qs from 'querystring';
import { logger, showSlowInternetDialog, showTimeoutRequestDialog, getBaseUrl, getWebPageUrl } from '../controllers/CommonUtils';
import moment from 'moment';
import R from '../native_theme/R';

const requestTimeout = 90000; //90 Seconds
const requestTimeoutError = 'timeout of ' + requestTimeout + 'ms exceeded'; //Error message of axios catch

/**
 * Function to Swagger Delete API
 */
export const swaggerDeleteAPI = async (methodName, request, headers = {}) => {

    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.common = headers;

    logRequest(getBaseUrl(), 'DELETE', methodName, request, headers);

    var responseData = await httpClient.delete(getBaseUrl() + methodName, request)
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response))
        });

    return getFormattedResponse(responseData, methodName);
}

/**
 * Function to Swagger Get API
 */
export const swaggerGetAPI = async (methodName, request, headers = {}) => {

    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.common = headers;

    logRequest(getBaseUrl(), 'GET', methodName, request, headers);

    var responseData = await httpClient.get(getBaseUrl() + methodName, request)
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response))
        });

    return getFormattedResponse(responseData, methodName);
}

/**
 * Function to Swagger Post API
 */
export const swaggerPostAPI = async (methodName, request, headers = {}) => {

    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.common = headers;

    logRequest(getBaseUrl(), 'POST', methodName, request, headers);

    var responseData = await httpClient.post(getBaseUrl() + methodName, request)
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response));
        });

    return getFormattedResponse(responseData, methodName);
}

/**
 * Function to Swagger Post with header form API
 */
export const swaggerPostHeaderFormAPI = async (methodName, request) => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    logRequest(getBaseUrl(), 'POST', methodName, request, { 'Content-Type': 'application/x-www-form-urlencoded' })

    var responseData = await httpClient.post(getBaseUrl() + methodName, qs.stringify(request))
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response))
        });

    return getFormattedResponse(responseData, methodName, true);
}

/**
 * Function to WebPageUrl Get Api
 */
export const WebPageUrlGetApi = async (methodName, request, headers = {}) => {

    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.common = headers;

    logRequest(getWebPageUrl(), 'GET', methodName, request, headers);

    var responseData = await httpClient.get(getWebPageUrl() + methodName, request)
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response))
        });

    return getFormattedResponse(responseData, methodName);
}

/**
 * Function to WebPageUrl Post API
 */
export const WebPageUrlPostAPI = async (methodName, request, headers = {}) => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = requestTimeout;
    httpClient.defaults.headers.common = headers;

    logRequest(getWebPageUrl(), 'POST', methodName, request, headers);

    var responseData = await httpClient.post(getWebPageUrl() + methodName, request)
        .catch(error => {
            if (error.message.includes(requestTimeoutError)) {
                showTimeoutRequestDialog();
            } else if (error.message.includes('Network Error'))
                showSlowInternetDialog()
            return JSON.parse(JSON.stringify(error.response));
        });

    return getFormattedResponse(responseData, methodName);
}

/**
 * To get formatted response
 * @param {jsonObject} responseData 
 * @param {string} methodName 
 * @param {boolean} isToken 
 */
export function getFormattedResponse(responseData, methodName, isToken = false) {
    var errCode = statusErrCode();
    var response = {};
    try {
        if (errCode.includes(responseData.status)) {
            response = staticResponseObj(responseData.status);
        } else if (loginErrCode().includes(responseData.status)) {
            //if token is expired than 401 will be occure
            response = {};
        } else {
            if (isToken) {
                let isSuccessResponse = typeof responseData.data.ReturnCode === 'undefined' && typeof responseData.data.ErrorCode === 'undefined';

                response = {
                    ReturnCode: isSuccessResponse ? 0 : responseData.data.ReturnCode,
                    ErrorCode: isSuccessResponse ? 0 : responseData.data.ErrorCode,
                    ReturnMsg: isSuccessResponse ? 'Success' : responseData.data.ReturnMsg,
                    access_token: responseData.data.access_token,
                    refresh_token: responseData.data.refresh_token,
                    id_token: responseData.data.id_token
                };
            } else {
                //If response is empty than displaying static response
                if (responseData.data === '') {
                    //logger('Response : ', 'Empty Response');
                    response = staticResponseObj(responseData.status);
                } else {
                    response = responseData.data;
                }
            }
        }
    } catch (error) {
        //logger('Catch Helper : ', error.message);
        response = staticResponseObj(responseData.status);
    }
    response.statusCode = responseData.status;
    logResponse(methodName, response, responseData.status);
    return response;
}

/**
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
 * Function to define redirct to login status code array
 */
export function loginErrCode() {
    let list = [401, 498];
    return list;
}

/**
 * Function to static response
 */
function staticResponseObj(statusCode) {
    let response = {
        ErrorCode: statusCode,
        ReturnCode: 1,
        ReturnMsg: "Please try after sometime.",
        statusCode: statusCode,
    };

    return response;
}

//Slow Internet Static Response
export function slowInternetStaticResponse(statusCode) {
    let response = {
        ErrorCode: statusCode,
        ReturnCode: 1,
        ReturnMsg: R.strings.SLOW_INTERNET,
        statusCode: statusCode,
    };
    return response;
}

export function staticResponse(statusCode) {
    return staticResponseObj();
}

var startTime = {};

/**
 * To log request with its method name, url, request and headers
 * @param {string} URL 
 * @param {string} methodName 
 * @param {jsonObject} request 
 * @param {jsonObject} headers 
 */
export function logRequest(URL, methodType, methodName, request, headers) {

    if (typeof methodType === 'undefined') {
        methodType = '';
    }

    if (typeof request === 'undefined') {
        request = {};
    }

    if (typeof headers === 'undefined') {
        headers = {};
    }

    //customization bits for log
    let show = {
        URL: true,
        method: true,
        methodType: methodType === '' ? false : true,
        request: true,
        headers: false
    }

    let logMethodType = 'Type : ' + methodType + '\n';
    let logMethod = 'Method : ' + extractMethod(methodName) + '\n';
    let logURL = 'URL : ' + URL + methodName + '\n';
    let logReq = Object.keys(request).length !== 0 ? ('Request : ' + JSON.stringify(request) + '\n') : '';
    let logHeader = Object.keys(headers).length !== 0 ? ('Headers : ' + JSON.stringify(headers) + '\n') : '';

    startTime = Object.assign({}, startTime, {
        [extractMethod(methodName)]: moment(),
    });

    logger((show.URL ? logURL : '') + (show.methodType ? logMethodType : '') + (show.method ? logMethod : '') + (show.request ? logReq : '') + (show.headers ? logHeader : ''));
}

/**
 * To log response with method name and response
 * @param {string} method 
 * @param {string} response 
 */
function logResponse(method, response, status) {

    //Get different between current and expiration time
    let milliseconds = moment().diff(moment(startTime[extractMethod(method)]), 'milliseconds');
    logger(extractMethod(method) + ' (' + milliseconds + ' ms) ' + status + ' : ' + JSON.stringify(response) + '\n');
}

/**
 * To extract method name from URL
 * @param {string} URL 
 */
function extractMethod(URL) {

    //all parts will be separated here
    let methodParts = [];

    //method name will stored here
    let methodName = '';

    //If method string has path separator then split it
    if (URL.includes('/')) {

        //Separating all words with / separator
        methodParts = URL.split('/');

        //if parts length is more then 2 records means method name is at 3rd position means index 2
        //else its position will be 2 means index is 1
        if (methodParts.length > 2) {
            methodName += methodParts[2];
        } else {
            methodName += methodParts[1];
        }
    } else {
        //method is directly given
        methodName += URL;
    }

    //If method url has query parameters than extract it
    if (methodName.includes('?')) {
        methodName = methodName.split('?')[0];
    }

    //If method is using other parameter with URL objects than extract it
    if (methodName.includes('/')) {
        methodName = methodName.split('/')[0];
    }

    //returning method name to its calling class
    return methodName;
}

/**
 * Function to convert object to form-data.
 * @param {jsonObject} ObjData 
 */
export function convertObjToFormData(ObjData) {

    const formData = new FormData();

    let isFirst = true;
    Object.keys(ObjData).forEach(key => {

        if (isFirst) {
            isFirst = false;
        }
        formData.append([key], ObjData[key]);
    })

    return formData;
}

/**
 * To create Query Builder
 * @param {JSON Object} ObjData 
 */
export function queryBuilder(ObjData, needEmpty = false) {

    let isFirstParam = true;

    let queryString = '';

    if (Object.keys(ObjData).length > 0) {

        queryString = '?';

        Object.keys(ObjData).forEach(key => {

            //if object's value is not empty than create key pair
            if (ObjData[key].toString().trim() !== '' || needEmpty) {

                //to add question mark only when its second key
                if (isFirstParam) {
                    isFirstParam = false;
                } else {
                    queryString += '&';
                }
                queryString += key + '=' + ObjData[key];
            }
        })
    }

    //if however querystring has only question mark than replace it with empty string.
    if (queryString.trim() === '?') {
        queryString = '';
    }

    return queryString;
}