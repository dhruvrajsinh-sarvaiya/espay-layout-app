/* 
    Developer : Salim Deraiya
    Date : 17-06-2019
    File Comment : Provider Balance Check saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import { GET_PROVIDER_BALANCE_CHECK_LIST } from 'Actions/types';
import {
    getProviderBalanceCheckListSuccess,
    getProviderBalanceCheckListFailure
} from 'Actions/MyAccount';

//get arbitrage exchange balance list from API
function* getProviderBalanceCheckListAPI({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/GetLPProviderBalance/'+payload.SMSCode;
    if (payload.hasOwnProperty("ServiceProviderId") && payload.ServiceProviderId !== "") {
        URL += '?SerProID=' + payload.ServiceProviderId;
    }

    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getProviderBalanceCheckListSuccess(response));
        } else {
            yield put(getProviderBalanceCheckListFailure(response));
        }

    } catch (error) {
        yield put(getProviderBalanceCheckListFailure(error));
    }
}

/* get Provider Balance Check list */
export function* getProviderBalanceCheckListSagas() {
    yield takeEvery(GET_PROVIDER_BALANCE_CHECK_LIST, getProviderBalanceCheckListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getProviderBalanceCheckListSagas)
    ]);
}