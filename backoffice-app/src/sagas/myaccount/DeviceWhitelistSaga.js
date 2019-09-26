
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import {
    LIST_DEVICE_WHITELIST,
    DELETE_DEVICE_WHITELIST,
    DISABLE_DEVICE_WHITELIST,
    ENABLE_DEVICE_WHITELIST
} from '../../actions/ActionTypes';
import {
    deviceWhiteListSuccess,
    deviceWhiteListFailure,
    deleteDeviceWhiteListSuccess,
    deleteDeviceWhiteListFailure,
    disableDeviceWhiteListSuccess,
    disableDeviceWhiteListFailure,
    enableDeviceWhiteListSuccess,
    enableDeviceWhiteListFailure
} from '../../actions/account/DeviceWhitelistAction';
import { Method } from '../../controllers/Constants';
import { swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from '../../selector';

//Function for Device White List API Added by Saloni Rathod 19/03/2019
function* getDeviceWhitelistApi({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        //url
        var swaggerUrl = Method.GetDeviceDataForAdmin + '?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.PAGE_SIZE;

        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            swaggerUrl += '&FromDate=' + payload.FromDate;
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            swaggerUrl += '&ToDate=' + payload.ToDate;
        }
        if (payload.hasOwnProperty("UserName") && payload.UserName !== "") {
            swaggerUrl += '&UserName=' + payload.UserName;
        }
        if (payload.hasOwnProperty("DeviceOS") && payload.DeviceOS !== "") {
            swaggerUrl += '&DeviceOS=' + payload.DeviceOS;
        }

        // To call device whitelist list api
        const response = yield call(swaggerPostAPI, swaggerUrl, {}, headers);

        // To set device whitelist list success response to reducer
        yield put(deviceWhiteListSuccess(response));
    } catch (error) {

        // To set device whitelist list failure response to reducer
        yield put(deviceWhiteListFailure(error));
    }
}

//Function for Delete Device Whitelist API
function* deleteDeviceWhitelistApi({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call device whitelist delete api
        const response = yield call(swaggerPostAPI, Method.DeleteDeviceId, payload, headers);

        // To set device whitelist delete success response to reducer
        yield put(deleteDeviceWhiteListSuccess(response));
    } catch (error) {

        // To set device whitelist delete failure response to reducer
        yield put(deleteDeviceWhiteListFailure(error));
    }
}

//Function for Disable Device Whitelist API
function* disableDeviceWhitelistApi({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call device whitelist disable api
        const response = yield call(swaggerPostAPI, Method.DisableDeviceId, payload, headers);

        // To set device whitelist disable success response to reducer
        yield put(disableDeviceWhiteListSuccess(response));
    } catch (error) {

        // To set device whitelist disable failure response to reducer
        yield put(disableDeviceWhiteListFailure(error));
    }
}

//Function for Enable Device Whitelist API
function* enableDeviceWhitelistApi({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call device whitelist enable api
        const response = yield call(swaggerPostAPI, Method.EnableDeviceId, payload, headers);

        // To set device whitelist enable success response to reducer
        yield put(enableDeviceWhiteListSuccess(response));
    } catch (error) {

        // To set device whitelist enable failure response to reducer
        yield put(enableDeviceWhiteListFailure(error));
    }
}

/**
 * Device WhiteList
 */
export function* getDeviceWhitelistSagas() {
    yield takeEvery(LIST_DEVICE_WHITELIST, getDeviceWhitelistApi);
}

/**
 * Delete Device WhiteList
 */
export function* deleteDeviceWhitelistSagas() {
    yield takeEvery(DELETE_DEVICE_WHITELIST, deleteDeviceWhitelistApi);
}

/**
 * Disable Device WhiteList
 */
export function* disableDeviceWhitelistSagas() {
    yield takeEvery(DISABLE_DEVICE_WHITELIST, disableDeviceWhitelistApi);
}

/**
 * Enable Device WhiteList
 */
export function* enableDeviceWhitelistSagas() {
    yield takeEvery(ENABLE_DEVICE_WHITELIST, enableDeviceWhitelistApi);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getDeviceWhitelistSagas),
        fork(deleteDeviceWhitelistSagas),
        fork(disableDeviceWhitelistSagas),
        fork(enableDeviceWhitelistSagas)
    ]);
}