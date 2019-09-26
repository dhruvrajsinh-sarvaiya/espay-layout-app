import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TRADE_ROUTES, ADD_TRADE_ROUTES_CONFIGURATION, UPDATE_TRADE_ROUTES_CONFIGURATION, GET_AVAILABLE_TRADE_ROUTES, GET_ORDER_TYPES } from '../../actions/ActionTypes';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { getTradeRoutesSuccess, getTradeRoutesFailure, addTradeRoutesConfigurationSuccess, addTradeRoutesConfigurationFailure, updateTradeRoutesConfigurationSuccess, updateTradeRoutesConfigurationFailure, getOrderTypesSuccess, getOrderTypesFailure, getAvailableTradeRoutesSuccess, getAvailableTradeRoutesFailure } from '../../actions/Trading/TradeRoutesActions';
import { userAccessToken } from '../../selector';

export default function* tradeRoutesBOSaga() {

    //For get trades routes
    yield takeEvery(GET_TRADE_ROUTES, getTradeRoutes);

    //For add trade routes configuration
    yield takeEvery(ADD_TRADE_ROUTES_CONFIGURATION, addTradeRoutesConfiguration);

    //For update trade routes configuraiton
    yield takeEvery(UPDATE_TRADE_ROUTES_CONFIGURATION, updateTradeRoutesConfiguration);

    //For get order types
    yield takeEvery(GET_ORDER_TYPES, getOrderTypes);

    //For get available trade routes
    yield takeEvery(GET_AVAILABLE_TRADE_ROUTES, getAvailableTradeRoutes);
}

function* getTradeRoutes() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all trade route list api
        const response = yield call(swaggerGetAPI, Method.GetAllTradeRouteConfiguration, {}, headers);

        // To set all trade route list success response to reducer
        yield put(getTradeRoutesSuccess(response))
    } catch (e) {

        // To set all trade route list failure response to reducer
        yield put(getTradeRoutesFailure())
    }
}

function* addTradeRoutesConfiguration({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add trade route api
        const response = yield call(swaggerPostAPI, Method.AddTradeRouteConfiguration, payload, headers);

        // To set add trade route success response to reducer
        yield put(addTradeRoutesConfigurationSuccess(response))
    } catch (e) {

        // To set add trade route failure response to reducer
        yield put(addTradeRoutesConfigurationFailure())
    }
}

function* updateTradeRoutesConfiguration({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update trade route api
        const response = yield call(swaggerPostAPI, Method.UpdateTradeRouteConfiguration, payload, headers);

        // To set update trade route success response to reducer
        yield put(updateTradeRoutesConfigurationSuccess(response))
    } catch (e) {

        // To set update trade route failure response to reducer
        yield put(updateTradeRoutesConfigurationFailure())
    }
}

function* getOrderTypes() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call order type api
        const response = yield call(swaggerGetAPI, Method.GetOrderType, {}, headers);

        // To set order type success response to reducer
        yield put(getOrderTypesSuccess(response))
    } catch (e) {

        // To set order type failure response to reducer
        yield put(getOrderTypesFailure())
    }
}

function* getAvailableTradeRoutes({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call available trade route api
        const response = yield call(swaggerPostAPI, Method.GetAvailableTradeRoute + '/' + payload.TrnType, {}, headers);

        // To set available trade route success response to reducer
        yield put(getAvailableTradeRoutesSuccess(response))
    } catch (e) {

        // To set available trade route failure response to reducer
        yield put(getAvailableTradeRoutesFailure())
    }
}