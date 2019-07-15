// ApiPlanListSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { GET_API_PLAN_LIST_DATA, SUBSCRIBE_API_PLAN, GET_USER_ACTIVE_PLAN, MANUAL_RENEW_API_PLAN, SET_AUTO_RENEW_API_PLAN, GET_AUTO_RENEW_API_PLAN, STOP_AUTO_RENEW_API_PLAN, GET_CUSTOM_LIMITS, SET_CUSTOM_LIMITS, EDIT_CUSTOM_LIMITS, SET_DEFAULT_CUSTOM_LIMITS } from '../actions/ActionTypes';
import {
    getApiPlanListDataSuccess, getApiPlanListDataFailure,
    getSubscribePlanDetailsSuccess, getSubscribePlanDetailsFailure, getUserActivePlanSuccess, getUserActivePlanFailure, manualRenewApiPlanSuccess, manualRenewApiPlanFailure, setAutoRenewApiPlanSuccess, setAutoRenewApiPlanFailure, stopAutoRenewApiPlanSuccess, stopAutoRenewApiPlanFailure, getAutoRenewApiPlanSuccess, getAutoRenewApiPlanFailure, getCustomLimitsSuccess, getCustomLimitsFailure, setCustomLimitsSuccess, setCustomLimitsFailure, editCustomLimitsSuccess, editCustomLimitsFailure, setDefaultCustomLimitsSuccess, setDefaultCustomLimitsFailure
} from '../actions/ApiPlan/ApiPlanListAction';
import { swaggerGetAPI, swaggerPostAPI } from '../api/helper';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';

// Generator for Set Default Custom Limits Data
function* setDefaultCustomLimits(action) {
    try {
        let { data } = action

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Set Default Api Custom Limits api
        const response = yield call(swaggerGetAPI, Method.SetDefaultAPILimits + '/' + data.LimitID, {}, headers);

        // To set Set Default Custom Limits success response to reducer
        yield put(setDefaultCustomLimitsSuccess(response))
    } catch (e) {
        // To set Set Default Custom Limits failure response to reducer
        yield put(setDefaultCustomLimitsFailure())
    }
}

// Generator for Edit Custom Limits
function* editCustomLimits(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Update Custom Limits api
        const response = yield call(swaggerPostAPI, Method.UpdateUserAPICustomLimit, action.data, headers);

        // To set Edit Custom limits success response to reducer
        yield put(editCustomLimitsSuccess(response))
    } catch (e) {
        // To set Edit Custom limits failure response to reducer
        yield put(editCustomLimitsFailure())
    }
}

// Generator for Set Custom Limits
function* setCustomLimits(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Set Custom Limits api
        const response = yield call(swaggerPostAPI, Method.SetUserAPICustomLimit, action.data, headers);

        // To set Set Custom Limits success response to reducer
        yield put(setCustomLimitsSuccess(response))
    } catch (e) {
        // To set Set Custom Limits failure response to reducer
        yield put(setCustomLimitsFailure())
    }
}

// Generator for Custom Limits Data
function* getCustomLimits(action) {
    try {
        let { data } = action

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Get Api Custom Limits api
        const response = yield call(swaggerGetAPI, Method.GetUserAPICustomLimit + '/' + data.SubscribeId, {}, headers);

        // To set custom limits success response to reducer
        yield put(getCustomLimitsSuccess(response))
    } catch (e) {
        // To set custom limits failure response to reducer
        yield put(getCustomLimitsFailure())
    }
}

// Generator for Stop Auto Renew Api Plan
function* stopAutoRenewApiPlan(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Stop Auto Renew Api Plan api
        const response = yield call(swaggerPostAPI, Method.StopAutoRenewPlan, action.data, headers);

        // To set Stop Auto Renew Api Plan success response to reducer
        yield put(stopAutoRenewApiPlanSuccess(response))
    } catch (e) {
        // To set Stop Auto Renew Api Plan failure response to reducer
        yield put(stopAutoRenewApiPlanFailure())
    }
}

