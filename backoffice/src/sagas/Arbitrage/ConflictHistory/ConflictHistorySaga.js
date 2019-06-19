/* 
    Developer : Parth Andhariya
    Date : 11-06-2019
    File Comment : Conflict History Saga
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
    swaggerPostAPI
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    //List
    LIST_CONFLICT_HISTORY,
    // Recon
    CONFLICT_RECON_REQUEST,
} from "Actions/types";
import {
    ListConflictHistorySuccess,
    ListConflictHistoryFailure,
    ConflictReconRequestSuccess,
    ConflictReconRequestFailure,
} from "Actions/Arbitrage/ConflictHistory";

//get Conflict history list from API
function* ListConflictHistoryRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, '', {}, headers);
    var response = {
        Data: [
            {
                "CoinName": "BTC",
                "LocalBalance": 10.2500000,
                "ProviderBalance": 10.2500000,
                "Difference": 10.2500000,
                "RefNo": "10",
            },
            {
                "CoinName": "USDX",
                "LocalBalance": 10.2500000,
                "ProviderBalance": 10.2500000,
                "Difference": 10.2500000,
                "RefNo": "12",
            },
            {
                "CoinName": "SOX",
                "LocalBalance": 10.2500000,
                "ProviderBalance": 10.2500000,
                "Difference": 10.2500000,
                "RefNo": "20",
            }
        ],
        ReturnCode: 0
    }
    try {
        if (response.ReturnCode == 0) {
            yield put(ListConflictHistorySuccess(response));
        } else {
            yield put(ListConflictHistoryFailure(response));
        }
    } catch (error) {
        yield put(ListConflictHistoryFailure(error));
    }
}
/* get Conflict history list */
export function* ListConflictHistory() {
    yield takeEvery(LIST_CONFLICT_HISTORY, ListConflictHistoryRequest);
}
// call Conflict Recon from API
function* ConflictReconRequestAPI(payload) {
    var request = payload.request;
    console.log("payload", request)
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '', request, headers);
    var response = { ReturnCode: 0 };
    try {
        if (response.ReturnCode == 0) {
            yield put(ConflictReconRequestSuccess(response));
        } else {
            yield put(ConflictReconRequestFailure(response));
        }
    } catch (error) {
        yield put(ConflictReconRequestFailure(error));
    }
}
/* call Conflict Recon */
export function* ConflictReconRequest() {
    yield takeEvery(CONFLICT_RECON_REQUEST, ConflictReconRequestAPI);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ListConflictHistory),
        fork(ConflictReconRequest),
    ]);
}
