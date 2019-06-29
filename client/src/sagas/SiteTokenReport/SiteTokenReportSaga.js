// sagas For Site Token Report Actions By Tejas 11/2/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
    GET_SITE_TOKEN_REPORT_LIST,  
} from "Actions/types";

// action sfor set data or response
import {
  getSiteTokenReportListSuccess,
  getSiteTokenReportListFailure,  
} from "Actions/SiteTokenReport";

// Sagas Function for get site token by :Tejas
function* getSiteTokenReportList() {
  yield takeEvery(GET_SITE_TOKEN_REPORT_LIST, getSiteTokenReportListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenReportListDetail({ payload }) {

  try {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/GetSiteTokenConversionData', {}, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getSiteTokenReportListSuccess(response));
    } else {
      yield put(getSiteTokenReportListFailure(response));
    }
  } catch (error) {
    yield put(getSiteTokenReportListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getSiteTokenReportList),    
  ]);
}
