// sagas For Get Api Key Data Actions By Tejas 7/3/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerDeleteAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_API_KEY_LIST,
  ADD_IP_ADDRESS,
  REMOVE_IP_ADDRESS,
  UPDATE_API_KEY_LIST,
  GENERATE_API_KEY,
  DELETE_API_KEY,
  GET_IP_WHITELIST_DATA,
  GET_API_KEY_BY_ID
} from "Actions/types";

// action sfor set data or response
import {
  getApiKeyListSuccess,
  getApiKeyListFailure,
  addIPAddressSuccess,
  addIPAddressFailure,
  removeIPAddressSuccess,
  removeIPAddressFailure,
  updateApiKeyListSuccess,
  updateApiKeyListFailure,
  generateApiKeySuccess,
  generateApiKeyFailure,
  deleteApiKeySuccess,
  deleteApiKeyFailure,
  getIpWhiteListdataSuccess,
  getIpWhiteListdataFailure,
  getApiKeyByIDSuccess,
  getApiKeyByIDFailure,
} from "Actions/ApiKey";

// Sagas Function for get api Key list  by :Tejas
function* getApiKeyList() {
  yield takeEvery(GET_API_KEY_LIST, getApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiKeyListDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/GetAPIKeyList/' + Data.PlanID, {}, headers);


    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getApiKeyListSuccess(response));
    } else {
      yield put(getApiKeyListFailure(response));
    }
  } catch (error) {
    yield put(getApiKeyListFailure(error));
  }
}

// Sagas Function for get api Key list ID by :Tejas
function* getApiKeyByID() {
  yield takeEvery(GET_API_KEY_BY_ID, getApiKeyByIDDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiKeyByIDDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/GetAPIKeyByID/' + Data.KeyID, {}, headers);


    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getApiKeyByIDSuccess(response));
    } else {
      yield put(getApiKeyByIDFailure(response));
    }
  } catch (error) {
    yield put(getApiKeyByIDFailure(error));
  }
}

// Sagas Function for get api Key list  by :Tejas
function* addIPAddress() {
  yield takeEvery(ADD_IP_ADDRESS, addIPAddressDetail);
}

// Function for set response to data and Call Function for Api Call
function* addIPAddressDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/IPWhitelist', Data, headers);


    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addIPAddressSuccess(response));
    } else {
      yield put(addIPAddressFailure(response));
    }
  } catch (error) {
    yield put(addIPAddressFailure(error));
  }
}

// Sagas Function for get api Key list  by :Tejas
function* updateApiKeyList() {
  yield takeEvery(UPDATE_API_KEY_LIST, updateApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateApiKeyListDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/UpdateAPIKey/' + Data.planKey, {}, headers);


    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateApiKeyListSuccess(response));
    } else {
      yield put(updateApiKeyListFailure(response));
    }
  } catch (error) {
    yield put(updateApiKeyListFailure(error));
  }
}

// Sagas Function for get api Key list  by :Tejas
function* generateApiKey() {
  yield takeEvery(GENERATE_API_KEY, generateApiKeyDetail);
}

// Function for set response to data and Call Function for Api Call
function* generateApiKeyDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/APIConfiguration/GenerateAPIKey', Data.data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(generateApiKeySuccess(response));
    } else {
      yield put(generateApiKeyFailure(response));
    }
  } catch (error) {
    yield put(generateApiKeyFailure(error));
  }
}


// Sagas Function for delete api Key list  by :Tejas
function* deleteApiKeyList() {
  yield takeEvery(DELETE_API_KEY, deleteApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteApiKeyListDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerDeleteAPI, 'api/APIConfiguration/DeleteAPIKey/' + Data.planKey, {}, headers);


    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(deleteApiKeySuccess(response));
    } else {
      yield put(deleteApiKeyFailure(response));
    }
  } catch (error) {
    yield put(deleteApiKeyFailure(error));
  }
}


// Sagas Function for get Ip White list  by :Tejas
function* getIpWhiteListdata() {
  yield takeEvery(GET_IP_WHITELIST_DATA, getIpWhiteListdataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getIpWhiteListdataDetail({ payload }) {
  const Data = payload;
  let queryParams = '';

  try {
    const createQueryParams = params =>
      Object.keys(params)
        .map(k => `${k}=${encodeURI(params[k])}`)
        .join('&');

    if (Data.KeyID) {
      queryParams = createQueryParams(Data);
    }

    var url = 'api/APIConfiguration/GetWhitelistIP/' + Data.planKey + (queryParams !== "" ? '/?' + queryParams : '')

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, url, Data, headers);



    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getIpWhiteListdataSuccess(response));
    } else {
      yield put(getIpWhiteListdataFailure(response));
    }
  } catch (error) {

    yield put(getIpWhiteListdataFailure(error));
  }
}

// Sagas Function for get api Key list  by :Tejas
function* removeIPAddress() {
  yield takeEvery(REMOVE_IP_ADDRESS, removeIPAddressDetail);
}

// Function for set response to data and Call Function for Api Call
function* removeIPAddressDetail({ payload }) {
  const Data = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerDeleteAPI, 'api/APIConfiguration/DeleteWhitelistIP/' + Data.IPId, {}, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(removeIPAddressSuccess(response));
    } else {
      yield put(removeIPAddressFailure(response));
    }
  } catch (error) {
    yield put(removeIPAddressFailure(error));
  }
}


// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getApiKeyList),
    fork(addIPAddress),
    fork(removeIPAddress),
    fork(updateApiKeyList),
    fork(generateApiKey),
    fork(deleteApiKeyList),
    fork(getIpWhiteListdata),
    fork(getApiKeyByID),
  ]);
}
