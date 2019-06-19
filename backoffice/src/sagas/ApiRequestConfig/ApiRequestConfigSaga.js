// sagas For Api Request LIst  By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  ADD_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST,
  GET_APP_TYPE_LIST,
} from "Actions/types";

// action sfor set data or Request
import {
  addThirdPartyApiRequestListSuccess,
  addThirdPartyApiRequestListFailure,
  updateThirdPartyApiRequestListSuccess,
  updateThirdPartyApiRequestListFailure,
  getAppTypeListSuccess,
  getAppTypeListFailure,
} from "Actions/ApiRequestConfig";

// Sagas Function for Add Api Request List by :Tejas
function* addThirdPartyApiRequestList() {
  yield takeEvery(ADD_API_REQUEST_LIST, addThirdPartyApiRequestListDetail);
}

// Function for set Request to data and Call Function for Api Call
function* addThirdPartyApiRequestListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
     //code change by jayshreeba gohil (17-6-2019) for handle arbitrage Coinconfiguration detail
     if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddThirdPartyAPIConfigArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddThirdPartyAPIConfig';
    }
    const response = yield call(swaggerPostAPI, url, Data, headers); 
   // const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddThirdPartyAPIConfig', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addThirdPartyApiRequestListSuccess(response));
    } else {
      yield put(addThirdPartyApiRequestListFailure(response));
    }
  } catch (error) {
    yield put(addThirdPartyApiRequestListFailure(error));
  }
}

// Sagas Function for Update Api Request List by :Tejas
function* updateThirdPartyApiRequestList() {
  yield takeEvery(UPDATE_API_REQUEST_LIST, updateThirdPartyApiRequestListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateThirdPartyApiRequestListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
     //code change by jayshreeba gohil (17-6-2019) for handle arbitrage Coinconfiguration detail
     if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/UpdateThirdPartyAPIConfigArbitrage';
    } else {
      url = 'api/TransactionConfiguration/UpdateThirdPartyAPIConfig';
    }
    const response = yield call(swaggerPostAPI, url, Data, headers); 
    
    //const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateThirdPartyAPIConfig', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateThirdPartyApiRequestListSuccess(response));
    } else {
      yield put(updateThirdPartyApiRequestListFailure(response));
    }
  } catch (error) {
    yield put(updateThirdPartyApiRequestListFailure(error));
  }
}

// Sagas Function for Update Api response List by :Tejas
function* getAppTypeList() {
  yield takeEvery(GET_APP_TYPE_LIST, getAppTypeListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getAppTypeListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAppType', {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getAppTypeListSuccess(response));
    } else {
      yield put(getAppTypeListFailure(response));
    }
  } catch (error) {
    yield put(getAppTypeListFailure(error));
  }
}


// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(addThirdPartyApiRequestList),
    fork(updateThirdPartyApiRequestList),
    fork(getAppTypeList),
  ]);
}
