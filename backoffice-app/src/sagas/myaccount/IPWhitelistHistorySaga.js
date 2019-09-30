//Sagas Effects..
import { call, select, put, takeLatest } from 'redux-saga/effects';

import {
    LIST_IP_WHITELIST,
    ADD_IP_TO_WHITELIST,
    DELETE_IP_TO_WHITELIST,
    UPDATE_IP_TO_WHITELIST,
    DISABLE_IP_TO_WHITELIST,
    ENABLE_IP_TO_WHITELIST
} from "../../actions/ActionTypes";

import {
    listIPWhitelistSuccess,
    listIPWhitelistFailure,
    AddIPToWhitelistSuccess,
    AddIPToWhitelistFailure,
    DeleteIPToWhitelistSuccess,
    DeleteIPToWhitelistFailure,
    UpdateIPToWhitelistSuccess,
    UpdateIPToWhitelistFailure,
    disableIptoWhitelistSuccess,
    disableIptoWhitelistFailure,
    enableIptoWhitelistSuccess,
    enableIptoWhitelistFailure
} from "../../actions/account/IPWhitelistHistoryActions";
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';
import { getIPAddress } from '../../controllers/CommonUtils';
import { slowInternetStaticResponse } from '../../api/helper';

//Function for IP White List API
function* enableToIpWhitelist({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerPostAPI, Method.EnableIpAddress, payload, headers);
        yield put(enableIptoWhitelistSuccess(data));

    } catch (error) {
        yield put(enableIptoWhitelistFailure());
    }
}

//Function for IP White List API
function* disableToIpWhitelist({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerPostAPI, Method.DisableIpAddress, payload, headers);
        yield put(disableIptoWhitelistSuccess(data));

    } catch (error) {
        yield put(disableIptoWhitelistFailure());
    }
}

//Function for IP White List API
function* getIPWhitelistApi({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const data = yield call(swaggerGetAPI, Method.GetIpAddress + '/' + payload.PageIndex + '/' + payload.Page_Size, {}, headers);
        yield put(listIPWhitelistSuccess(data));

    } catch (error) {
        yield put(listIPWhitelistFailure(error));
    }
}

//Function for Add IP Whitelist API
function* addIPToWhitelistApi({ payload }) {

    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        payload.ipAddress = yield call(getIPAddress)

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(AddIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            const data = yield call(swaggerPostAPI, Method.IpAddress, payload, headers)
            yield put(AddIPToWhitelistSuccess(data));
        }
    } catch (error) {
        yield put(AddIPToWhitelistFailure(error));
    }

}

//Function for Delete IP Whitelist API
function* deleteIPToWhitelistApi({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        payload.ipAddress = yield call(getIPAddress)

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(DeleteIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            const data = yield call(swaggerPostAPI, Method.DeleteIpAddress, payload, headers)
            yield put(DeleteIPToWhitelistSuccess(data));
        }
    } catch (error) {
        yield put(DeleteIPToWhitelistFailure(error));
    }

}

//Function for Update IP Whitelist API
function* updateIPToWhitelistApi({ payload }) {
    try {
        payload.ipAddress = yield call(getIPAddress)

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(UpdateIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            const data = yield call(updateIPToWhitelist)
            yield put(UpdateIPToWhitelistSuccess(data));
        }
    } catch (error) {
        yield put(UpdateIPToWhitelistFailure(error));
    }

}


export default function* IPWhitelistHistorySaga() {

    //To fetch IP WhiteList
    yield takeLatest(LIST_IP_WHITELIST, getIPWhitelistApi);

    //To Add IP to WhiteList
    yield takeLatest(ADD_IP_TO_WHITELIST, addIPToWhitelistApi);

    //Delete IP to WhiteList
    yield takeLatest(DELETE_IP_TO_WHITELIST, deleteIPToWhitelistApi);

    //Update IP to WhiteList
    yield takeLatest(UPDATE_IP_TO_WHITELIST, updateIPToWhitelistApi);

    // Disable Ip Address
    yield takeLatest(DISABLE_IP_TO_WHITELIST, disableToIpWhitelist);

    // Enable Ip Address
    yield takeLatest(ENABLE_IP_TO_WHITELIST, enableToIpWhitelist);
}

//For Update Ip Whitelist
export function updateIPToWhitelist() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "UpdateIPWhitelistResult": {
                    "ErrorCode": 2172,
                    "ReturnCode": 0,
                    "ReturnMsg": "Your Ip Address Update SuccessFully",
                }
            });
        }, 500);
    });
}
