/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { LIST_TRADE_SUMMARY } from "Actions/types";

import { listTradeSummarySuccess, listTradeSummaryFailure } from "Actions";

/**
 * For Trade Summary
 */

const TradeSummaryData = [
    {id: 1, exchange: "PARO Exchange", date: "08/10/2018", scripName:"HDFC ASSET MANA", buyQty:"0", buyRate:"0", buyTotal:"0", sellQty:"15", sellRate:"1010.37", sellTotal:"15155.55", netQty:"-15", netTotal:-20},
    {id: 2, exchange: "OHO Cash",date: "08/10/2018",scripName:"VARRROC", buyQty:"0", buyRate:"0", buyTotal:"0", sellQty:"13", sellRate:"1810.09", sellTotal:"23541.7", netQty:"-13", netTotal:10 },
    {id: 3, exchange: "OHO Cash",date: "08/10/2018",scripName:"SALBY LIMITED", buyQty:"0", buyRate:"0", buyTotal:"0", sellQty:"15", sellRate:"1010.37", sellTotal:"15155.55", netQty:"-15", netTotal:-30}
  ];
  

function* tradeSummaryMethod() {
  try {
    if (TradeSummaryData !== "") {
      yield put(listTradeSummarySuccess(TradeSummaryData));
    } else {
      yield put(listTradeSummaryFailure(error));
    }
  } catch (error) {
    yield put(listTradeSummaryFailure(error));
  }
}

/**
 * Trade Summary
 */
export function* listTradeSummary() {
  yield takeEvery(LIST_TRADE_SUMMARY, tradeSummaryMethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(listTradeSummary)]);
}
