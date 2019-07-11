// sagas For Provider Configuration Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_PROVIDER_CONFIGURATION_LIST,
  ADD_PROVIDER_CONFIGURATION_LIST,
  UPDATE_PROVIDER_CONFIGURATION_LIST,
} from "Actions/types";

// action sfor set data or response
import {
  getProviderConfigListSuccess,
  getProviderConfigListFailure,
  addProviderConfigSuccess,
  addProviderConfigFailure,
  updateProviderConfigSuccess,
  updateProviderConfigFailure,
} from "Actions/ProviderConfiguration";

// Sagas Function for get Provider Configuration by :Tejas
function* getProviderConfigList() {
  yield takeEvery(GET_PROVIDER_CONFIGURATION_LIST, getProviderConfigListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProviderConfigListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";

    //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetAllProviderConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetAllProviderConfiguration';
    }

    const response = yield call(swaggerPostAPI, url, {}, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(getProviderConfigListSuccess(response));
    } else {
      yield put(getProviderConfigListFailure(response));
    }
  } catch (error) {
    yield put(getProviderConfigListFailure(error));
  }
}

// Sagas Function for Add Provider Configuration by :Tejas
function* addProviderConfig() {

  yield takeEvery(ADD_PROVIDER_CONFIGURATION_LIST, addProviderConfigDetail);
}

// Function for set response to data and Call Function for Api Call
function* addProviderConfigDetail({ payload }) {

  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";

    //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddProviderConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddProviderConfiguration';
    }

    const response = yield call(swaggerPostAPI, url, Data, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(addProviderConfigSuccess(response));
    } else {
      yield put(addProviderConfigFailure(response));
    }
  } catch (error) {

    yield put(addProviderConfigFailure(error));
  }
}
// Sagas Function for Update Provider Configuration by :Tejas
function* updateProviderConfig() {
  yield takeEvery(UPDATE_PROVIDER_CONFIGURATION_LIST, updateProviderConfigDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateProviderConfigDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }, url = "";

    //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
    if (Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/UpdateProviderConfigurationArbitrage';
    } else {
      url = 'api/TransactionConfiguration/UpdateProviderConfiguration';
    }

    const response = yield call(swaggerPostAPI, url, Data, headers);

    // set response if its available else set error message
    if ( response != null && response.ReturnCode === 0) {
      yield put(updateProviderConfigSuccess(response));
    } else {
      yield put(updateProviderConfigFailure(response));
    }
  } catch (error) {
    yield put(updateProviderConfigFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getProviderConfigList),
    fork(addProviderConfig),
    fork(updateProviderConfig),
  ]);
}
