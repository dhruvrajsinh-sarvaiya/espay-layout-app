/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : ERC223 saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    INCREASE_TOKENSUPPLY,
    DECREASE_TOKENSUPPLY,
    GET_TOKEN_TRANSFER,
    SET_TRANSFER_FEE
} from 'Actions/types';
import {
    increaseTokenSupplySuccess,
    increaseTokenSupplyFailure,
    decreaseTokenSupplySuccess,
    decreaseTokenSupplyFailure,
    getTokenTransferSuccess,
    getTokenTransferFailure,
    setTransferFeeSuccess,
    setTransferFeeFailure
} from 'Actions/ERC223';

//increase token supply from API
function* increaseTokenSupplyRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/IncreaseTokenSupply';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(increaseTokenSupplySuccess(response));
            } else {
                yield put(increaseTokenSupplyFailure(response));
            }
        
    } catch (error) {
        yield put(increaseTokenSupplyFailure(error));
    }
}
//decrease token supply from API
function* decreaseTokenSupplyRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/DecreaseTokenSupply';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(decreaseTokenSupplySuccess(response));
            } else {
                yield put(decreaseTokenSupplyFailure(response));
            }
        
    } catch (error) {
        yield put(decreaseTokenSupplyFailure(error));
    }
}
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
/*increase token supply */
export function* increaseTokenSupply() {
    yield takeEvery(INCREASE_TOKENSUPPLY, increaseTokenSupplyRequest);
}

/*decrease token supply */
export function* decreaseTokenSupply() {
    yield takeEvery(DECREASE_TOKENSUPPLY, decreaseTokenSupplyRequest);
}
/*token Transfer */
export function* tokenTransfer() {
    yield takeEvery(GET_TOKEN_TRANSFER, tokenTransferRequest);
}
/*set transfer fee */
export function* setTransferFee() {
    yield takeEvery(SET_TRANSFER_FEE, setTransferFeeRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(increaseTokenSupply),
        fork(decreaseTokenSupply),
        fork(tokenTransfer),
        fork(setTransferFee)
    ]);
}