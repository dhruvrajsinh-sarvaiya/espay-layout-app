/**
 * Added By Devang Parekh
 * saga is used to handle functionality of component and handle data
 * handle multiple delete , add, edit option in sagas methods
 *
 */

import { all, fork, put, takeEvery, call } from "redux-saga/effects";
//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

import {
  GET_PAIR_CONFIGURATION_LIST,
  GET_MARKET_CURRENCY,
  GET_PAIR_CURRENCY,
  GET_EXCHANGE_LIST,
  ADD_PAIR_CONFIGURATION,
  EDIT_PAIR_CONFIGURATION,
  DELETE_PAIR_CONFIGURATION
} from "Actions/types";

// import functions from action
import {
  getPairConfigurationListSucess,
  getPairConfigurationListFailure,
  getMarketCurrencyListSuccess,
  getMarketCurrencyListFailure,
  getPairCurrencyListSuccess,
  getPairCurrencyListFailure,
  getExchangeListSuccess,
  getExchangeListFailure,
  submitPairConfigurationFormSuccess,
  submitPairConfigurationFormFailure,
  editPairConfigurationFormSuccess,
  editPairConfigurationFormFailure,
  deletePairConfigurationFormSuccess,
  deletePairConfigurationFormFailure
} from "Actions/PairConfiguration";

// Call Api For All PAir COnfiguration By Tejas
function* pairConfigurationListRequest({ payload }) {

  try {
    //added by parth andhariya
    var IsMargin = '';
    if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
      IsMargin += "?&IsMargin=" + payload.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if (payload.IsArbitrage !== undefined && payload.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetAllPairConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetAllPairConfiguration';
    }
    const response = yield call(swaggerGetAPI, url + IsMargin, payload, headers);

    if (response != null && response.ReturnCode === 0) {
      yield put(getPairConfigurationListSucess(response));
    }
    else {
      yield put(getPairConfigurationListFailure(response));
    }
  } catch (error) {
    yield put(getPairConfigurationListFailure(error));
  }
}

export function* getPairConfigurationList() {
  yield takeEvery(GET_PAIR_CONFIGURATION_LIST, pairConfigurationListRequest);
}

function* marketCurrency({ payload }) {
  try {
    //added by parth andhariya
    var IsMargin = '';
    if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
      IsMargin += "?IsMargin=" + payload.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetBaseMarket' + IsMargin, payload, headers);
    if ( response != null && response.ReturnCode === 0) {
      yield put(getMarketCurrencyListSuccess(response));
    }
    else {
      yield put(getMarketCurrencyListFailure(response));
    }
  } catch (error) {
    yield put(getMarketCurrencyListFailure(error));
  }
}

export function* getMarketCurrencyList() {
  yield takeEvery(GET_MARKET_CURRENCY, marketCurrency);
}

function* pairCurrency({ payload }) {
  const { Base } = payload;
  try {
    //added by parth andhariya
    var IsMargin = '';
    if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
      IsMargin += "?IsMargin=" + payload.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllServiceConfigurationByBase/' + Base + IsMargin, Base, headers);

    if ( response != null && response.ReturnCode === 0) {
      yield put(getPairCurrencyListSuccess(response));
    }
    else {
      yield put(getPairCurrencyListFailure(response));
    }
  } catch (error) {
    yield put(getPairCurrencyListFailure(error));
  }
}

export function* getPairCurrencyList() {
  yield takeEvery(GET_PAIR_CURRENCY, pairCurrency);
}

function* exchangeList({ payload }) {
  try {
    const response = [
      { exchangeID: 1001, exchangeName: "Paro" },
      { exchangeID: 1002, exchangeName: "Oho" },
      { exchangeID: 1003, exchangeName: "UNIQ" }
    ];

    if (response.length) yield put(getExchangeListSuccess(response));
    else yield put(getExchangeListFailure("No data found"));
  } catch (error) {
    yield put(getExchangeListFailure(error));
  }
}

export function* getExchangeList() {
  yield takeEvery(GET_EXCHANGE_LIST, exchangeList);
}

// call api for Add  pair configuration By Tejas
function* submitPairConfiguration({ payload }) {
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if (payload.IsArbitrage !== undefined && payload.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddPairConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddPairConfiguration';
    }
    const response = yield call(swaggerPostAPI, url, {}, headers);
    if ( response != null && response.ReturnCode === 0) {
      yield put(submitPairConfigurationFormSuccess(response));
    }
    else {
      yield put(submitPairConfigurationFormFailure(response));
    }
  } catch (error) {
    yield put(submitPairConfigurationFormFailure(error));
  }
}

export function* submitPairConfigurationForm() {
  yield takeEvery(ADD_PAIR_CONFIGURATION, submitPairConfiguration);
}

// call api for update pair configuration By Tejas
function* editPairConfiguration({ payload }) {
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";

    if (payload.IsArbitrage !== undefined && payload.IsArbitrage) {
      url = 'api/TransactionConfiguration/UpdatePairConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/UpdatePairConfiguration';
    }
    const response = yield call(swaggerPostAPI, url, {}, payload, headers);

    if (response != null && response.ReturnCode === 0) {
      yield put(editPairConfigurationFormSuccess(response));
    }
    else {
      yield put(editPairConfigurationFormFailure(response));
    }
  } catch (error) {
    yield put(editPairConfigurationFormFailure(error));
  }
}

export function* editPairConfigurationForm() {
  yield takeEvery(EDIT_PAIR_CONFIGURATION, editPairConfiguration);
}

function* deletePairConfiguration({ payload }) {
  try {
    const response = { status: 1, message: "Successfully Deleted" };
    if (response.status == 1)
      yield put(deletePairConfigurationFormSuccess(response));
    else yield put(deletePairConfigurationFormFailure(response));
  } catch (error) {
    const response = { status: 0, error: error };
    yield put(deletePairConfigurationFormFailure(response));
  }
}

export function* deletePairConfigurationForm() {
  yield takeEvery(DELETE_PAIR_CONFIGURATION, deletePairConfiguration);
}

export default function* rootSaga() {
  yield all([
    fork(getPairConfigurationList),
    fork(getMarketCurrencyList),
    fork(getPairCurrencyList),
    fork(getExchangeList),
    fork(submitPairConfigurationForm),
    fork(editPairConfigurationForm),
    fork(deletePairConfigurationForm)
  ]);
}
