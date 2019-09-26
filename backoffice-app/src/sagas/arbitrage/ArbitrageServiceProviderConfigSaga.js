import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    LIST_ARBITAGE_SERVICE_PROVIDER,
    ADD_ARBITAGE_SERVICE_PROVIDER,
    UPDATE_ARBITAGE_SERVICE_PROVIDER
} from "../../actions/ActionTypes";

// import functions from action
import {
    listArbitageServiceProviderSuccess,
    listArbitageServiceProviderFailure,
    addArbitageServiceProviderSuccess,
    addArbitageServiceProviderFailure,
    updateArbitageServiceProviderSuccess,
    updateArbitageServiceProviderFailure
} from "../../actions/Arbitrage/ArbitrageServiceProviderConfigurationAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI, queryBuilder } from "../../api/helper";
import { Method } from "../../controllers/Constants";

//Display List Of API Method 
function* listArbitageServiceProviderAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitage Service Provider list Api
        const response = yield call(swaggerPostAPI, Method.GetAllProviderConfigurationArbitrage + queryBuilder(payload), payload, headers);

        // To set Arbitage Service Provider list success response to reducer
        yield put(listArbitageServiceProviderSuccess(response));
    } catch (error) {
        // To set Arbitage Service Provider list failure response to reducer
        yield put(listArbitageServiceProviderFailure(error));
    }
}

//Add Api Method Data
function* addArbitageServiceProviderAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitage Service Provider add Api
        const response = yield call(swaggerPostAPI, Method.AddProviderConfigurationArbitrage, payload, headers);

        // To set Arbitage Service Provider add success response to reducer
        yield put(addArbitageServiceProviderSuccess(response));
    } catch (error) {
        // To set Arbitage Service Provider add failure response to reducer
        yield put(addArbitageServiceProviderFailure(error));
    }
}

//Update Api Method
function* updateArbitageServiceProviderAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitage Service Provider update Api
        const response = yield call(swaggerPostAPI, Method.UpdateProviderConfigurationArbitrage, payload, headers);

        // To set Arbitage Service Provider update success response to reducer
        yield put(updateArbitageServiceProviderSuccess(response));
    } catch (error) {
        // To set Arbitage Service Provider update failure response to reducer
        yield put(updateArbitageServiceProviderFailure(error));
    }
}

function* listArbitageServiceProvider() {
    // To register Arbitrage Service Provider method
    yield takeEvery(LIST_ARBITAGE_SERVICE_PROVIDER, listArbitageServiceProviderAPI);
}

function* addArbitageServiceProviderData() {
    // To register Add Arbitrage Service Provider method
    yield takeEvery(ADD_ARBITAGE_SERVICE_PROVIDER, addArbitageServiceProviderAPI);
}

function* updateArbitageServiceProviderData() {
    // To register Update Arbitrage Service Provider method
    yield takeEvery(UPDATE_ARBITAGE_SERVICE_PROVIDER, updateArbitageServiceProviderAPI);
}

//root saga middleware
export default function* rootSaga() {
    yield all([
        fork(listArbitageServiceProvider),
        fork(addArbitageServiceProviderData),
        fork(updateArbitageServiceProviderData)
    ]);
}