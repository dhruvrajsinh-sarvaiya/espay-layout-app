/* 
    Developer : Parth Andhariya
    Date : 04-06-2019
    File Comment :  Withdrawal Approval Saga
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
    swaggerPostAPI
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    // list 
    GET_LIST_WITHDRAWAL_REQUEST,
    //Accept/Reject
    GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST,

} from "Actions/types";
import {
    getListWithdrawalRequestSuccess,
    getListWithdrawalRequestFailure,
    getAcceptRejectWithdrawalRequestSuccess,
    getAcceptRejectWithdrawalRequestFailure,
} from "Actions/WithdrawalApprovalAction";

//get Withdrawal Approval list from API
function* getListWithdrawalRequestApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListWithdrawalRequest?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("TrnNo") && request.TrnNo != "") {
        URL += '&TrnNo=' + request.TrnNo;
    }
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(getListWithdrawalRequestSuccess(response));
        } else {
            yield put(getListWithdrawalRequestFailure(response));
        }
    } catch (error) {
        yield put(getListWithdrawalRequestFailure(error));
    }
}
/* get Withdrawal Approval list */
export function* getListWithdrawalRequest() {
    yield takeEvery(GET_LIST_WITHDRAWAL_REQUEST, getListWithdrawalRequestApi);
}

//get Accept Reject Withdrawal from API
function* getAcceptRejectWithdrawalRequestApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/AcceptRejectWithdrawalRequest';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(getAcceptRejectWithdrawalRequestSuccess(response));
        } else {
            yield put(getAcceptRejectWithdrawalRequestFailure(response));
        }
    } catch (error) {
        yield put(getAcceptRejectWithdrawalRequestFailure(error));
    }
}
/* get Accept Reject Withdrawal  */
export function* getAcceptRejectWithdrawalRequest() {
    yield takeEvery(GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST, getAcceptRejectWithdrawalRequestApi);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getListWithdrawalRequest),
        fork(getAcceptRejectWithdrawalRequest),
    ]);
}
