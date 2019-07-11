/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Decrease token supply saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    DECREASE_TOKENSUPPLY,
    GET_DECREASE_TOKENSUPPLY_LIST
} from 'Actions/types';
import {
    decreaseTokenSupplySuccess,
    decreaseTokenSupplyFailure,
    decreaseTokenSupplyListSuccess,
    decreaseTokenSupplyListFailure
} from 'Actions/ERC223';

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

//decrease token supply List from API
function* decreaseTokenSupplyListRequest(payload) {
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
                yield put(decreaseTokenSupplyListSuccess(response));
            } else {
                yield put(decreaseTokenSupplyListFailure(response));
            }
        
    } catch (error) {
        yield put(decreaseTokenSupplyListFailure(error));
    }
}
/*decrease token supply */
export function* decreaseTokenSupply() {
    yield takeEvery(DECREASE_TOKENSUPPLY, decreaseTokenSupplyRequest);
}
/*decrease token supply List */
export function* decreaseTokenSupplyList() {
    yield takeEvery(GET_DECREASE_TOKENSUPPLY_LIST, decreaseTokenSupplyListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(decreaseTokenSupply),
        fork(decreaseTokenSupplyList),
    ]);
}