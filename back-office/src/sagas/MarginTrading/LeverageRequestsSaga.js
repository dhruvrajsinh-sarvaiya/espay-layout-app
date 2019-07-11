/* 
    Developer : Nishant Vadgama
    Date : 12-02-2019
    File Comment : Ledger Requests saga methods
*/

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LEVERAGE_REQUEST_LIST,
    ACCEPTREJECT_LEVERAGEREQUEST
} from "Actions/types";
import {
    getLeverageRequestsSuccess,
    getLeverageRequestsFailure,
    acceptRejectLeverageRequestSuccess,
    acceptRejectLeverageRequestFailure
} from "Actions/MarginTrading/LeverageRequests";

//get leverage seerver request
function* getLeverageServerRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/MarginWalletControlPanel/LeveragePendingReport/" + request.Page + "/" + request.PageSize + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += "&FromDate=" + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += "&ToDate=" + request.ToDate;
    }
    if (request.hasOwnProperty("WalletTypeID") && request.WalletTypeID != "") {
        URL += "&WalletTypeID=" + request.WalletTypeID;
    }
    if (request.hasOwnProperty("UserID") && request.UserID != "") {
        URL += "&UserID=" + request.UserID;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getLeverageRequestsSuccess(response));
        } else {
            yield put(getLeverageRequestsFailure(response));
        }
    } catch (error) {
        yield put(getLeverageRequestsFailure(error));
    }
}

//get leverage seerver request
function* acceptRejectLeverageServerRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/MarginWalletControlPanel/MarginLeverageRequestAdminApproval/" + request.IsApproved + "/" + request.ReuestId + '?';
    if (request.hasOwnProperty("Remarks") && request.Remarks != "") {
        URL += "&Remarks=" + request.Remarks;
    }
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(acceptRejectLeverageRequestSuccess(response));
        } else {
            yield put(acceptRejectLeverageRequestFailure(response));
        }
    } catch (error) {
        yield put(acceptRejectLeverageRequestFailure(error));
    }
}

//get leverage requests
export function* getLeverageRequests() {
    yield takeEvery(LEVERAGE_REQUEST_LIST, getLeverageServerRequest);
}
//accept reject leverage request
export function* acceptRejectLeverageRequest() {
    yield takeEvery(ACCEPTREJECT_LEVERAGEREQUEST, acceptRejectLeverageServerRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getLeverageRequests),
        fork(acceptRejectLeverageRequest),
    ]);
}
