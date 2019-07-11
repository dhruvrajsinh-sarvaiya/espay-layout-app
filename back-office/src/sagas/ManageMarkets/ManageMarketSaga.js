// sagas For Manage MArkets Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_MARKET_LIST,
  ADD_MARKET_LIST,
  UPDATE_MARKET_LIST
} from "Actions/types";

// action sfor set data or response
import {
  getMarketListSuccess,
  getMarketListFailure,
  addMarketListSuccess,
  addMarketListFailure,
  updateMarketListSuccess,
  updateMarketListFailure,
} from "Actions/ManageMarkets";

// Sagas Function for get Market List by :Tejas
function* getMarketList() {
  yield takeEvery(GET_MARKET_LIST, getMarketListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getMarketListDetail({ payload }) {
  const { Data } = payload;
  try {
    //added by parth andhariya
    var IsMargin = '';
    if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
      IsMargin += "?IsMargin=" + Data.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetBaseMarketArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetBaseMarket';//add existing
    }

    const response = yield call(swaggerGetAPI, url + IsMargin, Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getMarketListSuccess(response));
    } else {
      yield put(getMarketListFailure(response));
    }
  } catch (error) {
    yield put(getMarketListFailure(error));
  }
}

// Sagas Function for Add Market List by :Tejas
function* addMarketList() {
  yield takeEvery(ADD_MARKET_LIST, addMarketListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addMarketListDetail({ payload }) {
  const { Data } = payload;
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";
    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddMarketDataArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddMarketData';
    }
    const response = yield call(swaggerPostAPI, url, Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(addMarketListSuccess(response));
    } else {
      yield put(addMarketListFailure(response));
    }
  } catch (error) {
    yield put(addMarketListFailure(error));
  }
}

// Sagas Function for Update Market List by :Tejas
function* updateMarketList() {
  yield takeEvery(UPDATE_MARKET_LIST, updateMarketListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateMarketListDetail({ payload }) {
  const { Data } = payload;
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateMarketData', Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(updateMarketListSuccess(response));
    } else {
      yield put(updateMarketListFailure(response));
    }
  } catch (error) {
    yield put(updateMarketListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getMarketList),
    fork(addMarketList),
    fork(updateMarketList),
  ]);
}
