/**********
Name: Tejas Gauswami
Use : Saga for Exchange List  
Date  : 12/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import {
    ARBITRAGE_EXCHANGE_LIST
} from 'Actions/types';

// action sfor set data or response
import {
    arbitrageGetExchangeListSuccess,
    arbitrageGetExchangeListFailure
} from 'Actions/Arbitrage';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Exchange List   data 
function* arbitrageGetExchangeList() {
    yield takeEvery(ARBITRAGE_EXCHANGE_LIST, arbitrageGetExchangeListList)
}

// Function for get exchange list
function* arbitrageGetExchangeListList({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }

    const response = yield call(swaggerGetAPI, 'api/Transaction/ExchangeProviderListArbitrage/' + payload.Pair, {}, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
           var  staticRes = staticResponse(response.statusCode);
            yield put(arbitrageGetExchangeListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(arbitrageGetExchangeListSuccess(response));
        } else {
            yield put(arbitrageGetExchangeListFailure(response));
        }
    } catch (error) {
        yield put(arbitrageGetExchangeListFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(arbitrageGetExchangeList),
    ]);
}