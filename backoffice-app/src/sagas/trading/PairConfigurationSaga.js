import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
    GET_PAIR_CONFIGURATION_LIST,
    GET_MARKET_CURRENCY,
    GET_PAIR_CURRENCY,
    ADD_PAIR_CONFIGURATION,
    EDIT_PAIR_CONFIGURATION,
} from '../../actions/ActionTypes';
import { getPairConfigurationListSuccess, getPairConfigurationListFailure, getMarketCurrencyListSuccess, getMarketCurrencyListFailure, getPairCurrencyListSuccess, getPairCurrencyListFailure, addPairConfigurationFailure, addPairConfigurationSuccess, editPairConfigurationSuccess, editPairConfigurationFailure } from '../../actions/Trading/PairConfigurationActions';
import { Method } from '../../controllers/Methods';
import { swaggerPostAPI, swaggerGetAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';

//call api's
export default function* pairConfigurationSaga() {
    // To register Get Pair Configuration List method
    yield takeEvery(GET_PAIR_CONFIGURATION_LIST, getPairConfigurationList);
    // To register Get Market Currency List method
    yield takeEvery(GET_MARKET_CURRENCY, getMarketCurrencyList);
    // To register Get Pair Currency List method
    yield takeEvery(GET_PAIR_CURRENCY, getPairCurrencyList);
    // To register Add Pair Configuration List method
    yield takeEvery(ADD_PAIR_CONFIGURATION, addNewPair);
    // To register Edit Pair Configuration List method
    yield takeEvery(EDIT_PAIR_CONFIGURATION, editPair);
}

function* editPair({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update pair configuration api
        const data = yield call(swaggerPostAPI, Method.UpdatePairConfiguration, payload, headers)

        // To set update pair configuration success response to reducer
        yield put(editPairConfigurationSuccess(data));
    } catch (error) {

        // To set update pair configuration failure response to reducer
        yield put(editPairConfigurationFailure());
    }
}

function* addNewPair({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add pair configuration api
        const data = yield call(swaggerPostAPI, Method.AddPairConfiguration, payload, headers)

        // To set add pair configuration success response to reducer
        yield put(addPairConfigurationSuccess(data));
    } catch (error) {

        // To set add pair configuration failure response to reducer
        yield put(addPairConfigurationFailure());
    }
}

function* getPairCurrencyList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Add IsMargin params in request url if IsMargin payload is 1
        var IsMargin = '';
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
            IsMargin += "?IsMargin=" + payload.IsMargin;
        }

        // To call Get Pair Currency List Data Api
        const data = yield call(swaggerGetAPI, Method.GetAllServiceConfigurationByBase + '/' + payload.Base + IsMargin, {}, headers);

        // To set all service configuration success response to reducer
        yield put(getPairCurrencyListSuccess(data));
    } catch (error) {

        // To set all service configuration failure response to reducer
        yield put(getPairCurrencyListFailure());
    }
}

function* getMarketCurrencyList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Add IsMargin params in request url if IsMargin payload is 1
        var IsMargin = '';
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
            IsMargin += "?IsMargin=" + payload.IsMargin;
        }

        // To call base market api
        const data = yield call(swaggerGetAPI, Method.GetBaseMarket + IsMargin, {}, headers);

        // To set base market success response to reducer
        yield put(getMarketCurrencyListSuccess(data));
    } catch (error) {

        // To set base market failure response to reducer
        yield put(getMarketCurrencyListFailure());
    }
}

function* getPairConfigurationList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Add IsMargin params in request url if IsMargin payload is 1
        var IsMargin = '';
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
            IsMargin += "?IsMargin=" + payload.IsMargin;
        }

        // To call Get Pair Configuration List Data Api
        const data = yield call(swaggerGetAPI, Method.GetAllPairConfiguration + IsMargin, {}, headers);

        // To set all pair configuration success response to reducer
        yield put(getPairConfigurationListSuccess(data));
    } catch (error) {

        // To set all pair configuration failure response to reducer
        yield put(getPairConfigurationListFailure());
    }
}