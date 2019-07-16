import { put, takeLatest, call, all, fork, select } from 'redux-saga/effects'
import {
  GET_SITE_TOKEN_CALCULATION,
  SITE_TOKEN_CONVERSION,
  GET_SITE_TOKEN_REPORT_LIST
} from '../actions/ActionTypes';
// action sfor set data or response
import {
  getSiteTokenCalculationSuccess,
  getSiteTokenCalculationFailure,
  doSiteTokenConversionSuccess,
  doSiteTokenConversionFailure,
  getSiteTokenReportListSuccess,
  getSiteTokenReportListFailure,
} from '../actions/SiteTokenConversion/SiteTokenConversionAction';
import { swaggerPostAPI } from '../api/helper';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';


// Function for set response to data and Call Function for Api Call
function* getSiteTokenCalculationDetail({ payload }) {
  try {
    const { Data } = payload;
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call Site Token Calculation api
    const response = yield call(swaggerPostAPI, Method.SiteTokenCalculation, Data, headers);

    // To set Site Token Calculation success response to reducer
    yield put(getSiteTokenCalculationSuccess(response));
  } catch (error) {
    // To set Site Token Calculation failure response to reducer
    yield put(getSiteTokenCalculationFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* doSiteTokenConversionDetail({ payload }) {
  try {
    const { Data } = payload;
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call Site Token Convestion api
    const response = yield call(swaggerPostAPI, Method.SiteTokenConversion, Data, headers);

     // To set Site Token Conversion success response to reducer
     yield put(doSiteTokenConversionSuccess(response));
    } catch (error) {
      // To set Site Token Conversion failure response to reducer
    yield put(doSiteTokenConversionFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenReportListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call Get Site Token Conversion api
    const response = yield call(swaggerPostAPI, Method.GetSiteTokenConversionData, {}, headers);

     // To set Site Token Report List success response to reducer
     yield put(getSiteTokenReportListSuccess(response));
    } catch (error) {
      // To set Site Token Report List failure response to reducer
    yield put(getSiteTokenReportListFailure(error));
  }
}

// Sagas Function for get site token Calculation 
function* getSiteTokenCalculation() {
  yield takeLatest(GET_SITE_TOKEN_CALCULATION, getSiteTokenCalculationDetail);
}

// Sagas Function for get site token Conversion 
function* doSiteTokenConversion() {
  yield takeLatest(SITE_TOKEN_CONVERSION, doSiteTokenConversionDetail);
}

// Sagas Function for get site token history
function* getSiteTokenReportList() {
  yield takeLatest(GET_SITE_TOKEN_REPORT_LIST, getSiteTokenReportListDetail);
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    // To register getSiteTokenCalculation method
    fork(getSiteTokenCalculation),
    // To register doSiteTokenConversion method
    fork(doSiteTokenConversion),
    // To register getSiteTokenReportList method
    fork(getSiteTokenReportList),
  ]);
}

