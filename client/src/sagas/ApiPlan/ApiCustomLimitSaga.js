// sagas For Custom Limits  Actions By Tejas 14/3/2019


// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
    GET_CUSTOM_LIMITS,
    SET_CUSTOM_LIMITS,
    UPDATE_CUSTOM_LIMITS,
    SET_DEFAULT_CUSTOM_LIMITS

} from "Actions/types";

// action sfor set data or response
import {
    getCustomLimitsSuccess,
    getCustomLimitsFailure,
    setCustomLimitsSuccess,
    setCustomLimitsFailure,
    updateCustomLimitsSuccess,
    updateCustomLimitsFailure,
    setDefaultCustomLimitsSuccess,
    setDefaultCustomLimitsFailure
} from "Actions/ApiPlan";

// Sagas Function for get Api Custom Limits  by :Tejas
function* getCustomLimits() {
    yield takeEvery(GET_CUSTOM_LIMITS, getCustomLimitsDetail);
}

// Function for set response to data and Call Function for Api Call
function* getCustomLimitsDetail({ payload }) {
    const { Data } = payload;
    try {

        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/APIConfiguration/GetUserAPICustomLimit/' + Data.SubscribeId, {}, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(getCustomLimitsSuccess(response));
        } else {
            yield put(getCustomLimitsFailure(response));
        }
    } catch (error) {
        yield put(getCustomLimitsFailure(error));
    }
}

// Sagas Function for Set Custom Limits  by :Tejas
function* setCustomLimits() {
    yield takeEvery(SET_CUSTOM_LIMITS, setCustomLimitsDetail);
}

// Function for set response to data and Call Function for Api Call
function* setCustomLimitsDetail({ payload }) {

    try {

        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/APIConfiguration/SetUserAPICustomLimit', payload.Data, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(setCustomLimitsSuccess(response));
        } else {
            yield put(setCustomLimitsFailure(response));
        }
    } catch (error) {
        yield put(setCustomLimitsFailure(error));
    }
}

// Sagas Function for Set Custom Limits  by :Tejas
function* updateCustomLimits() {
    yield takeEvery(UPDATE_CUSTOM_LIMITS, updateCustomLimitsDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateCustomLimitsDetail({ payload }) {

    try {

        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/APIConfiguration/UpdateUserAPICustomLimit', payload.Data, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(updateCustomLimitsSuccess(response));
        } else {
            yield put(updateCustomLimitsFailure(response));
        }
    } catch (error) {
        yield put(updateCustomLimitsFailure(error));
    }
}

// Sagas Function for Set Default Limit  by :Tejas
function* setDefaultCustomLimits() {
    yield takeEvery(SET_DEFAULT_CUSTOM_LIMITS, setDefaultCustomLimitsDetail);
}

// Function for set response to data and Call Function for Api Call
function* setDefaultCustomLimitsDetail({ payload }) {
    const { Data } = payload
    try {

        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/APIConfiguration/SetDefaultAPILimits/' + Data.LimitId, {}, headers);

        // set response if its available else set error message
        if (response && response != null && response.ReturnCode === 0) {
            yield put(setDefaultCustomLimitsSuccess(response));
        } else {
            yield put(setDefaultCustomLimitsFailure(response));
        }
    } catch (error) {
        yield put(setDefaultCustomLimitsFailure(error));
    }
}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getCustomLimits),
        fork(setCustomLimits),
        fork(updateCustomLimits),
        fork(setDefaultCustomLimits)
    ]);
}
