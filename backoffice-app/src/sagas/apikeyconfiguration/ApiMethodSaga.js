import { put, call, takeEvery, select, all, fork } from 'redux-saga/effects';

import {
    LIST_API_METHOD,
    ADD_API_METHOD,
    UPDATE_API_METHOD,
    LIST_SYSTEM_REST_METHOD,
    LIST_SOCKET_METHOD
} from '../../actions/ActionTypes';

// import functions from action
import {
    getApiMethodDataSuccess,
    getApiMethodDataFailure,
    addApiMethodSuccess,
    addApiMethodFailure,
    updateApiMethodSuccess,
    updateApiMethodFailure,
    getSystemResetMethodDataSuccess,
    getSystemResetMethodDataFailure,
    getSocketMethodDataSuccess,
    getSocketMethodDataFailure
} from '../../actions/ApiKeyConfiguration/ApiMethodAction';

import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';

//Display List Of API Method 
function* getApiMethodListAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call List Of API Method
        const response = yield call(swaggerGetAPI, Method.GetAPIMethods, {}, headers)

        // To set List Of API Method success response to reducer
        yield put(getApiMethodDataSuccess(response))
    } catch (error) {
        // To set List Of API Method Only failure response to reducer
        yield put(getApiMethodDataFailure(error))
    }
}

//Add Api Method Data
function* addApiMethodAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add api method api
        const data = yield call(swaggerPostAPI, Method.AddAPIMethod, payload, headers)

        // To set add api method success response to reducer
        yield put(addApiMethodSuccess(data))
    } catch (error) {
        // To set add api plan configuration failue respose to reducer 
        yield put(addApiMethodFailure(error))
    }
}

//Update Api Method
function* updateApiMetodAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call update api method api
        const data = yield call(swaggerPostAPI, Method.UpdateAPIMethod, payload, headers)

        // To set update api method success response to reducer
        yield put(updateApiMethodSuccess(data))
    } catch (error) {
        // To set update api plan configuration failue respose to reducer 
        yield put(updateApiMethodFailure(error))
    }
}

//Get System Rest Method List
function* getSystemResetAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call get System rest method list
        const response = yield call(swaggerGetAPI, Method.GetSystemRestMethods, {}, headers)

        // To set system rest method list success response to reducer
        yield put(getSystemResetMethodDataSuccess(response))
    } catch (error) {
        // To set system rest method list failure response to reducer
        yield put(getSystemResetMethodDataFailure(error))
    }
}

//Get Socket Method List
function* getSocketMethodAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call get System socket method list
        const response = yield call(swaggerGetAPI, Method.GetSocketMethods, {}, headers)

        // To set List system socket list success response to reducer
        yield put(getSocketMethodDataSuccess(response))
    } catch (error) {
        // To set List Of system method list failure response to reducer
        yield put(getSocketMethodDataFailure(error))
    }
}

function* getApiMethodList() {
    // To register Api List Method
    yield takeEvery(LIST_API_METHOD, getApiMethodListAPI);
}

function* addApiMethod() {
    // To register Add Api Method
    yield takeEvery(ADD_API_METHOD, addApiMethodAPI);
}

function* updateApiMetod() {
    // To register Update Api Method
    yield takeEvery(UPDATE_API_METHOD, updateApiMetodAPI);
}

function* getSystemReset() {
    // To register System Rest Method 
    yield takeEvery(LIST_SYSTEM_REST_METHOD, getSystemResetAPI);
}

function* getSocketMethod() {
    // To register Socket Method
    yield takeEvery(LIST_SOCKET_METHOD, getSocketMethodAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getApiMethodList),
        fork(addApiMethod),
        fork(updateApiMetod),
        fork(getSystemReset),
        fork(getSocketMethod)
    ]);
}