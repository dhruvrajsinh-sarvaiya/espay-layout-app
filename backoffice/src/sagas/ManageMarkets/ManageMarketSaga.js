// sagas For Manage MArkets Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { NotificationManager } from "react-notifications";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_MARKET_LIST,
  ADD_MARKET_LIST,
  UPDATE_MARKET_LIST,
  DELETE_MARKET_LIST
} from "Actions/types";

// action sfor set data or response
import {
  getMarketListSuccess,
  getMarketListFailure,
  addMarketListSuccess,
  addMarketListFailure,
  updateMarketListSuccess,
  updateMarketListFailure,
  deleteMarketListSuccess,
  deleteMarketListFailure
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
    var headers = { 'Authorization': AppConfig.authorizationToken },url = "";
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetBaseMarketArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetBaseMarket';//add existing
    }

    const response = yield call(swaggerGetAPI, url + IsMargin, Data, headers);
    //const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetBaseMarket' + IsMargin, Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
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
    var headers = { 'Authorization': AppConfig.authorizationToken },url = "";
    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddMarketDataArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddMarketData';
    }
    const response = yield call(swaggerPostAPI, url, Data, headers);
    //const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddMarketData', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addMarketListSuccess(response));
    } else {
      yield put(addMarketListFailure(response));
    }
  } catch (error) {
    yield put(addMarketListFailure(error));
  }
}

// function for Call api and set response
// const addMarketListRequest = async Data =>
//   await api
//     .get("AddMarketList.js", Data)
//     .then(response => response)
//     .catch(error => error);

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
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateMarketListSuccess(response));
    } else {
      yield put(updateMarketListFailure(response));
    }
  } catch (error) {
    yield put(updateMarketListFailure(error));
  }
}

// // function for Call api and set response
// const updateMarketListRequest = async Data =>
//   await api
//     .get("UpdateMarketList.js", Data)
//     .then(response => response)
//     .catch(error => error);

// Sagas Function for delete Market List by :Tejas
function* deleteMarketList() {
  yield takeEvery(DELETE_MARKET_LIST, deleteMarketListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteMarketListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(deleteMarketListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(deleteMarketListSuccess(response));
    } else {
      yield put(deleteMarketListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("Market List Not Found");
    yield put(deleteMarketListFailure(error));
  }
}

// function for Call api and set response
const deleteMarketListRequest = async Data =>
  await api
    .get("DeleteMarketList.js", Data)
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getMarketList),
    fork(addMarketList),
    fork(updateMarketList),
    fork(deleteMarketList)
  ]);
}
