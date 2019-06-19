// sagas For Liquidity Manager  Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_LIQUIDITY_API_MANAGER_LIST,
  ADD_LIQUIDITY_API_MANAGER_LIST,
  UPDATE_LIQUIDITY_API_MANAGER_LIST,
  GET_LIQUIDITY_PROVIDER_LIST,
  ADD_LIQUIDITY_PROVIDER_LIST,
  UPDATE_LIQUIDITY_PROVIDER_LIST,
  DELETE_LIQUIDITY_PROVIDER_LIST,
  GET_PROVIDERS_LIST,
  GET_LIMIT_DATA,
  GET_SERVICE_PROVIDER,
  GET_SERVICE_CONFIG,
  GET_PROVIDER_TYPE,
  GET_DAEMON_CONFIG,
  GET_TRANSACTION_TYPE
} from "Actions/types";

// actions for set data or response
import {
  getLiquidityManagerListSuccess,
  getLiquidityManagerListFailure,
  addLiquidityManagerListSuccess,
  addLiquidityManagerListFailure,
  updateLiquidityManagerListSuccess,
  updateLiquidityManagerListFailure,
  getLiquidityProviderListSuccess,
  getLiquidityProviderListFailure,
  addLiquidityProviderListSuccess,
  addLiquidityProviderListFailure,
  updateLiquidityProviderListSuccess,
  updateLiquidityProviderListFailure,
  deleteLiquidityProviderListSuccess,
  deleteLiquidityProviderListFailure,
  getProvidersListSuccess,
  getProvidersListFailure,
  getLimitDataListSuccess,
  getLimitDataListFailure,
  getProviderTypeListSuccess,
  getProviderTypeListFailure,
  getServiceConfigurationListSuccess,
  getServiceConfigurationListFailure,
  getServiceProviderListSuccess,
  getServiceProviderListFailure,
  getDaemonConfigListSuccess,
  getDaemonConfigListFailure,
  getTransactionTypeListSuccess,
  getTransactionTypeListFailure
} from "Actions/LiquidityManager";

