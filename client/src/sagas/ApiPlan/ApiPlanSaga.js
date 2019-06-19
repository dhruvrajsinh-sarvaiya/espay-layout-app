// sagas For Get Api Plan Data Actions By Tejas 11/2/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_API_PLAN_DATA,
  SUBSCRIBE_API_PLAN,
  GET_USER_ACTIVE_PLAN,
  SET_AUTO_RENEWAL_PLAN,
  STOP_AUTO_RENEWAL_PLAN,
  GET_AUTO_RENEWAL_PLAN,
  SET_MANUAL_RENEWAL_PLAN
} from "Actions/types";

// action sfor set data or response
import {
  getApiPlanListSuccess,
  getApiPlanListFailure,
  subScribeApiPlanSuccess,
  subScribeApiPlanFailure,
  getUserActivePlanSuccess,
  getUserActivePlanFailure,
  setAutoRenewalSuccess,
  setAutoRenewalFailure,
  stopAutoRenewalSuccess,
  stopAutoRenewalFailure,
  getAutoRenewalPlanSuccess,
  getAutoRenewalPlanFailure,
  manualRenewPlanSuccess,
  manualRenewPlanFailure
} from "Actions/ApiPlan";

// Sagas Function for get api plan list  by :Tejas
function* getApiPlanList() {
  yield takeEvery(GET_API_PLAN_DATA, getApiPlanListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiPlanListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/APIConfiguration/ViewAPIPlanDetail', {}, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getApiPlanListSuccess(response));
    } else {
      yield put(getApiPlanListFailure(response));
    }
  } catch (error) {
    yield put(getApiPlanListFailure(error));
  }
}


// Sagas Function for subscribe api plan by :Tejas
function* subScribeApiPlan() {
  yield takeEvery(SUBSCRIBE_API_PLAN, subScribeApiPlanDetail);
}

// Function for set response to data and Call Function for Api Call
function* subScribeApiPlanDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/SubscribeAPIPlan', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(subScribeApiPlanSuccess(response));
    } else {
      yield put(subScribeApiPlanFailure(response));
    }
  } catch (error) {
    yield put(subScribeApiPlanFailure(error));
  }
}

// Sagas Function for subscribe api plan by :Tejas
function* getUserActivePlan() {
  yield takeEvery(GET_USER_ACTIVE_PLAN, getUserActivePlanDetail);
}

// Function for set response to data and Call Function for Api Call
function* getUserActivePlanDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/ViewUserActivePlan', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getUserActivePlanSuccess(response));
    } else {
      yield put(getUserActivePlanFailure(response));
    }
  } catch (error) {
    yield put(getUserActivePlanFailure(error));
  }
}

// Sagas Function for Set Auto Renewal by :Tejas
function* setAutoRenewal() {
  yield takeEvery(SET_AUTO_RENEWAL_PLAN, setAutoRenewalDetail);
}

// Function for set response to data and Call Function for Api Call
function* setAutoRenewalDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/AutoRenewAPIPlan', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(setAutoRenewalSuccess(response));
    } else {
      yield put(setAutoRenewalFailure(response));
    }
  } catch (error) {
    yield put(setAutoRenewalFailure(error));
  }
}

// Sagas Function for stop Auto Renewal by :Tejas
function* stopAutoRenewal() {
  yield takeEvery(STOP_AUTO_RENEWAL_PLAN, stopAutoRenewalDetail);
}

// Function for set response to data and Call Function for Api Call
function* stopAutoRenewalDetail({ payload }) {
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/StopAutoRenewPlan', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(stopAutoRenewalSuccess(response));
    } else {
      yield put(stopAutoRenewalFailure(response));
    }
  } catch (error) {
    yield put(stopAutoRenewalFailure(error));
  }
}

// Sagas Function for get Auto Renewal plan by :Tejas
function* getAutoRenewalPlan() {
  yield takeEvery(GET_AUTO_RENEWAL_PLAN, getAutoRenewalPlanDetail);
}

// Function for set response to data and Call Function for Api Call
function* getAutoRenewalPlanDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/GetAutoRenewPlanDetail', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getAutoRenewalPlanSuccess(response));
    } else {
      yield put(getAutoRenewalPlanFailure(response));
    }
  } catch (error) {
    yield put(getAutoRenewalPlanFailure(error));
  }
}

// Sagas Function for set manual renew plan by :Tejas
function* manualRenewPlan() {
  yield takeEvery(SET_MANUAL_RENEWAL_PLAN, manualRenewPlanDetail);
}

// Function for set response to data and Call Function for Api Call
function* manualRenewPlanDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/ManualRenewAPIPlan', payload.Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(manualRenewPlanSuccess(response));
    } else {
      yield put(manualRenewPlanFailure(response));
    }
  } catch (error) {
    yield put(manualRenewPlanFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiPlanList),
    fork(subScribeApiPlan),
    fork(getUserActivePlan),
    fork(setAutoRenewal),
    fork(stopAutoRenewal),
    fork(getAutoRenewalPlan),
    fork(manualRenewPlan)
  ]);
}
