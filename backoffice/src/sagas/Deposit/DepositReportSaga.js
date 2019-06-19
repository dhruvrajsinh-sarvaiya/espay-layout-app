/* 
    Developer : Nishant Vadgama
    Date : 18-03-2019
    File Comment : Deposit Report Saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_DEPOSIT_REPORT_DETAIL,
    DEPOSIT_RECON_PROCESS,
    WITHDRAWA2FAAUTH
} from "Actions/types";
import {
    getDepositReportSuccess,
    getDepositReportFailure,
    doReconProcessSuccess,
    doReconProcessFailure,
    verify2faSuccess,
    verify2faFailure,
} from "Actions/Deposit";

function* getDepositReportRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MasterConfiguration/DepositionReport/' + request.FromDate + '/' + request.ToDate + '/' + request.Page + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("WalletType") && request.WalletType !== "") {
        URL += '&CoinName=' + request.WalletType;
    }
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserID=' + request.UserId;
    }
    if (request.hasOwnProperty("Status") && request.Status !== "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("Address") && request.Address !== "") {
        URL += '&Address=' + request.Address;
    }
    if (request.hasOwnProperty("TrnID") && request.TrnID !== "") {
        URL += '&TrnID=' + request.TrnID;
    }
    if (request.hasOwnProperty("TrnNo") && request.TrnNo !== "") {
        URL += '&TrnNo=' + request.TrnNo;
    }
    if (request.hasOwnProperty("OrgId") && request.OrgId !== "") {
        URL += '&OrgId=' + request.OrgId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.BizResponseObj.ReturnCode === 0) {
            yield put(getDepositReportSuccess(response));
        } else {
            yield put(getDepositReportFailure(response));
        }
    } catch (error) {
        yield put(getDepositReportFailure(error));
    }
}
function* doReconProcessRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, "api/WalletControlPanel/DepositionReconProcess", request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(doReconProcessSuccess(response));
        } else {
            yield put(doReconProcessFailure(response));
        }
    } catch (error) {
        yield put(doReconProcessFailure(error));
    }
}
/* VERIFY 2FA AUTHENTICATION FOR WITHDRAWAL */
function* verify2faRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/Manage/TwoFAVerifyCode', payload.request, headers);
    try {
        if (responseFromSocket.ReturnCode == 0) // success
            yield put(verify2faSuccess(responseFromSocket));
        else //fail
            yield put(verify2faFailure(responseFromSocket));
    } catch (error) {
        // console.log(error);
        yield put(verify2faFailure(error));
    }
}
function* getDepositReport() {
    yield takeEvery(GET_DEPOSIT_REPORT_DETAIL, getDepositReportRequest);
}
function* doReconProcess() {
    yield takeEvery(DEPOSIT_RECON_PROCESS, doReconProcessRequest);
}
function* verify2fa() {
    yield takeEvery(WITHDRAWA2FAAUTH, verify2faRequest);
}
export default function* rootSaga() {
    yield all([
        fork(getDepositReport),
        fork(doReconProcess),
        fork(verify2fa),
    ]);
}
