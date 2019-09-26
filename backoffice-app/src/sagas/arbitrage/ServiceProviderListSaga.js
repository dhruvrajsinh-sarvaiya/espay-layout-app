import { all, select, call, fork, put, takeEvery } from "redux-saga/effects";

import {
    ARBRITAGE_ADD_SERVICE_PROVIDER,
    ARBRITAGE_UPDATE_SERVICE_PROVIDER
} from '../../actions/ActionTypes';

// import functions from action
import {
    addArbitrageServiceProviderSuccess,
    addArbitrageServiceProviderFailure,
    updateArbitrageServiceProviderSuccess,
    updateArbitrageServiceProviderFailure
} from '../../actions/Arbitrage/ServiceProviderListAction';

import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

// Generator for Add Service Provider
function* addArbritageServiceProviderAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let url = Method.AddServiceProviderArbitrage;

        // To call Add Service Provider Data Api
        const data = yield call(swaggerPostAPI, url, payload, headers)

        // To set Add Service Provider success response to reducer
        yield put(addArbitrageServiceProviderSuccess(data));
    } catch (error) {
        // To set Add Service Provider failure response to reducer
        yield put(addArbitrageServiceProviderFailure(data));
    }
}

// Generator for Update Service Provider
function* updateArbritageServiceProviderAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let url = Method.UpdateServiceProviderArbitrage;

        // To call Update Service Provider Data Api
        const data = yield call(swaggerPostAPI, url, payload, headers)
        // To set Update Service Provider success response to reducer
        yield put(updateArbitrageServiceProviderSuccess(data));
    } catch (error) {
        // To set Update Service Provider failure response to reducer
        yield put(updateArbitrageServiceProviderFailure(data));
    }
}

function* addArbritageServiceProviderData() {
    // To register Add Service Provider method
    yield takeEvery(ARBRITAGE_ADD_SERVICE_PROVIDER, addArbritageServiceProviderAPI);
}

function* updateArbritageServiceProviderData() {
    // To register Update Service Provider method
    yield takeEvery(ARBRITAGE_UPDATE_SERVICE_PROVIDER, updateArbritageServiceProviderAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addArbritageServiceProviderData),
        fork(updateArbritageServiceProviderData)
    ]);
}