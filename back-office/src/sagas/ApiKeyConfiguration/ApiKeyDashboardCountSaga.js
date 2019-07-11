// sagas For Api PLan configuration dashbaord count 
// devang parekh (9-4-2019)

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// function for get Data with Type GET
import { swaggerGetAPI } from 'Helpers/helpers';

//import Appconfig Object for access Constants
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_API_KEY_DASHBOARD_COUNT
} from "Actions/types";

// action sfor set data or response
import {
  getApiKeyDashboardCountSuccess,
  getApiKeyDashboardCountFailure
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Api PLan configuration dashbaord count  by :devang parekh
function* getApiKeyDashboardCount() {
  yield takeEvery(GET_API_KEY_DASHBOARD_COUNT, getApiKeyDashboardCountRequest);
}

// Function for set response to data and Call Function for Api Call
function* getApiKeyDashboardCountRequest({ payload }) {
 
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/APIPlanConfigurationCount', {}, headers);

    // set response if its available else set error message
    if (response != null && response.ReturnCode === 0) {
      yield put(getApiKeyDashboardCountSuccess(response));
    } else {
      yield put(getApiKeyDashboardCountFailure(response));
    }

  } catch (error) {
    yield put(getApiKeyDashboardCountFailure(error));
  }

}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiKeyDashboardCount)
  ]);
}
