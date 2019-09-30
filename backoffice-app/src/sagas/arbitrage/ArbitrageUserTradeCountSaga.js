import { all, select, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    GET_ARBITRAGE_USER_TRADE_COUNT,
    GET_USER_MARKET_COUNT
} from '../../actions/ActionTypes';

// import functions from action
import {
    getArbitrageUserTradeCountSuccess,
    getArbitrageUserTradeCountFailure,
    getUserMarketCountSuccess,
    getUserMarketCountFailure
} from '../../actions/Arbitrage/ArbitrageUserTradeAction';

import { userAccessToken } from '../../selector';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

// Generator for Get Arbitrage User Trade Count Detail
function* getArbitrageUserTradeCountDetail({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let url = Method.GetActiveTradeUserCountArbitrage + '/All';

        // To call Get Arbitrage User Count 
        const data = yield call(swaggerGetAPI, url, payload, headers)

        // To set Arbitrage User Count  success response to reducer
        yield put(getArbitrageUserTradeCountSuccess(data));
    } catch (error) {
        // To set Arbitrage User Count  failure response to reducer
        yield put(getArbitrageUserTradeCountFailure(data));
    }
}

// Generator for Get Arbitrage Market Type User Trade Count Detail
function* getUserMarketCountDetail({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let url = Method.GetTradeUserMarketTypeCountArbitrage + '/' + payload.Type + '/All';

        // To call Get Arbitrage User Count 
        const data = yield call(swaggerGetAPI, url, payload, headers)

        // To set Arbitrage Market Type User Count success response to reducer
        yield put(getUserMarketCountSuccess(data));
    } catch (error) {
        // To set Arbitrage Market Type User Count failure response to reducer
        yield put(getUserMarketCountFailure(data));
    }
}

function* getArbitrageUserTradeData() {
    // To register Get Arbitrage user Count  method
    yield takeEvery(GET_ARBITRAGE_USER_TRADE_COUNT, getArbitrageUserTradeCountDetail);
}

function* getUserMarketCount() {
    // To Register Get Market Count For Arbitrage User 
    yield takeEvery(GET_USER_MARKET_COUNT, getUserMarketCountDetail);
}

export default function* rootSaga() {
    yield all([
        fork(getArbitrageUserTradeData),
        fork(getUserMarketCount),
    ]);
}