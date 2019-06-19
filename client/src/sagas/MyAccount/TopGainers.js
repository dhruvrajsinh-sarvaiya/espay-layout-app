/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { LIST_TOP_GAINERS } from "Actions/types";

import { listTopGainersSuccess, listTopGainersFailure } from "Actions";

/**
 * For Top Gainers
 */

const topGainersData = [
  { name: "Blue Chip india Ltd.", value: 20 },
  { name: "KKS Ltd.", value: 30 },
  { name: "FCS Software Solutions Ltd.", value: 10 },
  { name: "Cimmaco Ltd.", value: 50 },
  { name: "IL&FS Solutions Ltd.", value: 70 },
  { name: "Azeno Ltd.", value: 30 },
  { name: "AMC Software Solutions Ltd.", value: 80 }
];

function* topGainersMethod() {
  try {
    if (topGainersData !== "") {
      yield put(listTopGainersSuccess(topGainersData));
    } else {
      yield put(listTopGainersFailure(error));
    }
  } catch (error) {
    yield put(listTopGainersFailure(error));
  }
}

/**
 * Top Gainers
 */
export function* listTopGainers() {
  yield takeEvery(LIST_TOP_GAINERS, topGainersMethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(listTopGainers)]);
}
