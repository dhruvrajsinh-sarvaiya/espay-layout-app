// sagas For Api Response Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  ADD_API_RESPONSE_LIST,
  GET_API_RESPONSE_LIST,
  UPDATE_API_RESPONSE_LIST,
} from "Actions/types";

// action sfor set data or response
import {
  addThirdPartyApiResponseListSuccess,
  addThirdPartyApiResponseListFailure,
  updateThirdPartyApiResponseListSuccess,
  updateThirdPartyApiResponseListFailure,
  getThirdPartyApiResponseSuccess,
  getThirdPartyApiResponseFailure
} from "Actions/ApiResponseConfig";

// Sagas Function for Add Api Response List by :Tejas
function* getThirdPartyApiResponse() {
  yield takeEvery(GET_API_RESPONSE_LIST, getThirdPartyApiResponseDetail);
}

// Function for set response to data and Call Function for Api Call
function* getThirdPartyApiResponseDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
    //code change by jayshreeba gohil (17-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/GetAllThirdPartyAPIResposeArbitrage';
    } else {
      url = 'api/TransactionConfiguration/GetAllThirdPartyAPIRespose';
    }
    const response = yield call(swaggerGetAPI, url, Data, headers); 
   // const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllThirdPartyAPIRespose', {},headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getThirdPartyApiResponseSuccess(response));
    } else {
      yield put(getThirdPartyApiResponseFailure(response));
    }
  } catch (error) {
    yield put(getThirdPartyApiResponseFailure(error));
  }
}

// Sagas Function for Add Api Response List by :Tejas
function* addThirdPartyApiResponseList() {
  yield takeEvery(ADD_API_RESPONSE_LIST, addThirdPartyApiResponseListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addThirdPartyApiResponseListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
     //code change by jayshreeba gohil (17-6-2019) for handle arbitrage Coinconfiguration detail
     if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/AddThirdPartyAPIResposeArbitrage';
    } else {
      url = 'api/TransactionConfiguration/AddThirdPartyAPIRespose';
    }
    const response = yield call(swaggerGetAPI, url, Data, headers); 
    //const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/AddThirdPartyAPIRespose', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addThirdPartyApiResponseListSuccess(response));
    } else {
      yield put(addThirdPartyApiResponseListFailure(response));
    }
  } catch (error) {
    yield put(addThirdPartyApiResponseListFailure(error));
  }
}


// Sagas Function for Update Api Response List by :Tejas
function* updateThirdPartyApiResponseList() {
  yield takeEvery(UPDATE_API_RESPONSE_LIST, updateThirdPartyApiResponseListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateThirdPartyApiResponseListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken },url="";
    //code change by jayshreeba gohil (17-6-2019) for handle arbitrage Coinconfiguration detail
    if(Data.IsArbitrage !== undefined && Data.IsArbitrage) {
      url = 'api/TransactionConfiguration/UpdateThirdPartyAPIResponseArbitrage';
    } else {
      url = 'api/TransactionConfiguration/UpdateThirdPartyAPIResponse';
    }
    const response = yield call(swaggerGetAPI, url, Data, headers); 
   // const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateThirdPartyAPIResponse', Data,headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateThirdPartyApiResponseListSuccess(response));
    } else {
      yield put(updateThirdPartyApiResponseListFailure(response));
    }
  } catch (error) {
    yield put(updateThirdPartyApiResponseListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(addThirdPartyApiResponseList),
    fork(updateThirdPartyApiResponseList),
    fork(getThirdPartyApiResponse)
  ]);
}
