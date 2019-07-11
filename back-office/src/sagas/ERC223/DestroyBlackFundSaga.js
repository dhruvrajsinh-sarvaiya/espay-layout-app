/* 
    Developer : Vishva shah
    Date : 03-06-2019
    File Comment : Destroy black fund saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    GET_DESTROYBLACKFUND_LIST
} from 'Actions/types';
import {
    destroyBlackFundListSuccess,
    destroyBlackFundListFailure
} from 'Actions/ERC223';

//destroy black fund List from API
function* destroyBlackFundListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/DestroyedBlackFundHistory' + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    if (request.hasOwnProperty("Address") && request.Address != "") {
        URL += '&Address=' + request.Address;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(destroyBlackFundListSuccess(response));
            } else {
                yield put(destroyBlackFundListFailure(response));
            }
        
    } catch (error) {
        yield put(destroyBlackFundListFailure(error));
    }
}
/*destroy black fund List */
export function* destroyBlackfundList() {
    yield takeEvery(GET_DESTROYBLACKFUND_LIST, destroyBlackFundListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(destroyBlackfundList),
    ]);
}