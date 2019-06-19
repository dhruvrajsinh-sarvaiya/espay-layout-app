/* 
    Developer : Parth Andhariya
    Date : 10-06-2019
    File Comment : Topup History Saga
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
    swaggerPostAPI
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LIST_TOPUP_HISTORY,
    ADD_TOPUP_REQUEST,
} from "Actions/types";
import {
    ListTopupHistorySuccess,
    ListTopupHistoryFailure,
    AddTopupRequestSuccess,
    AddTopupRequestFailure,
} from "Actions/Arbitrage/ProviderTopupHistory";

//get Topup history list from API
function* ListTopupHistoryRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    try {
        var URL = 'api/ArbitrageWalletControlPanel/TopUpHistory/' + request.Page + '/' + request.PageSize + "?";
        if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
            URL += '&FromDate=' + request.FromDate;
        }
        if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
            URL += '&ToDate=' + request.ToDate;
        }
        if (request.hasOwnProperty("Status") && request.Status != "") {
            URL += '&Status=' + request.Status;
        }
        if (request.hasOwnProperty("Address") && request.Address != "") {
            URL += '&Address=' + request.Address;
        }
        if (request.hasOwnProperty("CoinName") && request.CoinName != "") {
            URL += '&CoinName=' + request.CoinName;
        }
        if (request.hasOwnProperty("FromServiceProviderId") && request.FromServiceProviderId != "") {
            URL += '&FromServiceProviderId=' + request.FromServiceProviderId;
        }
        if (request.hasOwnProperty("ToServiceProviderId") && request.ToServiceProviderId != "") {
            URL += '&ToServiceProviderId=' + request.ToServiceProviderId;
        }
        if (request.hasOwnProperty("TrnId") && request.TrnId != "") {
            URL += '&TrnId=' + request.TrnId;
        }
        const response = yield call(swaggerGetAPI, URL, {}, headers);
        if (response.ReturnCode == 0) {
            yield put(ListTopupHistorySuccess(response));
        } else {
            yield put(ListTopupHistoryFailure(response));
        }
    } catch (error) {
        yield put(ListTopupHistoryFailure(error));
    }
}
/* get Topup history list */
export function* ListTopupHistory() {
    yield takeEvery(LIST_TOPUP_HISTORY, ListTopupHistoryRequest);
}

//call Topup Request from API
function* AddTopupRequestApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/ArbitrageWalletControlPanel/AddDepositFund', request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(AddTopupRequestSuccess(response));
        } else {
            yield put(AddTopupRequestFailure(response));
        }
    } catch (error) {
        yield put(AddTopupRequestFailure(error));
    }
}
/* add Topup Request */
export function* AddTopupRequest() {
    yield takeEvery(ADD_TOPUP_REQUEST, AddTopupRequestApi);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ListTopupHistory),
        fork(AddTopupRequest),
    ]);
}
