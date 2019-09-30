// MarginManageMarketSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';

import {
    GET_MARGIN_MANAGE_MARKET_LIST,
    ADD_MARGIN_MANAGE_MARKET_LIST,
    UPDATE_MARGIN_MANAGE_MARKET_LIST,
    GET_MARGIN_CURRENCY_LIST
} from '../../actions/ActionTypes';

import {
    GetMarginMarketListSuccess,
    GetMarginMarketListFailure,
    AddMarginManageMarketDataSuccess,
    AddMarginManageMarketDataFailure,
    EditMarginManageMarketDataSuccess,
    EditMarginManageMarketDataFailure,
    GetMarginCurrecnyListSuccess,
    GetMarginCurrecnyListFailure
} from '../../actions/Margin/MarginManageMarketAction';

import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from '../../selector';

// Generator for Margin Market List
function* MarginMarketListFatchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        // To call Get Margin Market List Data Api
        const data = yield call(swaggerGetAPI, Method.GetBaseMarket + '?IsMargin=1', {}, headers);

        // To set Get Margin Market List success response to reducer
        yield put(GetMarginMarketListSuccess(data))
    } catch (e) {
        // To set Get Margin Market List failure response to reducer
        yield put(GetMarginMarketListFailure())
    }
}

// Generator for Margin Currency List
function* MarginCurrecnyListFatchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        // To call Get Margin Currency List Data Api
        const data = yield call(swaggerPostAPI, Method.ListCurrency + '?ActiveOnly=0&IsMargin=1', {}, headers);

        // To set Get Margin Currency List success response to reducer
        yield put(GetMarginCurrecnyListSuccess(data))
    } catch (e) {
        // To set Get Margin Currency List failure response to reducer
        yield put(GetMarginCurrecnyListFailure())
    }
}

// Generator for Add Margin Market List
function* AddMarginMarketList(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        // To call Add Margin Market Data Api
        const data = yield call(swaggerPostAPI, Method.AddMarketData, payload.data, headers);

        // To set Add Margin Market success response to reducer
        yield put(AddMarginManageMarketDataSuccess(data))
    } catch (e) {
        // To set Add Margin Market failure response to reducer
        yield put(AddMarginManageMarketDataFailure())
    }
}

// Generator for Update Margin Market List
function* EditMarginMarketList(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken)
        var headers = { 'Authorization': token }

        // To call Update Margin Market Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateMarketData, payload.data, headers);

        // To set Update Margin Market success response to reducer
        yield put(EditMarginManageMarketDataSuccess(data))
    } catch (e) {
        // To set Update Margin Market failure response to reducer
        yield put(EditMarginManageMarketDataFailure())
    }
}

function* MarginManageMarketSaga() {
    // for get marketlist
    yield takeLatest(GET_MARGIN_MANAGE_MARKET_LIST, MarginMarketListFatchData)
    // for currecny List
    yield takeLatest(GET_MARGIN_CURRENCY_LIST, MarginCurrecnyListFatchData)
    // for Add Record
    yield takeLatest(ADD_MARGIN_MANAGE_MARKET_LIST, AddMarginMarketList)
    // for Edit Record
    yield takeLatest(UPDATE_MARGIN_MANAGE_MARKET_LIST, EditMarginMarketList)
}
export default MarginManageMarketSaga;