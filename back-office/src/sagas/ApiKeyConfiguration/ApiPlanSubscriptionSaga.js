// sagas For Api Plan Subscription History By Tejas 3/5/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_API_SUBSCRIPTION_HISTORY,
  GET_API_PLAN_USER_COUNTS,
} from "Actions/types";

// action sfor set data or Requests
import {
  getApiSubscriptionHistorySuccess,
  getApiSubscriptionHistoryFailure,
  getApiPlanUserCountsSuccess,
  getApiPlanUserCountsFailure,
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Plan Subscription History List by :Tejas
function* getApiSubscriptionHistory() {
  yield takeEvery(GET_API_SUBSCRIPTION_HISTORY, getApiSubscriptionHistoryDetail);
}

// Function for set Request to data and Call Function for Api Call
function* getApiSubscriptionHistoryDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/ViewUserSubscriptionHistory', Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getApiSubscriptionHistorySuccess(response));
    } else {
      yield put(getApiSubscriptionHistoryFailure(response));
    }
  } catch (error) {
    yield put(getApiSubscriptionHistoryFailure(error));
  }
}

// Sagas Function for get Api plan User total List by :Tejas
function* getApiPlanUserCounts() {
  yield takeEvery(GET_API_PLAN_USER_COUNTS, getApiPlanUserCountsDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiPlanUserCountsDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/ViewAPIPlanUserCount', Data, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getApiPlanUserCountsSuccess(response));
    } else {
      yield put(getApiPlanUserCountsFailure(response));
    }
  } catch (error) {
    yield put(getApiPlanUserCountsFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiSubscriptionHistory),
    fork(getApiPlanUserCounts),
  ]);
}
