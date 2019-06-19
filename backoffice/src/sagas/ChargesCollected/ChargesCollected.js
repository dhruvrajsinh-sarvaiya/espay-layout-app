/* 
    Developer : Nishant Vadgama
    Date : 07-02-2019
    File Comment : Charges collected report saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_CHARGECOLLECTED_REPORT } from "Actions/types";
// import functions from action
import {
    getChargeCollectedReportSuccess,
    getChargeCollectedReportFailure
} from "Actions/ChargesCollected";

function* getChargeCollectedReportRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/WalletControlPanel/TrnChargeLogReport/" + request.Page + "/" + request.PageSize + "?";
    if (request.hasOwnProperty("TrnNo") && request.TrnNo != "") {
        URL += "&TrnNo=" + request.TrnNo;
    }
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += "&WalleTypeId=" + request.WalletTypeId;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += "&Status=" + request.Status;
    }
    if (request.hasOwnProperty("TrnTypeID") && request.TrnTypeID != "") {
        URL += "&TrnTypeID=" + request.TrnTypeID;
    }
    if (request.hasOwnProperty("SlabType") && request.SlabType != "") {
        URL += "&SlabType=" + request.SlabType;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += "&ToDate=" + request.ToDate;
    }
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += "&FromDate=" + request.FromDate;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getChargeCollectedReportSuccess(response));
        } else {
            yield put(getChargeCollectedReportFailure(response));
        }
    } catch (error) {
        yield put(getChargeCollectedReportFailure(error));
    }
}
function* getChargeCollectedReport() {
    yield takeEvery(GET_CHARGECOLLECTED_REPORT, getChargeCollectedReportRequest);
}
export default function* rootSaga() {
    yield all([fork(getChargeCollectedReport)]);
}
