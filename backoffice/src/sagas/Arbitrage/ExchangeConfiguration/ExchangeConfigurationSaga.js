// sagas For arbitrage exchange  Actions By Devang parekh (11-6-2019)

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
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  GET_ARBITRAGE_PROVIDERS_LIST,
  GET_ARBITRAGE_SERVICE_PROVIDER,
  GET_ARBITRAGE_SERVICE_CONFIG,
  GET_ARBITRAGE_PROVIDER_TYPE,
  GET_ARBITRAGE_TRANSACTION_TYPE,
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE
} from "Actions/types";

// actions for set data or response
import {
  getExchangeConfigurationListSuccess,
  getExchangeConfigurationListFailure,
  addExchangeConfigurationListSuccess,
  addExchangeConfigurationListFailure,
  updateExchangeConfigurationListSuccess,
  updateExchangeConfigurationListFailure,
  getArbitrageExchangeProviderListSuccess,
  getArbitrageExchangeProviderListFailure,
  addArbitrageExchangeProviderListSuccess,
  addArbitrageExchangeProviderListFailure,
  updateArbitrageExchangeProviderListSuccess,
  updateArbitrageExchangeProviderListFailure,
  deleteArbitrageExchangeProviderListSuccess,
  deleteArbitrageExchangeProviderListFailure,
  getArbitrageProvidersListSuccess,
  getArbitrageProvidersListFailure,
  getArbitrageProviderTypeListSuccess,
  getArbitrageProviderTypeListFailure,
  getArbitrageServiceConfigurationListSuccess,
  getArbitrageServiceConfigurationListFailure,
  getArbitrageServiceProviderListSuccess,
  getArbitrageServiceProviderListFailure,
  getArbitrageTransactionTypeListSuccess,
  getArbitrageTransactionTypeListFailure,

  changeArbitrageOrderTypeSuccess,
  changeArbitrageOrderTypeFailure
} from "Actions/Arbitrage/ExchangeConfiguration";

// Sagas Function for get arbitrage exchange  Data by :Tejas
function* getExchangeConfigurationList() {
  yield takeEvery(GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST, getExchangeConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getExchangeConfigurationListDetail({ payload }) {
  
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllExchangeConfigurationArbitrage/1?PageSize=500', {},headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getExchangeConfigurationListSuccess(response));
    }else {
      yield put(getExchangeConfigurationListFailure(response));
    }

  } catch (error) {
    console.log(error)
    yield put(getExchangeConfigurationListFailure(error));
  }

}

