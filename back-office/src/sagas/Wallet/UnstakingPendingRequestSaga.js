/*
Saga : Unstaking Pending Request 
Created By : Vishva shah
Date : 12/03/2019
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_LIST_PENDING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST
} from "Actions/types";
import {
    getListPendingRequestSuccess,
    getListPendingRequestFailure,
    AccepetRejectRequestSuccess,
    AccepetRejectRequestFailure
} from "Actions/UnstakingPendingRequest";

//unstaing request fro server
function* getUnstakingPendingRequestAPI(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/WalletControlPanel/ListUnStackingRequest" + '?';
    if (request.hasOwnProperty("Userid") && request.Userid != "") {
        URL += "&Userid=" + request.Userid;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += "&Status=" + request.Status;
    }
    if (request.hasOwnProperty("UnStakingType") && request.UnStakingType != "") {
        URL += "&UnStakingType=" + request.UnStakingType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getListPendingRequestSuccess(response));
        } else {
            yield put(getListPendingRequestFailure(response));
        }
    } catch (error) {
        yield put(getListPendingRequestFailure(error));
    }
}
function* AcceptRejectRequestApi(payload) {
    const request = payload.payload
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/AcceptRejectUnstakingRequest/' + request.AdminReqID + '/' + request.Bit, request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(AccepetRejectRequestSuccess(response));
        } else {
            yield put(AccepetRejectRequestFailure(response));
        }
    } catch (error) {
        yield put(AccepetRejectRequestFailure(error));
    }
}
// accept reject Request
export function* AcceptRejectRequest() {
    yield takeEvery(ACCEPTREJECT_UNSTAKING_REQUEST, AcceptRejectRequestApi);
}
//unstaking list
export function* getUnstakingList() {
    yield takeEvery(GET_LIST_PENDING_REQUEST, getUnstakingPendingRequestAPI);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getUnstakingList),
        fork(AcceptRejectRequest)
    ]);
}
