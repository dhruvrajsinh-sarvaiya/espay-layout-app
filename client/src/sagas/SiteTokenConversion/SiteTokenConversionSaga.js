// sagas For Site Token Report Actions By Tejas 11/2/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_SITE_TOKEN,
  GET_SITE_TOKEN_CALCULATION,
  SITE_TOKEN_CONVERSION,
  //added by parth andhariya 
  GET_BASE_MARKET_CURRENCY
} from "Actions/types";

// action sfor set data or response
import {
  getSiteTokenSuccess,
  getSiteTokenFailure,
  getSiteTokenCalculationSuccess,
  getSiteTokenCalculationFailure,
  doSiteTokenConversionSuccess,
  doSiteTokenConversionFailure,
  //added by parth andhariya 
  getBaseMarketCurrencySuccess,
  getBaseMarketCurrencyFailure
} from "Actions/SiteTokenConversion";

// Sagas Function for get site token by :Tejas
function* getSiteToken() {
  yield takeEvery(GET_SITE_TOKEN, getSiteTokenDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenDetail({ payload }) {
  try {
    //added by parth andhariya
    var isMargin = '';
    if (payload.Data.hasOwnProperty("IsMargin") && payload.Data.IsMargin != "") {
      isMargin += "?IsMargin=" + payload.Data.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Transaction/GetAllSiteToken' + isMargin, payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getSiteTokenSuccess(response));
    } else {
      yield put(getSiteTokenFailure(response));
    }
  } catch (error) {
    yield put(getSiteTokenFailure(error));
  }
}


// Sagas Function for get site token Calculation by :Tejas
function* getSiteTokenCalculation() {
  yield takeEvery(GET_SITE_TOKEN_CALCULATION, getSiteTokenCalculationDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenCalculationDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/SiteTokenCalculation', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getSiteTokenCalculationSuccess(response));
    } else {
      yield put(getSiteTokenCalculationFailure(response));
    }
  } catch (error) {
    yield put(getSiteTokenCalculationFailure(error));
  }
}


// Sagas Function for get site token Calculation by :Tejas
function* doSiteTokenConversion() {
  yield takeEvery(SITE_TOKEN_CONVERSION, doSiteTokenConversionDetail);
}

// Function for set response to data and Call Function for Api Call
function* doSiteTokenConversionDetail({ payload }) {
  const { Data } = payload;
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/SiteTokenConversion', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(doSiteTokenConversionSuccess(response));
    } else {
      yield put(doSiteTokenConversionFailure(response));
    }
  } catch (error) {
    yield put(doSiteTokenConversionFailure(error));
  }
}
//added by parth andhariya
//api call for margin currency 
function* getBaseMarketCurrencyApi({ payload }) {
  const { Data } = payload;
  try {
    var isMargin = '';
    var ActiveOnly = '';
    if (Data.hasOwnProperty("ActiveOnly") && Data.ActiveOnly != "") {
      ActiveOnly += "?ActiveOnly=" + Data.ActiveOnly;
    }
    if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
      isMargin += "&IsMargin=" + Data.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetBaseMarket' + ActiveOnly + isMargin, Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getBaseMarketCurrencySuccess(response));
    } else {
      yield put(getBaseMarketCurrencyFailure(response));
    }
  } catch (error) {
    yield put(getBaseMarketCurrencyFailure(error));
  }
}
//method call for Margin currancy 
function* getBaseMarketCurrency() {
  yield takeEvery(GET_BASE_MARKET_CURRENCY, getBaseMarketCurrencyApi);
}
// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getSiteToken),
    fork(getSiteTokenCalculation),
    fork(doSiteTokenConversion),
    fork(getBaseMarketCurrency)
  ]);
}
