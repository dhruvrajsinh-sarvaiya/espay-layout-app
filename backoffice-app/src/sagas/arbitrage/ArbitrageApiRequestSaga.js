// ArbitrageApiRequestSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    getArbitrageApiRequestSuccess, getArbitrageApiRequestFailure,
    addArbitrageApiRequestSuccess, addArbitrageApiRequestFailure,
    updateArbitrageApiRequestSuccess, updateArbitrageApiRequestFailure,
} from '../../actions/Arbitrage/ArbitrageApiRequestActions';
import {
    GET_ARBITRAGE_API_REQUEST_LIST, ADD_ARBITRAGE_API_REQUEST_LIST, UPDATE_ARBITRAGE_API_REQUEST_LIST,
} from '../../actions/ActionTypes';

export default function* ArbitrageApiRequestSaga() {
    // To register Get Arbitrage Api Request List method
    yield takeEvery(GET_ARBITRAGE_API_REQUEST_LIST, getArbiApiRequestList)

    // To register Add Arbitrage Api Request List method
    yield takeEvery(ADD_ARBITRAGE_API_REQUEST_LIST, addArbiApiRequestList)

    // To register Update Arbitrage Api Request List method
    yield takeEvery(UPDATE_ARBITRAGE_API_REQUEST_LIST, updateArbiApiRequestList)
}

// Generator for Get Arbitrage Api Request
function* getArbiApiRequestList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let newRequest = Method.GetAllThirdPartyAPIArbitrage + queryBuilder(payload)

        // To call Get Arbitrage Api Request Data Api
        const data = yield call(swaggerPostAPI, newRequest, {}, headers)

        // To set Get Arbitrage Api Request success response to reducer
        yield put(getArbitrageApiRequestSuccess(data))
    } catch (error) {
        // To set Get Arbitrage Api Request failure response to reducer
        yield put(getArbitrageApiRequestFailure())
    }
}

// Generator for Add Arbitrage Api Request
function* addArbiApiRequestList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Arbitrage Api Request Data Api
        const data = yield call(swaggerPostAPI, Method.AddThirdPartyAPIConfigArbitrage, payload, headers)

        // To set Add Arbitrage Api Request success response to reducer
        yield put(addArbitrageApiRequestSuccess(data))
    } catch (error) {
        // To set Add Arbitrage Api Request failure response to reducer
        yield put(addArbitrageApiRequestFailure())
    }
}

// Generator for Update Arbitrage Api Request
function* updateArbiApiRequestList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Arbitrage Api Request Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateThirdPartyAPIConfigArbitrage, payload, headers)

        // To set Update Arbitrage Api Request success response to reducer
        yield put(updateArbitrageApiRequestSuccess(data))
    } catch (error) {
        // To set Update Arbitrage Api Request failure response to reducer
        yield put(updateArbitrageApiRequestFailure())
    }
}