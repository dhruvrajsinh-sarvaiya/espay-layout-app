import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getRestMethodReadOnlySuccess, getRestMethodReadOnlyFailure, getRestMethodFullAccessSuccess, getRestMethodFullAccessFailure, addApiPlanConfigSuccess, addApiPlanConfigFailure, updateApiPlanConfigSuccess, updateApiPlanConfigFailure } from '../../actions/ApiKeyConfiguration/ApiPlanConfigActions';
import { GET_REST_METHOD_READ_ONLY, GET_REST_METHOD_FULL_ACCESS, ADD_API_PLAN_CONFIG, UPDATE_API_PLAN_CONFIG } from '../../actions/ActionTypes';

export default function* ApiPlanConfigSaga() {
    // To register Rest Method Read Only method
    yield takeEvery(GET_REST_METHOD_READ_ONLY, getRestMethodReadOnly)
    // To register Rest Method Full Access method
    yield takeEvery(GET_REST_METHOD_FULL_ACCESS, getRestMethodFullAccess)
    // To register Add API Plan Config method
    yield takeEvery(ADD_API_PLAN_CONFIG, addApiPlanConfig)
    // To register Update API Plan Config method
    yield takeEvery(UPDATE_API_PLAN_CONFIG, updateApiPlanConfig)
}

// Generator for Rest Method Read Only
function* getRestMethodReadOnly({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Rest Method Read Only Data Api
        const data = yield call(swaggerGetAPI, Method.GetRestMethodsReadOnly, {}, headers)

        // To set Rest Method Read Only success response to reducer
        yield put(getRestMethodReadOnlySuccess(data))
    } catch (error) {
        // To set Rest Method Read Only failure response to reducer
        yield put(getRestMethodReadOnlyFailure())
    }
}

// Generator for Rest Method Full Access
function* getRestMethodFullAccess({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Rest Method Full Access Data Api
        const data = yield call(swaggerGetAPI, Method.GetRestMethodsFullAccess, {}, headers)

        // To set Rest Method Full Access success response to reducer
        yield put(getRestMethodFullAccessSuccess(data))
    } catch (error) {
        // To set Rest Method Full Access failure response to reducer
        yield put(getRestMethodFullAccessFailure())
    }
}

// Generator for Add Api Plan Config
function* addApiPlanConfig({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Api Plan Configuration Data Api
        const data = yield call(swaggerPostAPI, Method.AddAPIPlan, payload, headers)

        // To set Add Api Plan Configuration success response to reducer
        yield put(addApiPlanConfigSuccess(data))
    } catch (error) {
        // To set Add Api Plan Configuration failure response to reducer
        yield put(addApiPlanConfigFailure())
    }
}

// Generator for Add Api Plan Config
function* updateApiPlanConfig({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Api Plan Configuration Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateAPIPlan, payload, headers)

        // To set Add Api Plan Configuration success response to reducer
        yield put(updateApiPlanConfigSuccess(data))
    } catch (error) {
        // To set Add Api Plan Configuration failure response to reducer
        yield put(updateApiPlanConfigFailure())
    }
}