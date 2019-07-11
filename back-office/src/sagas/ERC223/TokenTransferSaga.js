/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Token transfer saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_LIST
} from 'Actions/types';
import {
    getTokenTransferSuccess,
    getTokenTransferFailure,
    getTokenTransferlistSuccess,
    getTokenTransferlistFailure
} from 'Actions/ERC223';

//Token transfer
function* tokenTransferRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/TokenTransfer';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getTokenTransferSuccess(response));
            } else {
                yield put(getTokenTransferFailure(response));
            }
        
    } catch (error) {
        yield put(getTokenTransferFailure(error));
    }
}
//Token transfer list
function* tokenTransferListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/TokenTransferHistory' + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getTokenTransferlistSuccess(response));
            } else {
                yield put(getTokenTransferlistFailure(response));
            }
        
    } catch (error) {
        yield put(getTokenTransferlistFailure(error));
    }
}
/*token Transfer */
export function* tokenTransfer() {
    yield takeEvery(GET_TOKEN_TRANSFER, tokenTransferRequest);
}
/*token Transfer List */
export function* tokenTransferList() {
    yield takeEvery(GET_TOKEN_TRANSFER_LIST, tokenTransferListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(tokenTransfer),
        fork(tokenTransferList)
    ]);
}