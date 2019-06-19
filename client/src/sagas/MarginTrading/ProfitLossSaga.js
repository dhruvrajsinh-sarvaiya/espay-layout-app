/* 
    Developer : Vishva shah
    Date : 18-04-2019
    File Comment : pofit loss report saga method
*/
import { all, call, fork,takeEvery, put} from 'redux-saga/effects';
import {swaggerGetAPI} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    PROFIT_LOSS_LIST,
} from 'Actions/types';
import {
    getProgitLossListSuccess,
    getProgitLossListFailure,
} from 'Actions/MarginTrading';

// server Request
function* getProfitLossListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWallet/GetProfitNLossReportData/' + request.PageNo + '?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&CurrencyName=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("PairID") && request.PairID != "") {
        URL += '&PairID=' + request.PairID;
    } 
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getProgitLossListSuccess(response));
        } else {
            yield put(getProgitLossListFailure(response));
        }
} catch (error) {
    yield put(getProgitLossListFailure(error));
}
} 

export function* getProfitLossReport() {
    yield takeEvery(PROFIT_LOSS_LIST, getProfitLossListRequest)
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getProfitLossReport),
    ]);
}
