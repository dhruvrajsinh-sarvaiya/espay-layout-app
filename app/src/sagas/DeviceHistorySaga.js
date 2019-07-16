import {
    put, call, takeLatest, select
} from 'redux-saga/effects';
import {
    DEVICEHISTORY_FETCH,
    ENABLE_DEVICE_WHITELIST,
    DISABLE_DEVICE_WHITELIST,
    DELETE_DEVICE_WHITELIST
} from '../actions/ActionTypes';
//Action methods..
import {
    deviceWhiteListSuccess, deviceWhiteListFailure,
    deleteDeviceWhiteListSuccess, deleteDeviceWhiteListFailure,
    enableDeviceWhiteListSuccess, enableDeviceWhiteListFailure,
    disableDeviceWhiteListSuccess, disableDeviceWhiteListFailure,
} from '../actions/CMS/deviceWhitelistAction';

import { swaggerGetAPI, swaggerPostAPI, slowInternetStaticResponse } from "../api/helper";
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';
import { getIPAddress } from '../controllers/CommonUtils';

//Function for Device White List API
function* getDeviceWhitelistApi({ payload }) {
    try {
        // for request Url
        var swaggerUrl = ''
        // FromDaye and ToDate is not undefine
        if (payload.FromDate !== undefined && payload.ToDate !== undefined) {
            swaggerUrl = Method.GetDeviceId + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE + '?FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;
        }
        else {
            swaggerUrl = Method.GetDeviceId + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE
        }

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Device White List api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set Device White List success response to reducer
        yield put(deviceWhiteListSuccess(response))
    } catch (error) {
        // To set Device White List failure response to reducer
        yield put(deviceWhiteListFailure());
    }
}

//Function for Delete Device Whitelist API
function* deleteDeviceWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(deleteDeviceWhiteListSuccess(slowInternetStaticResponse()));
        } else {

            // To get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Delete Device to Whitelist api
            const response = yield call(swaggerPostAPI, Method.DeleteDeviceId, payload, headers);

            // To set Delete Device White List success response to reducer
            yield put(deleteDeviceWhiteListSuccess(response))
        }
    } catch (error) {
        // To set Delete Device White List failure response to reducer
        yield put(deleteDeviceWhiteListFailure());
    }
}

//Function for Disable Device Whitelist API
function* disableDeviceWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(disableDeviceWhiteListSuccess(slowInternetStaticResponse()));
        } else {

            // To get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Disable Device Whitelist api
            const response = yield call(swaggerPostAPI, Method.DisableDeviceId, payload, headers);

            // To set Disable Device White List success response to reducer
            yield put(disableDeviceWhiteListSuccess(response))
        }
    } catch (error) {
        // To set Disable Device White List failure response to reducer
        yield put(disableDeviceWhiteListFailure());
    }
}

//Function for Enable Device Whitelist API
function* enableDeviceWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(enableDeviceWhiteListSuccess(slowInternetStaticResponse()));
        } else {

            // To get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Enable Device Whitelist Id api
            const response = yield call(swaggerPostAPI, Method.EnableDeviceId, payload, headers);

            // To set Enable Device White List success response to reducer
            yield put(enableDeviceWhiteListSuccess(response))
        }
    } catch (error) {
        // To set Enable Device White List failure response to reducer
        yield put(enableDeviceWhiteListFailure());
    }
}

function* DeviceHistorySaga() {
    // To register Device Whitelist method
    yield takeLatest(DEVICEHISTORY_FETCH, getDeviceWhitelistApi)
    // To register Enable Device Whitelist method
    yield takeLatest(ENABLE_DEVICE_WHITELIST, enableDeviceWhitelistApi)
    // To register Disable Device Whitelist method
    yield takeLatest(DISABLE_DEVICE_WHITELIST, disableDeviceWhitelistApi)
    // To register Delete Device Whitelist method
    yield takeLatest(DELETE_DEVICE_WHITELIST, deleteDeviceWhitelistApi)
}
export default DeviceHistorySaga;