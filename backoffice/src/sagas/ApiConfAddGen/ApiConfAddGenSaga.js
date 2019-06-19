/**
 * Added By Devang Parekh
 * saga is used to handle functionality of component and handle data
 * handle multiple delete , add, edit option in sagas methods for api conf. for address generation
 *
 */

import { all, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
  GET_API_CONF_ADD_GEN_LIST,
  GET_CURRENCY,
  GET_API_PROVIDER,
  GET_CALLBACK_LIST,
  ADD_API_CONF_ADD_GEN,
  EDIT_API_CONF_ADD_GEN,
  DELETE_API_CONF_ADD_GEN
} from "Actions/types";

// import functions from action
import {
  getApiConfAddGenListSucess,
  getApiConfAddGenListFailure,
  getCurrencyListSuccess,
  getCurrencyListFailure,
  getApiProviderListSuccess,
  getApiProviderListFailure,
  getCallbcakListSuccess,
  getCallbcakListFailure,
  submitApiConfAddGenFormSuccess,
  submitApiConfAddGenFormFailure,
  editApiConfAddGenFormSuccess,
  editApiConfAddGenFormFailure,
  deleteApiConfAddGenFormSuccess,
  deleteApiConfAddGenFormFailure
} from "Actions/ApiConfAddGen";

const pairConfigurationListAPI = async () =>
  await api
    .get("pairConfigurationList.js")
    .then(response => response)
    .catch(error => error);

function* pairConfigurationListRequest({ payload }) {
  try {
    const response = [
      {
        recordID: "111",
        currency: "BTC",
        currencyID: "1001",
        apiType: "1",
        apiValue: "Liquidity",
        apiProviderID: "101",
        apiProvider: "Demo 1",
        status: "Active",
        callbackDetail: "demo callback1"
      },
      {
        recordID: "112",
        currency: "ETH",
        currencyID: "1002",
        apiType: "2",
        apiValue: "API",
        apiProviderID: "102",
        apiProvider: "Demo 2",
        status: "InActive",
        callbackDetail: "demo callback2"
      },
      {
        recordID: "113",
        currency: "XRP",
        currencyID: "1003",
        apiType: "3",
        apiValue: "Deamon",
        apiProviderID: "103",
        apiProvider: "Demo 3",
        status: "Active",
        callbackDetail: "demo callback3"
      },
      {
        recordID: "114",
        currency: "LTC",
        currencyID: "1004",
        apiType: "1",
        apiValue: "Liquidity",
        apiProviderID: "101",
        apiProvider: "Demo 4",
        status: "InActive",
        callbackDetail: "demo callback4"
      }
    ];
    if (response.length) yield put(getApiConfAddGenListSucess(response));
    else yield put(getApiConfAddGenListFailure("No data found"));
  } catch (error) {
    yield put(getApiConfAddGenListFailure(error));
  }
}

export function* getApiConfAddGenList() {
  yield takeEvery(GET_API_CONF_ADD_GEN_LIST, pairConfigurationListRequest);
}

function* getCurrency({ payload }) {
  try {
    const response = [
      { currency: "BTC", currencyID: "1001" },
      { currency: "ETH", currencyID: "1002" },
      { currency: "XRP", currencyID: "1003" },
      { currency: "LTC", currencyID: "1004" }
    ];

    if (response.length) yield put(getCurrencyListSuccess(response));
    else yield put(getCurrencyListFailure("No data found"));
  } catch (error) {
    yield put(getCurrencyListFailure(error));
  }
}

export function* getCurrencyList() {
  yield takeEvery(GET_CURRENCY, getCurrency);
}

function* apiProvider({ payload }) {
  try {
    const response = [
      { apiProvider: "Demo Provider 1", apiProviderID: "101" },
      { apiProvider: "Demo Provider 2", apiProviderID: "102" },
      { apiProvider: "Demo Provider 3", apiProviderID: "103" }
    ];

    if (response.length) yield put(getApiProviderListSuccess(response));
    else yield put(getApiProviderListFailure("No data found"));
  } catch (error) {
    yield put(getApiProviderListFailure(error));
  }
}

export function* getApiProviderList() {
  yield takeEvery(GET_API_PROVIDER, apiProvider);
}

function* exchangeList({ payload }) {
  try {
    const response = [
      { exchangeID: 1001, exchangeName: "Paro" },
      { exchangeID: 1002, exchangeName: "Oho" },
      { exchangeID: 1003, exchangeName: "UNIQ" }
    ];

    if (response.length) yield put(getCallbcakListSuccess(response));
    else yield put(getCallbcakListFailure("No data found"));
  } catch (error) {
    yield put(getCallbcakListFailure(error));
  }
}

export function* getCallbcakList() {
  yield takeEvery(GET_CALLBACK_LIST, exchangeList);
}

function* submitApiConfAddGen({ payload }) {
  try {
    const response = { status: 1, message: "Successfully Added" };
    if (response.status === 1)
      yield put(submitApiConfAddGenFormSuccess(response));
    else yield put(submitApiConfAddGenFormFailure(response));
  } catch (error) {
    const response = { status: 0, error: error };
    yield put(submitApiConfAddGenFormFailure(response));
  }
}

export function* submitApiConfAddGenForm() {
  yield takeEvery(ADD_API_CONF_ADD_GEN, submitApiConfAddGen);
}

function* editApiConfAddGen({ payload }) {
  try {
    const response = { status: 1, message: "Successfully Updated" };
    if (response.status === 1)
      yield put(editApiConfAddGenFormSuccess(response));
    else yield put(editApiConfAddGenFormFailure(response));
  } catch (error) {
    const response = { status: 0, error: error };
    yield put(editApiConfAddGenFormFailure(response));
  }
}

export function* editApiConfAddGenForm() {
  yield takeEvery(EDIT_API_CONF_ADD_GEN, editApiConfAddGen);
}

function* deleteApiConfAddGen({ payload }) {
  try {
    const response = { status: 1, message: "Successfully Deleted" };
    if (response.status === 1)
      yield put(deleteApiConfAddGenFormSuccess(response));
    else yield put(deleteApiConfAddGenFormFailure(response));
  } catch (error) {
    const response = { status: 0, error: error };
    yield put(deleteApiConfAddGenFormFailure(response));
  }
}

export function* deleteApiConfAddGenForm() {
  yield takeEvery(DELETE_API_CONF_ADD_GEN, deleteApiConfAddGen);
}

export default function* rootSaga() {
  yield all([
    fork(getApiConfAddGenList),
    fork(getCurrencyList),
    fork(getApiProviderList),
    fork(getCallbcakList),
    fork(submitApiConfAddGenForm),
    fork(editApiConfAddGenForm),
    fork(deleteApiConfAddGenForm)
  ]);
}
