/* 
    Developer : Vishva shah
    Date : 23-05-2019
    File Comment : Staking History Report saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    GET_STAKINGHISTORY_LIST,
} from 'Actions/types';
import {
    getStakingHistoryListSuccess,
    getStakingHistoryListFailure,
} from 'Actions/StakingHistoryReport';

//get Staking History list from API
function* getStakingHistoryListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/GetStackingHistory/' + request.PageSize  + '/' + request.Page + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    if (request.hasOwnProperty("Type") && request.Type != "") {
        URL += '&Type=' + request.Type;
    }
    if (request.hasOwnProperty("Slab") && request.Slab != "") {
        URL += '&Slab=' + request.Slab;
    }
    if (request.hasOwnProperty("UserId") && request.UserId != "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
        URL += '&StakingType=' + request.StakingType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getStakingHistoryListSuccess(response));
            } else {
                yield put(getStakingHistoryListFailure(response));
            }
        
    } catch (error) {
        yield put(getStakingHistoryListFailure(error));
    }
}
/* get Staking history list */
export function* getStakingHistoryList() {
    yield takeEvery(GET_STAKINGHISTORY_LIST, getStakingHistoryListRequest);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getStakingHistoryList),
    ]);
}