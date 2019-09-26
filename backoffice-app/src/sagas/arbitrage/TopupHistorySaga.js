import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { LIST_TOPUP_HISTORY, ADD_TOPUP_REQUEST } from "../../actions/ActionTypes";
import {
    ListTopupHistorySuccess,
    ListTopupHistoryFailure,
    AddTopupRequestSuccess,
    AddTopupRequestFailure,
} from "../../actions/Arbitrage/TopupHistoryActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

//get Topup history list from API
function* ListTopupHistoryRequest({ payload }) {

    try {
        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        var URL = Method.TopUpHistory + '/' + request.PageIndex + '/' + request.PageSize + "?";

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

        // To call top history list Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set top history list success response to reducer
        yield put(ListTopupHistorySuccess(response));
    } catch (error) {

        // To set top history list failure response to reducer
        yield put(ListTopupHistoryFailure(error));
    }
}

/* get Topup history list */
export function* ListTopupHistory() {
    // To register List Topup History
    yield takeEvery(LIST_TOPUP_HISTORY, ListTopupHistoryRequest);
}

//call Topup Request from API
function* AddTopupRequestApi({ payload }) {

    try {
        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add top history list Api
        const response = yield call(swaggerPostAPI, Method.AddDepositFund, request, headers);

        // To set add top history list success response to reducer
        yield put(AddTopupRequestSuccess(response));
    } catch (error) {

        // To set add top history list failure response to reducer
        yield put(AddTopupRequestFailure(error));
    }
}
/* add Topup Request */
export function* AddTopupRequest() {
    // To register Add Topup Request method
    yield takeEvery(ADD_TOPUP_REQUEST, AddTopupRequestApi);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ListTopupHistory),
        fork(AddTopupRequest),
    ]);
}
