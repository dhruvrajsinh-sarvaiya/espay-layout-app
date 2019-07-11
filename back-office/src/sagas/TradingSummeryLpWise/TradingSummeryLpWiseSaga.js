// sagas For Trade Summary LPwise Actions By Karan Joshi

// effects for redux-saga
import { call, all, put, takeEvery, fork } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from "Helpers/helpers";

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {  TRADING_SUMMARY_LPWISE_LIST } from "Actions/types";

// actions for set data or response
import {
  getTradingSummeryLpwiseListSucessfull,
  getTradingSummeryLpwiseListFail
} from "Actions/TradingSummeryLpWise";


// Function for set response to data and Call Function for Api Call
function* getdatalistforTradingSummery({ payload }) {
  const { Data } = payload
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/TransactionBackOffice/TradingSummaryLPWise', Data, {} ,headers);
    
    
    if (response != null && response.ReturnCode === 0) {
      yield put(getTradingSummeryLpwiseListSucessfull(response));
      
    } else {
      yield put(getTradingSummeryLpwiseListFail(response));
    }
  } catch (error) {
    yield put(getTradingSummeryLpwiseListFail(error));
  }
}


function* getdatalistofTrading() {
  yield takeEvery(TRADING_SUMMARY_LPWISE_LIST, getdatalistforTradingSummery);
}

export default function* rootSaga() {
  yield all(
    [
      fork(getdatalistofTrading)
    ]
  );
}