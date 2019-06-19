/* 
    Developer : Vishva shah
    Date : 15-04-2019
    File Comment : Service Provider Balance saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';
import {
    GET_SERVICEPROVIDER_LIST,
} from 'Actions/types';
import {
    getServiceProviderBalanceListSuccess,
    getServiceProviderBalanceListFailure,
} from 'Actions/ServiceProviderBalance';

//get service provider balance list from API
function* getServiceProviderListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/GetServiceProviderBalance/' + request.ServiceProviderId  + '/' + request.CurrencyName + '?';
    if (request.hasOwnProperty("TransactionType") && request.TransactionType != "") {
        URL += '&TransactionType=' + request.TransactionType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getServiceProviderBalanceListSuccess(response));
            } else {
                yield put(getServiceProviderBalanceListFailure(response));
            }
        
    } catch (error) {
        yield put(getServiceProviderBalanceListFailure(error));
    }
}
/* get service provider list */
export function* getServiceProviderBalanceList() {
    yield takeEvery(GET_SERVICEPROVIDER_LIST, getServiceProviderListRequest);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getServiceProviderBalanceList),
    ]);
}