// Generator for Get Auto Renew Api Plan
function* getAutoRenewApiPlan(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Auto Renew Api Plan api
        const response = yield call(swaggerPostAPI, Method.GetAutoRenewPlanDetail, {}, headers);

        // To set Auto Renew Api Plan success response to reducer
        yield put(getAutoRenewApiPlanSuccess(response))
    } catch (e) {
        // To set Auto Renew Api Plan failure response to reducer
        yield put(getAutoRenewApiPlanFailure())
    }
}

// Generator for Set Auto Renew Api Plan
function* setAutoRenewApiPlan(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Auto Renew Api Plan api
        const response = yield call(swaggerPostAPI, Method.AutoRenewAPIPlan, action.data, headers);

        // To set Auto Renew Api Plan success response to reducer
        yield put(setAutoRenewApiPlanSuccess(response))
    } catch (e) {
        // To set Auto Renew Api Plan failure response to reducer
        yield put(setAutoRenewApiPlanFailure())
    }
}

// Generator for Manual Renew Api Plan
function* manualRenewApiPlan(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Manual Renew Api Plan api
        const response = yield call(swaggerPostAPI, Method.ManualRenewAPIPlan, action.data, headers);

        // To set Manual Renew Api Plan success response to reducer
        yield put(manualRenewApiPlanSuccess(response))
    } catch (e) {
        // To set Manual Renew Api Plan failure response to reducer
        yield put(manualRenewApiPlanFailure())
    }
}

// Generator for User Active Plan
function* getUserActivePlan() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };
        
        // To call User Active Api Plan api
        const response = yield call(swaggerPostAPI, Method.ViewUserActivePlan, {}, headers);
        //response = { "Response": null, "ReturnCode": 1, "ReturnMsg": "NoDataFound", "ErrorCode": 4501 }

        // To set User Active Api Plan success response to reducer
        yield put(getUserActivePlanSuccess(response))
    } catch (e) {
        // To set User Active Api Plan failure response to reducer
        yield put(getUserActivePlanFailure())
    }
}

// Generator for Api Plan List
function* apiPlanList() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Api Plan List api
        const response = yield call(swaggerGetAPI, Method.ViewAPIPlanDetail, {}, headers);

        // To set Api Plan List success response to reducer
        yield put(getApiPlanListDataSuccess(response))
    } catch (e) {
        // To set Api Plan List failure response to reducer
        yield put(getApiPlanListDataFailure())
    }
}

// Generator Subscribe Plan
function* subscribePlan(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID };

        // To call Subscribe Api Plan api
        const response = yield call(swaggerPostAPI, Method.SubscribeAPIPlan, action.data, headers);

        // To set Subscribe Api Plan success response to reducer
        yield put(getSubscribePlanDetailsSuccess(response))
    } catch (e) {
        // To set Subscribe Api Plan failure response to reducer
        yield put(getSubscribePlanDetailsFailure())
    }
}

function* ApiPlanListSaga() {
    // Api Plan List
    yield takeLatest(GET_API_PLAN_LIST_DATA, apiPlanList)
    // Subscribe PLan
    yield takeLatest(SUBSCRIBE_API_PLAN, subscribePlan)
    // User Active Plan
    yield takeLatest(GET_USER_ACTIVE_PLAN, getUserActivePlan)
    // Manual Renew Api Plan
    yield takeLatest(MANUAL_RENEW_API_PLAN, manualRenewApiPlan)
    // Set Auto Renew Api Plan
    yield takeLatest(SET_AUTO_RENEW_API_PLAN, setAutoRenewApiPlan)
    // Get Auto Renew Api Plan
    yield takeLatest(GET_AUTO_RENEW_API_PLAN, getAutoRenewApiPlan)
    // Stop Auto Renew Api Plan
    yield takeLatest(STOP_AUTO_RENEW_API_PLAN, stopAutoRenewApiPlan)
    // Custom Limits Data
    yield takeLatest(GET_CUSTOM_LIMITS, getCustomLimits)
    // Set Custom Limits
    yield takeLatest(SET_CUSTOM_LIMITS, setCustomLimits)
    // Edit Custom Limits
    yield takeLatest(EDIT_CUSTOM_LIMITS, editCustomLimits)
    // Set Default Custom Limit Data
    yield takeLatest(SET_DEFAULT_CUSTOM_LIMITS, setDefaultCustomLimits)
}

export default ApiPlanListSaga;

