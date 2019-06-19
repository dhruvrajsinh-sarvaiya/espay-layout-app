/* 
    Developer : Vishva shah
    Date : 17-06-2019
    File Comment :  Arbitrage provider wallet saga 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_ARBITRAGE_WALLET_LIST,
} from 'Actions/types';
import {
    getArbitrageWalletListSuccess,
    getArbitrageWalletListFailure,
} from 'Actions/Arbitrage/ArbitrageProviderWallet';
//get arbitrage wallet list
function* getProviderWalletListRequest(payload) {
    var request = payload.payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
     var URL = 'api/ArbitrageWalletControlPanel/ListProviderWallet?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId !== "") {
        URL += '&SMSCode=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("ServiceProviderId") && request.ServiceProviderId !== "") {
        URL += '&SerProId=' + request.ServiceProviderId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode === 0) {
                yield put(getArbitrageWalletListSuccess(response));
            } else {
                yield put(getArbitrageWalletListFailure(response));
            }
    } catch (error) {
        yield put(getArbitrageWalletListFailure(error));
    }
}
/* get arbitrage wallet list */
export function* getProviderWalletList() {
    yield takeEvery(GET_ARBITRAGE_WALLET_LIST, getProviderWalletListRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getProviderWalletList),
    ]);
}