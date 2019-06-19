/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Set transfer fee saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    SET_TRANSFER_FEE,
    GET_SET_TRANSFER_FEE
} from 'Actions/types';
import {
    setTransferFeeSuccess,
    setTransferFeeFailure,
    setTransferFeeListSuccess,
    setTransferFeeListFailure
} from 'Actions/ERC223';
//set transfer fee
function* setTransferFeeRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/SetTransferFee';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(setTransferFeeSuccess(response));
            } else {
                yield put(setTransferFeeFailure(response));
            }
        
    } catch (error) {
        yield put(setTransferFeeFailure(error));
    }
}
//set transfer fee List
function* setTransferFeeListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/TransferFeeHistory' + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    if (request.hasOwnProperty("WalletType") && request.WalletType != "") {
        URL += '&WalletTypeId=' + request.WalletType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(setTransferFeeListSuccess(response));
            } else {
                yield put(setTransferFeeListFailure(response));
            }
        
    } catch (error) {
        yield put(setTransferFeeListFailure(error));
    }
}
/*set transfer fee */
export function* setTransferFee() {
    yield takeEvery(SET_TRANSFER_FEE, setTransferFeeRequest);
}
/*set transfer fee List */
export function* setTransferFeeList() {
    yield takeEvery(GET_SET_TRANSFER_FEE, setTransferFeeListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(setTransferFee),
        fork(setTransferFeeList)
    ]);
}