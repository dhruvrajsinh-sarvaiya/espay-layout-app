/**
 * Auther : Palak Gajjar
 * Created : 04.06.2019
  * Market Making Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    GET_MARKET_MAKING,
    UPDATE_MARKET_MAKING,
} from "Actions/types";

import {
    getMarketMakingSuccess,
    getMarketMakingFailure,
    updateMarketMakingSuccess,
    updateMarketMakingFailure
} from "Actions/Trading";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Market Making List API
function* getMarketMakingAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionBackOffice/TradingConfigurationList', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getMarketMakingSuccess(response));
        } else {
            yield put(getMarketMakingFailure(response));
        }
    } catch (error) {
        yield put(getMarketMakingFailure(error));
    }
}

//Function for Change Status of Market Making API
function* updateMarketMakingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/ChangeTradingConfigurationStatus', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateMarketMakingSuccess(response));
        } else {
            yield put(updateMarketMakingFailure(response));
        }
    } catch (error) {
        yield put(updateMarketMakingFailure(error));
    }
}

/* Create Sagas method for Market Making List */
export function* getMarketMakingAPISagas() {
    yield takeEvery(GET_MARKET_MAKING, getMarketMakingAPI);
}
/* Create Sagas method for Change Status of Market Making */
export function* updateMarketMakingSagas() {
    yield takeEvery(UPDATE_MARKET_MAKING, updateMarketMakingAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getMarketMakingAPISagas),
        fork(updateMarketMakingSagas),

    ]);
}