// Sagas Function for get Liquidity Manager  Data by :Tejas
function* getLiquidityManagerList() {
  yield takeEvery(GET_LIQUIDITY_API_MANAGER_LIST, getLiquidityManagerListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getLiquidityManagerListDetail({ payload }) {
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllLiquidityAPIManager', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getLiquidityManagerListSuccess(response));
    }
    else {
      yield put(getLiquidityManagerListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getLiquidityManagerListFailure(error));
  }

}

// Sagas Function for add Liquidity Manager  Data by :Tejas
function* addLiquidityManagerList() {
  yield takeEvery(ADD_LIQUIDITY_API_MANAGER_LIST, addLiquidityManagerListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addLiquidityManagerListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddLiquidityAPIManager', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(addLiquidityManagerListSuccess(response));
    }
    else {
      yield put(addLiquidityManagerListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(addLiquidityManagerListFailure(error));
  }

}


// Sagas Function for UPDATE Liquidity Manager  Data by :Tejas
function* updateLiquidityManagerList() {
  yield takeEvery(
    UPDATE_LIQUIDITY_API_MANAGER_LIST,
    updateLiquidityManagerListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* updateLiquidityManagerListDetail({ payload }) {
  const { Data } = payload;

  try {

    var headers  = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateLiquidityAPIManager', Data, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateLiquidityManagerListSuccess(response));
    }
    else {
      yield put(updateLiquidityManagerListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(updateLiquidityManagerListFailure(error));
  }
}


// Sagas Function for get Liquidity Provider  Data by :Tejas
function* getLiquidityProviderList() {
  yield takeEvery(GET_LIQUIDITY_PROVIDER_LIST, getLiquidityProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getLiquidityProviderListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(getLiquidityProviderListRequest, Data);

    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(getLiquidityProviderListSuccess(response));
    } else {
      yield put(getLiquidityProviderListFailure(response));
    }
  } catch (error) {
    yield put(getLiquidityProviderListFailure(error));
  }
}

// function for Call api and set response
const getLiquidityProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for add Liquidity Provider  Data by :Tejas
function* addLiquidityProviderList() {
  yield takeEvery(ADD_LIQUIDITY_PROVIDER_LIST, addLiquidityProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addLiquidityProviderListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(addLiquidityProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(addLiquidityProviderListSuccess(response));
    } else {
      yield put(addLiquidityProviderListFailure(response));
    }
  } catch (error) {
    yield put(addLiquidityProviderListFailure(error));
  }
}

// function for Call api and set response
const addLiquidityProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for update Liquidity Provider  Data by :Tejas
function* updateLiquidityProviderList() {
  yield takeEvery(
    UPDATE_LIQUIDITY_PROVIDER_LIST,
    updateLiquidityProviderListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* updateLiquidityProviderListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(updateLiquidityProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(updateLiquidityProviderListSuccess(response));
    } else {
      yield put(updateLiquidityProviderListFailure(response));
    }
  } catch (error) {
    yield put(updateLiquidityProviderListFailure(error));
  }
}

// function for Call api and set response
const updateLiquidityProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for delete Liquidity Provider  Data by :Tejas
function* deleteLiquidityProviderList() {
  yield takeEvery(
    DELETE_LIQUIDITY_PROVIDER_LIST,
    deleteLiquidityProviderListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* deleteLiquidityProviderListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(deleteLiquidityProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(deleteLiquidityProviderListSuccess(response));
    } else {
      yield put(deleteLiquidityProviderListFailure(response));
    }
  } catch (error) {
    yield put(deleteLiquidityProviderListFailure(error));
  }
}

// Sagas Function for get Provider List Data by :Tejas
function* getProvidersList() {
  yield takeEvery(GET_PROVIDERS_LIST, getProvidersListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProvidersListDetail({ payload }) {
  //console.log("payload",payload);
  const {Data}=payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
    //code change by jayshreeba gohil (13-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetAllThirdPartyAPIArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetAllThirdPartyAPI';
    }
    const response = yield call(swaggerGetAPI, url, payload, headers); 

    //const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllThirdPartyAPI', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getProvidersListSuccess(response));
    }
    else {
      yield put(getProvidersListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getProvidersListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getLimitDataList() {
  yield takeEvery(GET_LIMIT_DATA, getLimitDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getLimitDataListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllLimitData', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getLimitDataListSuccess(response));
    }
    else {
      yield put(getLimitDataListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getLimitDataListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getServiceProviderList() {
  yield takeEvery(GET_SERVICE_PROVIDER, getServiceProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getServiceProviderListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetProviderList', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getServiceProviderListSuccess(response));
    }
    else {
      yield put(getServiceProviderListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getServiceProviderListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getServiceConfigurationList() {
  yield takeEvery(GET_SERVICE_CONFIG, getServiceConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getServiceConfigurationListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListProviderConfiguration', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getServiceConfigurationListSuccess(response));
    }
    else {
      yield put(getServiceConfigurationListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getServiceConfigurationListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getProviderTypeList() {
  yield takeEvery(GET_PROVIDER_TYPE, getProviderTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProviderTypeListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetServiceProviderType', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getProviderTypeListSuccess(response));
    }
    else {
      yield put(getProviderTypeListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getProviderTypeListFailure(error));
  }
}

// Sagas Function for get Daemon List Data by :Tejas
function* getDaemonConfigList() {
  yield takeEvery(GET_PROVIDER_TYPE, getDaemonConfigListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getDaemonConfigListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListDemonConfig', {}, headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getDaemonConfigListSuccess(response));
    }
    else {
      yield put(getDaemonConfigListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getDaemonConfigListFailure(error));
  }
}

// Sagas Function for get Transaction Type Data by :Tejas
function* getTransactionTypeList() {
  yield takeEvery(GET_TRANSACTION_TYPE, getTransactionTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTransactionTypeListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllTransactionType', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getTransactionTypeListSuccess(response));
    }
    else {
      yield put(getTransactionTypeListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getTransactionTypeListFailure(error));
  }
}


// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getLiquidityManagerList),
    fork(addLiquidityManagerList),
    fork(updateLiquidityManagerList),
    fork(getLiquidityProviderList),
    fork(addLiquidityProviderList),
    fork(updateLiquidityProviderList),
    fork(deleteLiquidityProviderList),
    fork(getProvidersList),
    fork(getProviderTypeList),
    fork(getServiceConfigurationList),
    fork(getServiceProviderList),
    fork(getLimitDataList),
    fork(getDaemonConfigList),
    fork(getTransactionTypeList),
  ]);
}
