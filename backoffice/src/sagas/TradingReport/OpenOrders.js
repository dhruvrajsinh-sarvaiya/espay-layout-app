//Sagas For OPen Orders By Tejas

// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// import actions methods for handle response
import { openOrdersSuccess, openOrdersFailure } from "Actions/TradingReport";

// import action types which is neccessary
import {
  OPEN_ORDERS,
  OPEN_ORDERS_REFRESH,
} from "Actions/types";

// Input (open orders request) which is passed from component
function* openOrdersAPI({ payload }) {
  const { openOrdersRequest } = payload

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingSummary', openOrdersRequest, {},headers);


    // check response status and histopry length
    if (response && response != null && response.ReturnCode === 0) {

      // call success method of action
      yield put(openOrdersSuccess(response));
    } else {
      // call failed method of action
      yield put(openOrdersFailure(response));
    }
  } catch (error) {
    // call failed method of action
    yield put(openOrdersFailure(error));
  }
}

/**
 * open orders List...
 */
export function* openOrders() {
  // call open orders action type and sagas api function
  yield takeEvery(OPEN_ORDERS, openOrdersAPI);
}

/**
 * open orders List on refresh or apply Buttom...
 */
export function* openOrdersRefresh() {
  // call open orders action type and sagas api function
  yield takeEvery(OPEN_ORDERS_REFRESH, openOrdersAPI);
}

/**
 * open orders Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
  yield all(
    [
      fork(openOrders),
      fork(openOrdersRefresh)
    ]);
}