// Sagas Function for add arbitrage exchange  Data by :Tejas
function* addExchangeConfigurationList() {
  yield takeEvery(ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST, addExchangeConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addExchangeConfigurationListDetail({ payload }) {

  const { Data } = payload;

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddLiquidityAPIManager', Data, headers)

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

// Sagas Function for UPDATE arbitrage exchange  Data by :Tejas
function* updateExchangeConfigurationList() {
  yield takeEvery(UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,updateExchangeConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateExchangeConfigurationListDetail({ payload }) {

  const { Data } = payload;

  try {

    var headers  = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateLiquidityAPIManager', Data, headers)

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

// Sagas Function for get exchange configuration  Data by :Tejas
function* getArbitrageExchangeProviderList() {
  yield takeEvery(GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST, getArbitrageExchangeProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getArbitrageExchangeProviderListDetail({ payload }) {

  const { Data } = payload;
  try {
    const response = yield call(getArbitrageExchangeProviderListRequest, Data);

    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(getArbitrageExchangeProviderListSuccess(response));
    } else {
      yield put(getArbitrageExchangeProviderListFailure(response));
    }
  } catch (error) {
    yield put(getArbitrageExchangeProviderListFailure(error));
  }

}

// function for Call api and set response
const getArbitrageExchangeProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for add exchange configuration  Data by :Tejas
function* addArbitrageExchangeProviderList() {
  yield takeEvery(ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST, addArbitrageExchangeProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addArbitrageExchangeProviderListDetail({ payload }) {

  const { Data } = payload;
  try {
    const response = yield call(addArbitrageExchangeProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(addArbitrageExchangeProviderListSuccess(response));
    } else {
      yield put(addArbitrageExchangeProviderListFailure(response));
    }
  } catch (error) {
    yield put(addArbitrageExchangeProviderListFailure(error));
  }

}

// function for Call api and set response
const addArbitrageExchangeProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for update exchange configuration  Data by :Tejas
function* updateArbitrageExchangeProviderList() {
  yield takeEvery(
    UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
    updateArbitrageExchangeProviderListDetail
  );
}

// Function for set response to data and Call Function for Api Call
function* updateArbitrageExchangeProviderListDetail({ payload }) {

  const { Data } = payload;
  try {
    const response = yield call(updateArbitrageExchangeProviderListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(updateArbitrageExchangeProviderListSuccess(response));
    } else {
      yield put(updateArbitrageExchangeProviderListFailure(response));
    }
  } catch (error) {
    yield put(updateArbitrageExchangeProviderListFailure(error));
  }

}

// function for Call api and set response
const updateArbitrageExchangeProviderListRequest = async Data =>
  await api
    .get("LiquidityProvider.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for delete exchange configuration  Data by :Tejas
function* deleteArbitrageExchangeProviderList() {
  yield takeEvery(DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,deleteArbitrageExchangeProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteArbitrageExchangeProviderListDetail({ payload }) {

  const { Data } = payload;
  try {
    const response = yield call(deleteArbitrageExchangeProviderListRequest, Data);
    // set response if its available else set error message
    if (response && response != null && response !== undefined && response.status === 200) {
      yield put(deleteArbitrageExchangeProviderListSuccess(response));
    } else {
      yield put(deleteArbitrageExchangeProviderListFailure(response));
    }
  } catch (error) {
    yield put(deleteArbitrageExchangeProviderListFailure(error));
  }

}

// Sagas Function for get Provider List Data by :Tejas
function* getArbitrageProvidersList() {
  yield takeEvery(GET_ARBITRAGE_PROVIDERS_LIST, getArbitrageProvidersListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getArbitrageProvidersListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllThirdPartyAPI', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getArbitrageProvidersListSuccess(response));
    }
    else {
      yield put(getArbitrageProvidersListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getArbitrageProvidersListFailure(error));
  }

}

// Sagas Function for get Limit List Data by :Tejas
function* getArbitrageServiceProviderList() {
  yield takeEvery(GET_ARBITRAGE_SERVICE_PROVIDER, getArbitrageServiceProviderListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getArbitrageServiceProviderListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetProviderList', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getArbitrageServiceProviderListSuccess(response));
    }
    else {
      yield put(getArbitrageServiceProviderListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getArbitrageServiceProviderListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getArbitrageServiceConfigurationList() {
  yield takeEvery(GET_ARBITRAGE_SERVICE_CONFIG, getArbitrageServiceConfigurationListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getArbitrageServiceConfigurationListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListProviderConfiguration', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getArbitrageServiceConfigurationListSuccess(response));
    }
    else {
      yield put(getArbitrageServiceConfigurationListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getArbitrageServiceConfigurationListFailure(error));
  }
}

// Sagas Function for get Limit List Data by :Tejas
function* getArbitrageProviderTypeList() {
  yield takeEvery(GET_ARBITRAGE_PROVIDER_TYPE, getArbitrageProviderTypeListDetail);
}

// FARBITRAGE_unction for set response to data and Call Function for Api Call
function* getArbitrageProviderTypeListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetServiceProviderType', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getArbitrageProviderTypeListSuccess(response));
    }
    else {
      yield put(getArbitrageProviderTypeListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getArbitrageProviderTypeListFailure(error));
  }
}

// Sagas Function for get Transaction Type Data by :Tejas
function* getArbitrageTransactionTypeList() {
  yield takeEvery(GET_ARBITRAGE_TRANSACTION_TYPE, getArbitrageTransactionTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getArbitrageTransactionTypeListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllTransactionType', {},headers)

    if (response && response != null && response.ReturnCode === 0) {
      yield put(getArbitrageTransactionTypeListSuccess(response));
    }
    else {
      yield put(getArbitrageTransactionTypeListFailure(response));
    }
  } catch (error) {
    // console.log(error)
    yield put(getArbitrageTransactionTypeListFailure(error));
  }
}


// Sagas Function for get arbitrage exchange  Data by :Tejas
function* changeArbitrageAllowOrderType() {
  yield takeEvery(CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE, changeArbitrageAllowOrderTypeDetail);
}

// Function for set response to data and Call Function for Api Call
function* changeArbitrageAllowOrderTypeDetail({ payload }) {
  
  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateExchangeConfigurationArbitrage', payload, headers)
    
    if (response && response != null && response.ReturnCode === 0) {
      yield put(changeArbitrageOrderTypeSuccess(response));
    }else {
      yield put(changeArbitrageOrderTypeFailure(response));
    }

  } catch (error) {
    console.log(error)
    yield put(changeArbitrageOrderTypeFailure(error));
  }

}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getExchangeConfigurationList),
    fork(addExchangeConfigurationList),
    fork(updateExchangeConfigurationList),
    fork(getArbitrageExchangeProviderList),
    fork(addArbitrageExchangeProviderList),
    fork(updateArbitrageExchangeProviderList),
    fork(deleteArbitrageExchangeProviderList),
    fork(getArbitrageProvidersList),
    fork(getArbitrageProviderTypeList),
    fork(getArbitrageServiceConfigurationList),
    fork(getArbitrageServiceProviderList),
    fork(getArbitrageTransactionTypeList),
    fork(changeArbitrageAllowOrderType),
  ]);
}
