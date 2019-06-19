// sagas For Site Token Actions By Tejas 8/2/2019

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { NotificationManager } from "react-notifications";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_SITE_TOKEN_LIST,
  ADD_SITE_TOKEN_LIST,
  UPDATE_SITE_TOKEN_LIST,
  GET_RATE_TYPE
} from "Actions/types";

// action sfor set data or response
import {
  getSiteTokenListSuccess,
  getSiteTokenListFailure,
  addSiteTokenSuccess,
  addSiteTokenFailure,
  updateSiteTokenSuccess,
  updateSiteTokenFailure,
  getRateTypeListSuccess,
  getRateTypeListFailure
} from "Actions/SiteToken";

// Sagas Function for get site token by :Tejas
function* getSiteTokenList() {
  yield takeEvery(GET_SITE_TOKEN_LIST, getSiteTokenListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenListDetail({ payload }) {

  const { Data } = payload;
  try {
    //added by parth andhariya
    var IsMargin = '';
    if (Data.hasOwnProperty("IsMargin") && Data.IsMargin != "") {
      IsMargin += "?IsMargin=" + Data.IsMargin;
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllSiteToken' + IsMargin, Data, headers);
    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getSiteTokenListSuccess(response));
    } else {
      yield put(getSiteTokenListFailure(response));
    }
  } catch (error) {
    yield put(getSiteTokenListFailure(error));
  }
}

// Sagas Function for Add site token by :Tejas
function* addSiteToken() {
  yield takeEvery(ADD_SITE_TOKEN_LIST, addSiteTokenDetail);
}

// Function for set response to data and Call Function for Api Call
function* addSiteTokenDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddSiteToken', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addSiteTokenSuccess(response));
    } else {
      yield put(addSiteTokenFailure(response));
    }
  } catch (error) {
    yield put(addSiteTokenFailure(error));
  }
}

// Sagas Function for Update site token by :Tejas
function* updateSiteToken() {
  yield takeEvery(UPDATE_SITE_TOKEN_LIST, updateSiteTokenDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateSiteTokenDetail({ payload }) {
  const { Data } = payload;
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateSiteToken', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateSiteTokenSuccess(response));
    } else {
      yield put(updateSiteTokenFailure(response));
    }
  } catch (error) {
    yield put(updateSiteTokenFailure(error));
  }
}

// Sagas Function for get Rate type by :Tejas
function* getRateTypeList() {
  yield takeEvery(GET_RATE_TYPE, getRateTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getRateTypeListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetSiteTokenRateType', Data, headers);
    //GetSiteTokenRateType

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getRateTypeListSuccess(response));
    } else {
      yield put(getRateTypeListFailure(response));
    }
  } catch (error) {
    yield put(getRateTypeListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getSiteTokenList),
    fork(addSiteToken),
    fork(updateSiteToken),
    fork(getRateTypeList),
  ]);
}
