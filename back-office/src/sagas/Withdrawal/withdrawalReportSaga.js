import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_WITHDRAWAL_REPORT_DETAIL, DEPOSIT_WITHDRAWAL_RECON_PROCESS } from "Actions/types";
import { getWithdrawalReportSuccess, getWithdrawalReportFailure, doWithdeawalReconProcessSuccess, doWithdeawalReconProcessFailure } from "Actions/Withdrawal";

function* getWithdrawalReportRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MasterConfiguration/WithdrawalReport/' + request.FromDate + '/' + request.ToDate + '/' + request.Page + '/' + request.PageSize + '?';
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
            yield put(getWithdrawalReportSuccess(response));
        } else {
            yield put(getWithdrawalReportFailure(response));
        }
    } catch (error) {
        yield put(getWithdrawalReportFailure(error));
    }
}
function* getWithdrawalReport() {
    yield takeEvery(GET_WITHDRAWAL_REPORT_DETAIL, getWithdrawalReportRequest);
}
//added by parth andhariya
// WithdeawalReconProcess Api 
function* doWithdeawalReconProcessRequest({ payload }) {
    const request = payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, "api/TransactionBackOffice/WithdrawalRecon", request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(doWithdeawalReconProcessSuccess(response));
        } else {
            yield put(doWithdeawalReconProcessFailure(response));
        }
    } catch (error) {
        yield put(doWithdeawalReconProcessFailure(error));
    }
}
//WithdeawalRecon Api call
function* doWithdeawalReconProcess() {
    yield takeEvery(DEPOSIT_WITHDRAWAL_RECON_PROCESS, doWithdeawalReconProcessRequest);
}
export default function* rootSaga() {
    yield all([
        fork(getWithdrawalReport), fork(doWithdeawalReconProcess)
    ]);
}
