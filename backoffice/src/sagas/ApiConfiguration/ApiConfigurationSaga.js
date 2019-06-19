// sagas For Api Configuration Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { NotificationManager } from "react-notifications";

// types for set actions and reducers
import {
  GET_CONFIGURATION_LIST,
  GET_PROVIDER_DATA_LIST,
  ADD_CONFIGURATION_LIST,
  UPDATE_CONFIGURATION_LIST,
  DELETE_CONFIGURATION_LIST
} from "Actions/types";

// action sfor set data or response
import {
  getConfigurationListSuccess,
  getConfigurationListFailure,
  getProviderListSuccess,
  getProviderListFailure,
  addConfigurationListSuccess,
  addConfigurationListFailure,
  updateConfigurationListSuccess,
  updateConfigurationListFailure,
  deleteConfigurationListSuccess,
  deleteConfigurationListFailure
} from "Actions/APIConfiguration";

// Sagas Function for get configuration List by :Tejas
function* getConfigurationList() {
  yield takeEvery(GET_CONFIGURATION_LIST, getConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getConfigurationListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(getConfigurationListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response !== null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(getConfigurationListSuccess(response));
    } else {
      yield put(getConfigurationListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("configuration List Not Found");
    yield put(getConfigurationListFailure(error));
  }
}

// function for Call api and set response
const getConfigurationListRequest = async Data =>
  await api
    .get("ConfigurationList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for Add configuration List by :Tejas
function* addConfigurationList() {
  yield takeEvery(ADD_CONFIGURATION_LIST, addConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addConfigurationListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(addConfigurationListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(addConfigurationListSuccess(response));
    } else {
      yield put(addConfigurationListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("configuration List Not Found");
    yield put(addConfigurationListFailure(error));
  }
}

// function for Call api and set response
const addConfigurationListRequest = async Data =>
  await api
    .get("AddConfigurationList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for Update configuration List by :Tejas
function* updateConfigurationList() {
  yield takeEvery(UPDATE_CONFIGURATION_LIST, updateConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateConfigurationListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(updateConfigurationListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(updateConfigurationListSuccess(response));
    } else {
      yield put(updateConfigurationListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("configuration List Not Found");
    yield put(updateConfigurationListFailure(error));
  }
}

// function for Call api and set response
const updateConfigurationListRequest = async Data =>
  await api
    .get("UpdateConfigurationList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for delete configuration List by :Tejas
function* deleteConfigurationList() {
  yield takeEvery(DELETE_CONFIGURATION_LIST, deleteConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteConfigurationListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(deleteConfigurationListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(deleteConfigurationListSuccess(response));
    } else {
      yield put(deleteConfigurationListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("configuration List Not Found");
    yield put(deleteConfigurationListFailure(error));
  }
}

// function for Call api and set response
const deleteConfigurationListRequest = async Data =>
  await api
    .get("DeleteConfigurationList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for get Provider List by :Tejas
function* getProviderList() {
  yield takeEvery(GET_PROVIDER_DATA_LIST, getProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProviderListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(getProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(getProviderListSuccess(response));
    } else {
      //NotificationManager.error(response.data.message)
      yield put(getProviderListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("Provider List Not Found");
    yield put(getProviderListFailure(error));
  }
}

// function for Call api and set response
const getProviderListRequest = async Data =>
  await api
    .get("ProviderList.js", Data)
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getConfigurationList),
    fork(getProviderList),
    fork(addConfigurationList),
    fork(updateConfigurationList),
    fork(deleteConfigurationList)
  ]);
}
