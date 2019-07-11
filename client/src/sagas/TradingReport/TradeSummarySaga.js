/*
 * Created By Megha Kariya 
 * Date :- 09-01-2019
 * Saga File for Trade Summary Report
*/

/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { GET_TRADE_SUMMARY_DATA, GET_PAIR_LIST_DATA } from "Actions/types";
import { listTradeSummarySuccess, listTradeSummaryFailure, getTradePairsSuccess, getTradePairsFailure } from "Actions/TradingReport";
import { swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

/**
 * For Trade Summary
*/
function* tradeSummaryMethod({ payload }) {
  const Data = payload;
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/TradeSettledHistory', Data, headers);

    if (response !== null && response.ReturnCode === 0) {
      yield put(listTradeSummarySuccess(response));
    } else {
      yield put(listTradeSummaryFailure(response));
    }
  } catch (error) {

    yield put(listTradeSummaryFailure(error));
  }
}

/**
 * Trade Summary
 */
export function* listTradeSummary() {
  yield takeEvery(GET_TRADE_SUMMARY_DATA, tradeSummaryMethod);
}

// Sagas Function for get Trade Pairs Data by :Tejas
function* getTradePairs() {
  yield takeEvery(GET_PAIR_LIST_DATA, getTradePairsDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradePairsDetail({ payload }) {

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListPair', {}, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getTradePairsSuccess(response));
    } else {
      yield put(getTradePairsFailure(response));
    }
  } catch (error) {
    yield put(getTradePairsFailure(error));
  }
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(listTradeSummary),
    fork(getTradePairs),
  ]);
}
