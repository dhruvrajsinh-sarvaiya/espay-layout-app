// Saga For Get,add and Update Trade Route By Tejas
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

import {
  GET_TRADE_ROUTE_LIST,
  ADD_TRADE_ROUTE_LIST,
  UPDATE_TRADE_ROUTE_LIST,
  GET_ORDER_TYPE_LIST,
  GET_AVAILABLE_ROUTES_LIST
} from "Actions/types";

// import functions from action
import {
  getTradeRouteListSuccess,
  getTradeRouteListFailure,
  addTradeRouteListFailure,
  addTradeRouteListSuccess,
  updateTradeRouteListSuccess,
  updateTradeRouteListFailure,
  getOrderTypeListSuccess,
  getOrderTypeListFailure,
  getAvailableRoutesSuccess,
  getAvailableRoutesFailure,
} from "Actions/TradeRoute";


function* getTradeRouteListData({ payload }) {
  
  const {Data}=payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
     //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
     if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = '/api/TransactionConfiguration/GetAllTradeRouteConfigurationArbitrage';
  } else {
      url = '/api/TransactionConfiguration/GetAllTradeRouteConfiguration';//add existing
  }
  
  const response = yield call(swaggerGetAPI, url, {}, headers);    
    //const response = yield call(swaggerGetAPI, '/api/TransactionConfiguration/GetAllTradeRouteConfiguration', {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTradeRouteListSuccess(response));
    } else {
      yield put(getTradeRouteListFailure(response));
    }
  } catch (error) {
    yield put(getTradeRouteListFailure(error));
  }
}

function* getTradeRouteList() {
  yield takeEvery(GET_TRADE_ROUTE_LIST, getTradeRouteListData);
}


function* addTradeRouteListData({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url= "";
      //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
      if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
        url = '/api/TransactionConfiguration/AddTradeRouteConfigurationArbitrage';
    } else {
        url = '/api/TransactionConfiguration/AddTradeRouteConfiguration';//add existing
    }
    
    const response = yield call(swaggerPostAPI, url, Data, headers);    
   // const response = yield call(swaggerPostAPI, '/api/TransactionConfiguration/AddTradeRouteConfiguration', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addTradeRouteListSuccess(response));
    } else {
      yield put(addTradeRouteListFailure(response));
    }
  } catch (error) {
    yield put(addTradeRouteListFailure(error));
  }
}

function* addTradeRouteList() {
  yield takeEvery(ADD_TRADE_ROUTE_LIST, addTradeRouteListData);
}

function* updateTradeRouteListData({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url= "";
     //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
     if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
       console.log("helllll")
      url = 'api/TransactionConfiguration/UpdateTradeRouteConfigurationArbitrage';
  } else {
      url = 'api/TransactionConfiguration/UpdateTradeRouteConfiguration';//add existing
  }
  
  const response = yield call(swaggerPostAPI, url, Data, headers);   

   // const response = yield call(swaggerPostAPI, '/api/TransactionConfiguration/UpdateTradeRouteConfiguration', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateTradeRouteListSuccess(response));
    } else {
      yield put(updateTradeRouteListFailure(response));
    }
  } catch (error) {
    yield put(updateTradeRouteListFailure(error));
  }
}

function* updateTradeRouteList() {
  yield takeEvery(UPDATE_TRADE_ROUTE_LIST, updateTradeRouteListData);
}

function* getOrderTypeListData({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, '/api/TransactionConfiguration/GetOrderType', {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getOrderTypeListSuccess(response));
    } else {
      yield put(getOrderTypeListFailure(response));
    }
  } catch (error) {
    yield put(getOrderTypeListFailure(error));
  }
}

function* getOrderTypeList() {
  yield takeEvery(UPDATE_TRADE_ROUTE_LIST, getOrderTypeListData);
}

function* getOrderTypeList() {
  yield takeEvery(GET_ORDER_TYPE_LIST, getOrderTypeListData);
}

function* getAvailableRoutesData({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    //const response = yield call(swaggerPostAPI, '/api/TransactionConfiguration/GetAvailableTradeRoute', Data,{});
    const response = yield call(swaggerPostAPI, '/api/TransactionConfiguration/GetAvailableTradeRoute/' + Data.TrnType, {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getAvailableRoutesSuccess(response));
    } else {
      yield put(getAvailableRoutesFailure(response));
    }
  } catch (error) {
    yield put(getAvailableRoutesFailure(error));
  }
}

function* getAvailableRoutes() {
  yield takeEvery(GET_AVAILABLE_ROUTES_LIST, getAvailableRoutesData);
}


export default function* rootSaga() {
  yield all([
    fork(getTradeRouteList),
    fork(addTradeRouteList),
    fork(updateTradeRouteList),
    fork(getOrderTypeList),
    fork(getAvailableRoutes),
  ]);
}
