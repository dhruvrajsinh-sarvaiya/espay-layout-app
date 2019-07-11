/**
 *   Developer : Vishva shah
 *   Date : 27-04-2019
 *   Component: Profit Loss Report Saga 
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI } from 'Helpers/helpers';
import { GET_PROFITLOSS_LIST } from "Actions/types";
import {
    getProfitLossListSuccess,
    getProfitLossListFailure
} from "Actions/MarginTrading/ProfitLossReport";
//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// api call for Profit Loss report 
function* getProfitLossreportDetails( payload ) {
    var request = payload.payload;
    try {
        var url = 'api/MarginWalletControlPanel/GetProfitNLossReportData/' + request.PageNo + '?';
        var headers = { 'Authorization': AppConfig.authorizationToken };
        if (request.hasOwnProperty("PairId") && request.PairId != "") {
            url += '&PairId=' + request.PairId;
        }
        if (request.hasOwnProperty("UserID") && request.UserID != "") {
            url += '&UserID=' + request.UserID;
        }
        if (request.hasOwnProperty("WalletType") && request.WalletType != "") {
            url += '&CurrencyName=' + request.WalletType;
        }
        if (request.hasOwnProperty("PageSize") && request.PageSize != "") {
            url += '&PageSize=' + request.PageSize;
        }
        const response = yield call(swaggerGetAPI, url, request, headers);

        if (response.ReturnCode === 0) {
            yield put(getProfitLossListSuccess(response));
        } else {
            yield put(getProfitLossListFailure(response));
        }
    } catch (error) {
        yield put(getProfitLossListFailure(error));
    }
}
//get api for Profit Loss Report 
function* getProfitLossList() {
    yield takeEvery(GET_PROFITLOSS_LIST, getProfitLossreportDetails);
}

export default function* rootSaga() {
    yield all([
        fork(getProfitLossList),
    ]);
}
