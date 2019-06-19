/* 
    Developer : Vishva shah
    Date : 13-06-2019
    File Comment : analytic saga
*/
import { all, call, fork, takeEvery, put } from 'redux-saga/effects';
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
  GET_ANALYTICSGRAPH_RECORD,
} from 'Actions/types';
import {
  getAnalyticGraphRecordSuccess,
  getAnalyticGraphRecordFailure,
} from 'Actions/Arbitrage';

// server Request
function* getAnalyticRequestAPI(payload) {
  const request = payload.request;
  // console.log("request",request)
  var headers = { 'Authorization': AppConfig.authorizationToken }
  var URL = 'api/ArbitrageWallet/AnalyticsGraphAPI/' + request.CurrencyName;
  const response = yield call(swaggerGetAPI, URL, request, headers);
  try {
    if (response.ReturnCode == 0) {
      yield put(getAnalyticGraphRecordSuccess(response));
    } else {
      yield put(getAnalyticGraphRecordFailure(response));
    }
  } catch (error) {
    yield put(getAnalyticGraphRecordFailure(error));
  }
}

export function* getAnalyticRecord() {
  yield takeEvery(GET_ANALYTICSGRAPH_RECORD, getAnalyticRequestAPI)
}
// rootsaga method binding...
export default function* rootSaga() {
  yield all([
    fork(getAnalyticRecord),
  ]);
}
