/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 26-09-2018
    UpdatedDate : 26-09-2018
    Description : Saga Function for Get Exchange List
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// api
import api from "Api";

import { GET_EXCHANGE } from "../actions/types";

import { getExchangeSuccess, getExchangeFailure } from "Actions";

/**
 * Send Exchange Master data Request To Server
 */
const getExchangeRequest = async () =>
  await api
    .get("exchange.js")
    .then(response => response.data)
    .catch(error => error);

/**
 * Get Exchange Master List From Server
 */
function* getExchangeFromServer() {
  try {
    const response = yield call(getExchangeRequest);
    yield put(getExchangeSuccess(response));
  } catch (error) {
    yield put(getExchangeFailure(error));
  }
}

/**
 * Get Exchange
 */
export function* getExchange() {
  yield takeEvery(GET_EXCHANGE, getExchangeFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
  yield all([fork(getExchange)]);
}
