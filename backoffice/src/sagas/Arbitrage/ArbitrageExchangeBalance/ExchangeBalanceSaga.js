/* 
    Developer : Vishva shah
    Date : 07-06-2019
    File Comment : Arbitrage Exchange balance saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    GET_EXCHANGEBALANCE_LIST,
} from 'Actions/types';
import {
    getExchangeBalanceListSuccess,
    getExchangeBalanceListFailure,
} from 'Actions/Arbitrage/ArbitrageExchangeBalance';
//get arbitrage exchange balance list from API
function* getExchangeBalanceListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/ArbitrageWalletControlPanel/ArbitrageProviderBalance' + '?';
    if (request.hasOwnProperty("SMSCode") && request.SMSCode != "") {
        URL += '&SMSCode=' + request.SMSCode;
    }
    if (request.hasOwnProperty("ServiceProviderId") && request.ServiceProviderId != "") {
        URL += '&SerProID=' + request.ServiceProviderId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getExchangeBalanceListSuccess(response));
            } else {
                yield put(getExchangeBalanceListFailure(response));
            }
        
    } catch (error) {
        yield put(getExchangeBalanceListFailure(error));
    }
}
/* get arbitrage Exchange balance list */
export function* getExchangeBalanceList() {
    yield takeEvery(GET_EXCHANGEBALANCE_LIST, getExchangeBalanceListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getExchangeBalanceList),
    ]);
}