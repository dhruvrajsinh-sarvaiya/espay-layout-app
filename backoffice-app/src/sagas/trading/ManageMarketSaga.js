// ManageMarketSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';

import {
    GET_MANAGE_MARKET_LIST,
    ADD_MANAGE_MARKET_LIST,
    UPDATE_MANAGE_MARKET_LIST,
    GET_TRADING_CURRENCY_LIST
} from '../../actions/ActionTypes';

import {
    GetMarketListSuccess,
    GetMarketListFailure,
    AddManageMarketDataSuccess,
    AddManageMarketDataFailure,
    EditManageMarketDataSuccess,
    EditManageMarketDataFailure,
    GetTradingCurrecnyListSuccess,
    GetTradingCurrecnyListFailure
} from '../../actions/Trading/ManageMarketAction';

import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from '../../selector';

// Generator for fetching list of Market 
function* MarketListFatchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Base Market Data Api
        const data = yield call(swaggerGetAPI, Method.GetBaseMarket, {}, headers);

        // To set Get Market List success response to reducer
        yield put(GetMarketListSuccess(data))
    } catch (e) {
        // To set Get Market List failure response to reducer
        yield put(GetMarketListFailure())
    }
}

// Generator for fetching list of Currecny 
function* TradingCurrecnyListFatchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Trading Currency List Api
        const data = yield call(swaggerPostAPI, Method.ListCurrency + '?ActiveOnly=0', {}, headers);

        // To set Get Trading Currency List success response to reducer
        yield put(GetTradingCurrecnyListSuccess(data))
    } catch (e) {
        // To set Get Trading Currency List failure response to reducer
        yield put(GetTradingCurrecnyListFailure())
    }
}

// Generator for add New Market data
function* AddMarketList(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Market Data Api
        const data = yield call(swaggerPostAPI, Method.AddMarketData, payload.data, headers);

        // To set Add Market Data success response to reducer
        yield put(AddManageMarketDataSuccess(data))
    } catch (e) {
        // To set Add Market Data failure response to reducer
        yield put(AddManageMarketDataFailure())
    }
}

// Generator for edit Market data
function* EditMarketList(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Edit Market Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateMarketData, payload.data, headers);

        // To set Edit Market Data success response to reducer
        yield put(EditManageMarketDataSuccess(data))
    } catch (e) {
        // To set Edit Market Data failure response to reducer
        yield put(EditManageMarketDataFailure())
    }
}

function* ManageMarketSaga() {
    // for get marketlist
    yield takeLatest(GET_MANAGE_MARKET_LIST, MarketListFatchData)
    // for trading Currecny
    yield takeLatest(GET_TRADING_CURRENCY_LIST, TradingCurrecnyListFatchData)
    // for Add Record
    yield takeLatest(ADD_MANAGE_MARKET_LIST, AddMarketList)
    // for Edit Record
    yield takeLatest(UPDATE_MANAGE_MARKET_LIST, EditMarketList)
}
export default ManageMarketSaga;