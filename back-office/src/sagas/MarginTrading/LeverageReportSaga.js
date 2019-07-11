/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Report saga methods
    Date : 13-09-2019
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_LEVERAGE_REPORT } from "Actions/types";
import {
    getLeverageReportSuccess,
    getLeverageReportFailure
} from "Actions/MarginTrading/LeverageReport";

function* getLeverageReportRequest(payload) {
    const request = payload.payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWalletControlPanel/LeverageReport/' + request.FromDate + '/' + request.ToDate + '/' + request.PageNo + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("WalletType") && request.WalletType !== "") {
        URL += '&WalletTypeId=' + request.WalletType;
    }
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserID=' + request.UserId;
    }
    if (request.hasOwnProperty("Status") && request.Status !== "") {
        URL += '&Status=' + request.Status;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getLeverageReportSuccess(response));
        } else {
            yield put(getLeverageReportFailure(response));
        }
    } catch (error) {
        yield put(getLeverageReportFailure(error));
    }
}

function* getLeverageReport() {
    yield takeEvery(GET_LEVERAGE_REPORT, getLeverageReportRequest);
}

export default function* rootSaga() {
    yield all([
        fork(getLeverageReport)
    ]);
}
