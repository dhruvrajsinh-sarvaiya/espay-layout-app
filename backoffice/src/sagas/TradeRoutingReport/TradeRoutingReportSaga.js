// Saga For Get,add and Update Trade Route By Tejas
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

import {
  GET_TRADE_ROUTING_REPORT_LIST,  
} from "Actions/types";

// import functions from action
import {
  getTradeRoutingReportSuccess,
  getTradeRoutingReportFailure,  
} from "Actions/TradeRoutingReport";


function* getTradeRoutingReportData({ payload }) {

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/TransactionConfiguration/GetAllTradeRouteConfiguration', {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTradeRoutingReportSuccess(response));
    } else {
      yield put(getTradeRoutingReportFailure(response));
    }
  } catch (error) {
    yield put(getTradeRoutingReportFailure(error));
  }
}

function* getTradeRoutingReport() {
  yield takeEvery(GET_TRADE_ROUTING_REPORT_LIST, getTradeRoutingReportData);
}

export default function* rootSaga() {
  yield all([
    fork(getTradeRoutingReport),  
  ]);
}
