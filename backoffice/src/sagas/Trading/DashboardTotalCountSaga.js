// sagas For total counts Actions By Tejas

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// types for set actions and reducers
import {
  GET_USER_TRADE_COUNT,
  GET_CONFIGURATION_COUNT,
  GET_TRADE_SUMMARY_COUNT,
  GET_USER_MARKET_COUNT,
  GET_REPORT_COUNT

} from "Actions/types";

// action sfor set data or response
import {
  getUserTradeCountSuccess,
  getUserTradeCountFailure,
  getConfigurationCountSuccess,
  getConfigurationCountFailure,
  getTradeSummaryCountSuccess,
  getTradeSummaryCountFailure,
  getUserMarketCountSuccess,
  getUserMarketCountFailure,
  getReportCountSuccess,
  getReportCountFailure
} from "Actions/Trading";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// Sagas Function for get total counts by :Tejas
function* getUserTradeCount() {
  yield takeEvery(GET_USER_TRADE_COUNT, getUserTradeCountDetail);

}

// Function for set response to data and Call Function for Api Call
function* getUserTradeCountDetail({ payload }) {
let request = payload;
  //added by parth andhariya
  var isMargin = '';
  if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
    isMargin += "?&IsMargin=" + request.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    //code change by jayshreeba gohil (18-6-2019) for handle arbitrage UserTrade detail
    if (payload.IsArbitrage !== undefined && payload.IsArbitrage) {
      url = 'api/TransactionBackOfficeCount/GetActiveTradeUserCountArbitrage/All';
    } else {
      url = 'api/TransactionBackOfficeCount/GetActiveTradeUserCount';
    }
    const response = yield call(swaggerGetAPI, url + isMargin, payload, request, headers);
    //const response = yield call(swaggerGetAPI, 'api/TransactionBackOfficeCount/GetActiveTradeUserCount' + isMargin, request, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getUserTradeCountSuccess(response));
    } else {
      yield put(getUserTradeCountFailure(response));
    }
  } catch (error) {
    yield put(getUserTradeCountFailure(error));
  }
}

// Sagas Function for get total counts by :Tejas
function* getConfigurationCount() {
  yield takeEvery(GET_CONFIGURATION_COUNT, getConfigurationCountDetail);

}

// Function for set response to data and Call Function for Api Call
function* getConfigurationCountDetail({ payload }) {
  let request = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
    IsMargin += "?&IsMargin=" + request.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOfficeCount/GetConfigurationCount' + IsMargin, request, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getConfigurationCountSuccess(response));
    } else {
      yield put(getConfigurationCountFailure(response));
    }
  } catch (error) {
    yield put(getConfigurationCountFailure(error));
  }
}


// Sagas Function for get total counts by :Tejas
function* getTradeSummaryCount() {
  yield takeEvery(GET_TRADE_SUMMARY_COUNT, getTradeSummaryCountDetail);

}

// Function for set response to data and Call Function for Api Call
function* getTradeSummaryCountDetail({ payload }) {
  let request = payload;
  //added by parth andhariya
  var IsMargin = '';
  if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
    IsMargin += "?&IsMargin=" + request.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOfficeCount/GetTradeSummaryCount' + IsMargin, request, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTradeSummaryCountSuccess(response));
    } else {
      yield put(getTradeSummaryCountFailure(response));
    }
  } catch (error) {
    yield put(getTradeSummaryCountFailure(error));
  }
}

// Sagas Function for get total counts by :Tejas
function* getUserMarketCount() {
  yield takeEvery(GET_USER_MARKET_COUNT, getUserMarketCountDetail);

}

// Function for set response to data and Call Function for Api Call
function* getUserMarketCountDetail({ payload }) {
  const { Data } = payload;
  var IsMargin = '';
  if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
    IsMargin += "?&IsMargin=" + Data.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    //code change by jayshreeba gohil (18-6-2019) for handle arbitrage UserTrade detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionBackOfficeCount/GetTradeUserMarketTypeCountArbitrage/' + Data.Type + '/All';
    } else {
      url = 'api/TransactionBackOfficeCount/GetTradeUserMarketTypeCount/' + Data.Type + IsMargin;
    }
    const response = yield call(swaggerGetAPI, url, Data, headers);
    // const response = yield call(swaggerGetAPI, 'api/TransactionBackOfficeCount/GetTradeUserMarketTypeCount/' + Data.Type + IsMargin, Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getUserMarketCountSuccess(response));
    } else {
      yield put(getUserMarketCountFailure(response));
    }
  } catch (error) {
    yield put(getUserMarketCountFailure(error));
  }
}

// Sagas Function for get total counts by :Tejas
function* getReportCount() {
  yield takeEvery(GET_REPORT_COUNT, getReportCountDetail);

}

// Function for set response to data and Call Function for Api Call
function* getReportCountDetail({ payload }) {
  let request = payload;
  
  var isMargin = '';
  if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
    isMargin += "?&IsMargin=" + request.IsMargin;
  }
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOfficeCount/GetReportCount', {}, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getReportCountSuccess(response));
    } else {
      yield put(getReportCountFailure(response));
    }
  } catch (error) {
    yield put(getReportCountFailure(error));
  }
}

// Function for root saga 
export default function* rootSaga() {
  yield all([
    fork(getUserTradeCount),
    fork(getConfigurationCount),
    fork(getTradeSummaryCount),
    fork(getUserMarketCount),
    fork(getReportCount)
  ]);
}
