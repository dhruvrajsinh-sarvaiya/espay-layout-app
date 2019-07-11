// sagas For Api Plan Subscription History By Devang parekh 11/3/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import { GET_API_KEY_CONFIGURATION_HISTORY } from "Actions/types";

// action sfor set data or Requests
import {
  getApiKeyConfigurationHistorySuccess,
  getApiKeyConfigurationHistoryFailure
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Plan Subscription History List by :Tejas
function* getApiKeyConfigurationHistory() {
  yield takeEvery(GET_API_KEY_CONFIGURATION_HISTORY, getApiKeyConfigurationHistoryDetail);
}

// Function for set Request to data and Call Function for Api Call
function* getApiKeyConfigurationHistoryDetail({ payload }) {

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/ViewPublicAPIKeys', payload, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getApiKeyConfigurationHistorySuccess(response));
    } else {
      yield put(getApiKeyConfigurationHistoryFailure(response));
    }
  } catch (error) {
    yield put(getApiKeyConfigurationHistoryFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiKeyConfigurationHistory)
  ]);
}
