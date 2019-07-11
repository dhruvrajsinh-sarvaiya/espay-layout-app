/**********
Name: Devang Parekh
Use : Saga for profit indicator
Date  : 5/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import {
    GET_ARBITRAGE_PROFITINDICATOR,
} from 'Actions/types';

// action sfor set data or response
import {
    getAribitrageProfitIndicatorSuccess,
    getAribitrageProfitIndicatorFailure,
} from 'Actions/Arbitrage';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

const profitIndicator = { "statusCode": 200, "ReturnCode": 0, "ErrorCode": 0, "response": { "BUY": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": 0 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": -0.3577 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": -0.5034 }] }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": 0.3577 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": 0 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": -0.1452 }] }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": 0.5034 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": 0.1452 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": 0 }] }], "SELL": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": 0 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": 0.3577 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": 0.5034 }] }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": -0.3577 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": 0 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": 0.1452 }] }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Providers": [{ "SerProID": 2000001, "ProviderName": "LocalTrading", "LTP": 0.7548, "Profit": -0.5034 }, { "SerProID": 2000002, "ProviderName": "Binance", "LTP": 0.7575, "Profit": -0.1452 }, { "SerProID": 2000003, "ProviderName": "Bittrex", "LTP": 0.7586, "Profit": 0 }] }] } };

// Function for Buyer Book
function* getAribitrageProfitIndicatorAPI({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Transaction/GetProfitIndicatorArbitrage/' + payload.PairName, headers);
  

    try {

        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(getAribitrageProfitIndicatorFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(getAribitrageProfitIndicatorSuccess(response));
        } else {
            yield put(getAribitrageProfitIndicatorFailure(response));
        }

    } catch (error) {
        yield put(getAribitrageProfitIndicatorFailure(error));
    }

}

// Sagas Function for get profit indicator data 
function* getAribitrageProfitIndicator() {
    yield takeEvery(GET_ARBITRAGE_PROFITINDICATOR, getAribitrageProfitIndicatorAPI)
}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getAribitrageProfitIndicator)
    ]);
}