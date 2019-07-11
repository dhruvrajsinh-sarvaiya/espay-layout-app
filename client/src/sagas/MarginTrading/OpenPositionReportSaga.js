/**
 *   Developer : Parth Andhariya
 *   Date : 22-04-2019
 *   Component: Open Position Report Saga 
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI } from 'Helpers/helpers';
import { GET_OPEN_POSITION_REPORT_LIST } from "Actions/types";
import {
    getOpenPositionReportListSuccess,
    getOpenPositionReportListFailure
} from "Actions/MarginTrading";
//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// api call for open Position report 
function* getOpenPositionReportListDetails({ payload }) {
    var request = payload;
    try {
        var url = "api/MarginWallet/GetOpenPosition";
        var headers = { 'Authorization': AppConfig.authorizationToken };
        if (request.hasOwnProperty("PairId") && request.PairId != "") {
            url += '?PairId=' + request.PairId;
        }
        const response = yield call(swaggerGetAPI, url, request, headers);
        if (response.ReturnCode === 0) {
            yield put(getOpenPositionReportListSuccess(response));
        } else {
            yield put(getOpenPositionReportListFailure(response));
        }
    } catch (error) {
        yield put(getOpenPositionReportListFailure(error));
    }
}
//get api for Open Position Report 
function* getOpenPositionReportList() {
    yield takeEvery(GET_OPEN_POSITION_REPORT_LIST, getOpenPositionReportListDetails);
}

export default function* rootSaga() {
    yield all([
        fork(getOpenPositionReportList),
    ]);
}
