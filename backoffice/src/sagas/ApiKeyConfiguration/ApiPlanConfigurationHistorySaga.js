// sagas For Api Plan Subscription History By Devang parekh 11/3/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_API_PLAN_CONFIGURATION_HISTORY
} from "Actions/types";

// action sfor set data or Requests
import {
  getApiPlanConfigurationHistorySuccess,
  getApiPlanConfigurationHistoryFailure,
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Plan Subscription History List by :Tejas
function* getApiPlanConfigurationHistory() {
  yield takeEvery(GET_API_PLAN_CONFIGURATION_HISTORY, getApiPlanConfigurationHistoryDetail);
}

// Function for set Request to data and Call Function for Api Call
function* getApiPlanConfigurationHistoryDetail({ payload }) {
  //const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/ViewAPIPlanConfigurationHistory', payload, headers);
    
    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getApiPlanConfigurationHistorySuccess(response));
    } else {
      yield put(getApiPlanConfigurationHistoryFailure(response));
    }
  } catch (error) {
    yield put(getApiPlanConfigurationHistoryFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiPlanConfigurationHistory)
  ]);
}
