/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Increase token supply saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    INCREASE_TOKENSUPPLY,
    GET_INCREASE_TOKENSUPPLY_LIST,
} from 'Actions/types';
import {
    increaseTokenSupplySuccess,
    increaseTokenSupplyFailure,
    increaseTokenSupplyListSuccess,
    increaseTokenSupplyListFailure
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
//increase token supply from API
function* increaseTokenSupplyListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/IncreaseDecreaseTokenSupplyHistory' + '?';
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
                yield put(increaseTokenSupplyListSuccess(response));
            } else {
                yield put(increaseTokenSupplyListFailure(response));
            }
        
    } catch (error) {
        yield put(increaseTokenSupplyListFailure(error));
    }
}
/*increase token supply */
export function* increaseTokenSupply() {
    yield takeEvery(INCREASE_TOKENSUPPLY, increaseTokenSupplyRequest);
}
/*increase token supply List*/
export function* increaseTokenSupplyList() {
    yield takeEvery(GET_INCREASE_TOKENSUPPLY_LIST, increaseTokenSupplyListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(increaseTokenSupply),
        fork(increaseTokenSupplyList),
    ]);
}