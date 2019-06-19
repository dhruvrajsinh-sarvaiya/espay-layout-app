// sagas For Site Token Conversion List Actions By Tejas 9/2/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  GET_SITE_TOKEN_CONVERSION_LIST,  
} from "Actions/types";

// action sfor set data or response
import {
  getSiteTokenConversionListSuccess,
  getSiteTokenConversionListFailure,  
} from "Actions/SiteToken";

// Sagas Function for get site token by :Tejas
function* getSiteTokenConversionList() {
  yield takeEvery(GET_SITE_TOKEN_CONVERSION_LIST, getSiteTokenConversionListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenConversionListDetail({ payload }) {

  const { Data } = payload;
  let queryParams = '';
  try {

    const createQueryParams = params =>
    Object.keys(params)
    .map(k => `${k}=${encodeURI(params[k])}`)
    .join('&');

  if(Data){
    queryParams = createQueryParams(Data);
  }
  var url = 'api/TransactionBackOffice/GetSiteTokenConversionDataBK/' + (queryParams !== "" ? '?'+queryParams : '')
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, url, Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getSiteTokenConversionListSuccess(response));
    } else {
      yield put(getSiteTokenConversionListFailure(response));
    }
  } catch (error) {
    yield put(getSiteTokenConversionListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getSiteTokenConversionList),    
  ]);
}
