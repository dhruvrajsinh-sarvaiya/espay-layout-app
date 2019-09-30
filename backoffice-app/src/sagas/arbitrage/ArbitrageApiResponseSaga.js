// ArbitrageApiResponseSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    getArbitrageApiResponseSuccess, getArbitrageApiResponseFailure,
    addArbitrageApiResponseSuccess, addArbitrageApiResponseFailure,
    updateArbitrageApiResponseSuccess, updateArbitrageApiResponseFailure,
} from '../../actions/Arbitrage/ArbitrageApiResponseActions';
import { GET_ARBITRAGE_API_RESPONSE_LIST, ADD_ARBITRAGE_API_RESPONSE_LIST, UPDATE_ARBITRAGE_API_RESPONSE_LIST } from '../../actions/ActionTypes';

export default function* ArbitrageApiResponseSaga() {
    // To register Get Arbitrage Api Response List method
    yield takeEvery(GET_ARBITRAGE_API_RESPONSE_LIST, getArbiApiResponseList)
    // Add Arbitrage Api Response Method
    yield takeEvery(ADD_ARBITRAGE_API_RESPONSE_LIST, addArbiApiResponse)
    // Update Arbitrage Api Response Method
    yield takeEvery(UPDATE_ARBITRAGE_API_RESPONSE_LIST, updateArbiApiResponse)
}

// Generator for Get Arbitrage Api Response
function* getArbiApiResponseList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let newRequest = Method.GetAllThirdPartyAPIResposeArbitrage + queryBuilder(payload)

        // To call Get Arbitrage Api Response Data Api
        const data = yield call(swaggerPostAPI, newRequest, {}, headers)

        // To set Get Arbitrage Api Response success response to reducer
        yield put(getArbitrageApiResponseSuccess(data))
    } catch (error) {
        // To set Get Arbitrage Api Response failure response to reducer
        yield put(getArbitrageApiResponseFailure())
    }
}

// Generator for Add Arbitrage Api Response
function* addArbiApiResponse({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Arbitrage Api Response Data Api
        const data = yield call(swaggerPostAPI, Method.AddThirdPartyAPIResposeArbitrage, payload, headers)

        // To set Add Arbitrage Api Response success response to reducer
        yield put(addArbitrageApiResponseSuccess(data))
    } catch (error) {
        // To set Add Arbitrage Api Response failure response to reducer
        yield put(addArbitrageApiResponseFailure())
    }
}

// Generator for Update Arbitrage Api Response
function* updateArbiApiResponse({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Arbitrage Api Response Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateThirdPartyAPIResponseArbitrage, payload, headers)

        // To set Update Arbitrage Api Response success response to reducer
        yield put(updateArbitrageApiResponseSuccess(data))
    } catch (error) {
        // To set Update Arbitrage Api Response failure response to reducer
        yield put(updateArbitrageApiResponseFailure())
    }
}