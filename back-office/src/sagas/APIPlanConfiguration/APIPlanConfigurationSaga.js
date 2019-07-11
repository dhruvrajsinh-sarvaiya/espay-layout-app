/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * API Plan Configuration Saga File 
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
    GET_API_PLAN_REQUEST_STATISTIC_COUNT,
    LIST_FREQUENT_USE,
    LIST_MOST_ACTIVE_IP_ADDRESS,
    GET_HTTP_ERRORS_LIST, // added By Tejas,
    GET_API_WISE_REPORT,
    GET_MOST_ACTIVE_IP_ADDRESS_LIST // added By Tejas,
} from "Actions/types";

// action sfor set data or Requests
import {
    getAPIPlanRequestCountSuccess,
    getAPIPlanRequestCountFailure,
    listMostActiveIpAddressSuccess,
    listMostActiveIpAddressFailure,
    listFrequentUseSuccess,
    listFrequentUseFailure,
    getHttpErrorCodeListSuccess,
    getHttpErrorCodeListFailure,
    getAPIWiseReportSuccess,
    getAPIWiseReportFailure,
    getMostActiveIpAddressReportSuccess,
    getMostActiveIpAddressReportFailure
} from "Actions/APIPlanConfiguration";

function* getAPIPlanRequestCountAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/APIConfiguration/GetAPIRequestStatisticsCount', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAPIPlanRequestCountSuccess(response));
        } else {
            yield put(getAPIPlanRequestCountFailure(response));
        }
    } catch (error) {
        yield put(getAPIPlanRequestCountFailure(error));
    }
}

function* getMostActiveIpAddressAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/APIConfiguration/MostActiveIPAddress', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(listMostActiveIpAddressSuccess(response));
        } else {
            yield put(listMostActiveIpAddressFailure(response));
        }
    } catch (error) {
        yield put(listMostActiveIpAddressFailure(error));
    }
}

function* getFrequentUseAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/APIConfiguration/GetFrequentUseAPI', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(listFrequentUseSuccess(response));
        } else {
            yield put(listFrequentUseFailure(response));
        }
    } catch (error) {
        yield put(listFrequentUseFailure(error));
    }
}

// Function for Get Http Errors and Call Function for Api Call By Tejas
function* getHttpErrorCodeListDetail({ payload }) {
    const { Data } = payload;

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/GetHttpErrorCodeReport', Data, headers);

        // set response if its available else set error message
        if (response != null && response.ReturnCode === 0) {
            yield put(getHttpErrorCodeListSuccess(response));
        } else {
            yield put(getHttpErrorCodeListFailure(response));
        }
    } catch (error) {
        yield put(getHttpErrorCodeListFailure(error));
    }
}

 // Function for Get Most Active Ip Address and Call Function for Api Call By Tejas
 function* getMostActiveIpAddressReportDetail({ payload }) {
    const { Data } = payload;
  
    try {
      var headers = { 'Authorization': AppConfig.authorizationToken }
      const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/GetIPAddressWiseReport', Data,headers);
  
      // set response if its available else set error message
      if (response != null && response.ReturnCode === 0) {
        yield put(getMostActiveIpAddressReportSuccess(response));
      } else {
        yield put(getMostActiveIpAddressReportFailure(response));
      }
    } catch (error) {        
      yield put(getMostActiveIpAddressReportFailure(error));
    }
  }

function* getAPIWiseReportDataAPI({ payload }) {
    const { request } = payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/GetAPIWiseReport', request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAPIWiseReportSuccess(response));
        } else {
            yield put(getAPIWiseReportFailure(response));
        }
    } catch (error) {
        yield put(getAPIWiseReportFailure(error));
    }
}

function* getAPIPlanRequestCountData() {
    yield takeEvery(GET_API_PLAN_REQUEST_STATISTIC_COUNT, getAPIPlanRequestCountAPI);
}

function* getFrequentUse() {
    yield takeEvery(LIST_FREQUENT_USE, getFrequentUseAPI);
}

function* getMostActiveIpAddress() {
    yield takeEvery(LIST_MOST_ACTIVE_IP_ADDRESS, getMostActiveIpAddressAPI);
}

// Sagas Function for Get Http Errors Code List by :Tejas
function* getHttpErrorCodeList() {
    yield takeEvery(GET_HTTP_ERRORS_LIST, getHttpErrorCodeListDetail);
}

function* getAPIWiseReportData() {
    yield takeEvery(GET_API_WISE_REPORT, getAPIWiseReportDataAPI);
}

// Sagas Function for Get Most Active IP Address List by :Tejas
function* getMostActiveIpAddressReport() {
    yield takeEvery(GET_MOST_ACTIVE_IP_ADDRESS_LIST, getMostActiveIpAddressReportDetail);
}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getAPIPlanRequestCountData),
        fork(getFrequentUse),
        fork(getMostActiveIpAddress),
        fork(getHttpErrorCodeList),
        fork(getAPIWiseReportData),
        fork(getMostActiveIpAddressReport)
    ]);
}
