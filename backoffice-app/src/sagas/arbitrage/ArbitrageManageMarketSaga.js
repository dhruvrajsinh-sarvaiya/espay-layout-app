// ArbitrageManageMarketSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    GET_ARBITRAGE_MANAGE_MARKET_LIST, UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS,
    GET_CURRENCY_LIST_ARBITRAGE, ADD_ARBITRAGE_MANAGE_MARKET
} from '../../actions/ActionTypes';
import {
    getArbiManageMarketListSuccess, getArbiManageMarketListFailure,
    updateArbiManageMarketListSuccess, updateArbiManageMarketListFailure,
    getListCurrencyArbitrageSuccess, getListCurrencyArbitrageFailure,
    addArbiManageMarketListSuccess, addArbiManageMarketListFailure
} from '../../actions/Arbitrage/ArbitrageManageMarketActions';

export default function* ArbitrageManageMarketSaga() {
    // To register Get Manage Market List method
    yield takeEvery(GET_ARBITRAGE_MANAGE_MARKET_LIST, getArbiManageMarketList)
    // To register Update Arbitrage Manage Market Status
    yield takeEvery(UPDATE_ARBITRAGE_MANAGE_MARKET_STATUS, updateManageMarketStatus)
    // To register Get Currency List Arbitrage
    yield takeEvery(GET_CURRENCY_LIST_ARBITRAGE, arbitrageCurrencyList)
    // To register Add Arbitrage Manage Market Status
    yield takeEvery(ADD_ARBITRAGE_MANAGE_MARKET, addManageMarketData)
}

// Generator for Get Manage Market
function* getArbiManageMarketList() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Manage Market Data Api
        const data = yield call(swaggerGetAPI, Method.GetBaseMarketArbitrage, {}, headers)

        // To set Get Manage Market success response to reducer
        yield put(getArbiManageMarketListSuccess(data))
    } catch (error) {
        // To set Get Manage Market failure response to reducer
        yield put(getArbiManageMarketListFailure())
    }
}

// Generator for Update Manage Market Status 
function* updateManageMarketStatus({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Manage Market Status Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateMarketDataArbitrage, payload, headers)

        // To set Update Manage Market Status success response to reducer
        yield put(updateArbiManageMarketListSuccess(data))
    } catch (error) {
        // To set Update Manage Market Status failure response to reducer
        yield put(updateArbiManageMarketListFailure())
    }
}

// Generator for List Currecny
function* arbitrageCurrencyList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call List Currecny Data Api
        const data = yield call(swaggerPostAPI, Method.ListCurrencyArbitrage + queryBuilder(payload), {}, headers)

        // To set List Currecny success response to reducer
        yield put(getListCurrencyArbitrageSuccess(data))
    } catch (error) {
        // To set List Currecny failure response to reducer
        yield put(getListCurrencyArbitrageFailure())
    }
}
// Generator for Add Manage Market Data
function* addManageMarketData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Manage Market Data Api
        const data = yield call(swaggerPostAPI, Method.AddMarketDataArbitrage, payload, headers)

        // To set Add Manage Market Data success response to reducer
        yield put(addArbiManageMarketListSuccess(data))
    } catch (error) {
        // To set Add Manage Market Data failure response to reducer
        yield put(addArbiManageMarketListFailure())
    }
}