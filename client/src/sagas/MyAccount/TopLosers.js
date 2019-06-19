/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { LIST_TOP_LOSERS } from "Actions/types";

import { listTopLosersSuccess, listTopLosersFailure } from "Actions";

/**
 * For Top Losers
 */

const topLosersData = [
    {name: "Uttam Value Steel Ltd.", value: 50},
    {name: "Raj Rayon Industries Ltd.",value:60},
    {name: "Sumaya LifeStyle Ltd.",value:40},
    {name: "Ankit Matel & Power Ltd.", value: 20},
    {name: "J Kumar Ltd.",value:30},
    {name: "BSL Software Solutions Ltd.",value:80},
  ];
  

function* topLosersMethod() {
  try {
    if (topLosersData !== "") {
      yield put(listTopLosersSuccess(topLosersData));
    } else {
      yield put(listTopLosersFailure(error));
    }
  } catch (error) {
    yield put(listTopLosersFailure(error));
  }
}

/**
 * Top Losers
 */
export function* listTopLosers() {
  yield takeEvery(LIST_TOP_LOSERS, topLosersMethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(listTopLosers)]);
}
