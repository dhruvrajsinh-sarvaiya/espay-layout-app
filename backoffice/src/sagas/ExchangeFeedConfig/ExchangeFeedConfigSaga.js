// sagas For Exchange Feed Configuration Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers 
import {
  GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST
} from "Actions/types";

// actions for set data or response
import {
  getExchangeFeedListSuccess,
  getExchangeFeedListFailure,
  addExchangeConfigurationListSuccess,
  addExchangeConfigurationListFailure,
  updateExchangeConfigurationListSuccess,
  updateExchangeConfigurationListFailure,
  getExchangeFeedConfigSocketSuccess,
  getExchangeFeedConfigSocketFailure,
  getExchangeFeedConfigLimitsSuccess,
  getExchangeFeedConfigLimitsFailure
} from "Actions/ExchangeFeedConfig";

// Sagas Function for get Exchange Feed Configuration Data by :Tejas
function* getExchangeFeedConfigList() {
  yield takeEvery(
    GET_EXCHANGE_FEED_CONFIGURATION_LIST,
    getExchangeFeedConfigListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetAllFeedConfiguration', {}, headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getExchangeFeedListSuccess(response));
    }
    else {
      yield put(getExchangeFeedListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getExchangeFeedListFailure(error));
  }
}

// Sagas Function for Add Exchange Feed Configuration Data by :Tejas
function* addExchangeConfigurationList() {
  yield takeEvery(
    ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
    addExchangeFeedConfigListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* addExchangeFeedConfigListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/ExchangeFeedConfiguration/AddFeedConfiguration', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(addExchangeConfigurationListSuccess(response));
    }
    else {
      yield put(addExchangeConfigurationListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(addExchangeConfigurationListFailure(error));
  }
}

// Sagas Function for Add Exchange Feed Configuration Data by :Tejas
function* updateExchangeConfigurationList() {
  yield takeEvery(
    UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
    updateExchangeFeedConfigListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* updateExchangeFeedConfigListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/ExchangeFeedConfiguration/UpdateFeedConfiguration', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateExchangeConfigurationListSuccess(response));
    }
    else {
      yield put(updateExchangeConfigurationListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(updateExchangeConfigurationListFailure(error));
  }
}


// Sagas Function for get Exchange Feed Configuration Socket Methods Data by :Tejas
function* getExchangeFeedConfigSocket() {
  yield takeEvery(
    GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
    getExchangeFeedConfigSocketDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigSocketDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetSocketMethods', {}, headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getExchangeFeedConfigSocketSuccess(response));
    }
    else {
      yield put(getExchangeFeedConfigSocketFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getExchangeFeedConfigSocketFailure(error));
  }
}

// Sagas Function for get Exchange Feed Configuration Socket Methods Data by :Tejas
function* getExchangeFeedConfigLimits() {
  yield takeEvery(
    GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
    getExchangeFeedConfigLimitsDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigLimitsDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/ExchangeFeedConfiguration/GetFeedLimitListV2', {}, headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getExchangeFeedConfigLimitsSuccess(response));
    }
    else {
      yield put(getExchangeFeedConfigLimitsFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getExchangeFeedConfigLimitsFailure(error));
  }
}


// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getExchangeFeedConfigList),
    fork(addExchangeConfigurationList),
    fork(updateExchangeConfigurationList),
    fork(getExchangeFeedConfigSocket),
    fork(getExchangeFeedConfigLimits)
  ]);
}
