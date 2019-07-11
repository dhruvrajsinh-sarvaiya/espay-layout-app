/**
 * Auther : Nirmit
 * Created : 04/10/2018
 * settled orders Sagas
 */

// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// import actions methods for handle response
import {
  settledOrdersSuccess,
  settledOrdersFailure
} from "Actions/TradingReport";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// import action types which is neccessary
import { SETTLED_ORDERS, SETTLED_ORDERS_REFRESH } from "Actions/types";


// Input (settled orders request) which is passed from component
function* settledOrdersAPI({ payload }) {
  const { settledOrdersRequest } = payload


  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingSummary', settledOrdersRequest, headers);


    if (response != null && response.ReturnCode === 0) {

      // call success method of action
      yield put(settledOrdersSuccess(response));
    } else {
      // call failed method of action
      yield put(settledOrdersFailure(response));
    }
  } catch (error) {
    // call failed method of action
    yield put(settledOrdersFailure(error));
  }
}

/**
 * settled orders List...
 */
export function* settledOrders() {
  // call settled orders action type and sagas api function
  yield takeEvery(SETTLED_ORDERS, settledOrdersAPI);
}

/**
 * settled orders List on refresh or apply Buttom...
 */
export function* settledOrdersRefresh() {
  // call settled orders action type and sagas api function
  yield takeEvery(SETTLED_ORDERS_REFRESH, settledOrdersAPI);
}

/**
 * settled orders Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
  yield all([fork(settledOrders), fork(settledOrdersRefresh)]);
}
