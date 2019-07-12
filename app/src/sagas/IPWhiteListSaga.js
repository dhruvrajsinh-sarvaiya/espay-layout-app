//Sagas Effects..
import { call, select, put, takeLatest } from 'redux-saga/effects';

import {
    LIST_IP_WHITELIST,
    ADD_IP_TO_WHITELIST,
    DELETE_IP_TO_WHITELIST,
    DISABLE_IP_TO_WHITELIST,
    ENABLE_IP_TO_WHITELIST,
    UPDATE_IP_TO_WHITELIST
} from "../actions/ActionTypes";

import {
    listIPWhitelistSuccess,
    listIPWhitelistFailure,
    AddIPToWhitelistSuccess,
    AddIPToWhitelistFailure,
    DeleteIPToWhitelistSuccess,
    DeleteIPToWhitelistFailure,
    disableIPWhitelistSuccess,
    disableIPWhitelistFailure,
    enableIPWhitelistSuccess,
    enableIPWhitelistFailure,
    UpdateIPToWhitelistSuccess,
    UpdateIPToWhitelistFailure
} from "../actions/Login/IPWhiteListActions";

import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerPostAPI, swaggerGetAPI, slowInternetStaticResponse } from '../api/helper';
import { getIPAddress } from '../controllers/CommonUtils';

//Function for IP White List API
function* getIPWhitelistApi({ payload }) {
    try {
        // Create request Url
        var swaggerUrl
        if (payload.FromDate !== undefined && payload.ToDate !== undefined) {
            swaggerUrl = Method.GetIpAddress + '/' + payload.PageIndex + '/' + payload.Page_Size + '?FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;
        }
        else {
            swaggerUrl = Method.GetIpAddress + '/' + payload.PageIndex + '/' + payload.Page_Size;
        }
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call IP whitelist api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set IP History list success response to reducer
        yield put(listIPWhitelistSuccess(response));
    } catch (error) {
        // To set IP History list failure response to reducer
        yield put(listIPWhitelistFailure(error));
    }
}

//Function for Add IP Whitelist API
function* addIPToWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(AddIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let tokenID = yield select(userAccessToken);
            var headers = { 'Authorization': tokenID }

            // To call Add to IP whitelist api
            const response = yield call(swaggerPostAPI, Method.IpAddress, payload, headers);

            // To set Add IP to Whitelist success response to reducer
            yield put(AddIPToWhitelistSuccess(response));
        }
    } catch (error) {
        // To set Add IP to Whitelist failure response to reducer
        yield put(AddIPToWhitelistFailure(error));
    }
}

//Function for Delete IP Whitelist API
function* deleteIPToWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(DeleteIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let tokenID = yield select(userAccessToken);
            var headers = { 'Authorization': tokenID }

            // To call Delete to IP whitelist api
            const response = yield call(swaggerPostAPI, Method.DeleteIpAddress, payload, headers);

            // To set Delete IP to Whitelist success response to reducer
            yield put(DeleteIPToWhitelistSuccess(response));
        }
    } catch (error) {
        // To set Delete IP to Whitelist failure response to reducer
        yield put(DeleteIPToWhitelistFailure(error));
    }
}

//Function for Disable IP Whitelist API
function* disableIPToWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(disableIPWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let tokenID = yield select(userAccessToken);
            var headers = { 'Authorization': tokenID }

            // To call Disable IP whitelist api
            const response = yield call(swaggerPostAPI, Method.DisableIpAddress, payload, headers);

            // To set Disable IP whitelist success response to reducer
            yield put(disableIPWhitelistSuccess(response));
        }
    } catch (error) {
        // To set Disable IP whitelist failure response to reducer
        yield put(disableIPWhitelistFailure(error));
    }
}

//Function for Enable IP Whitelist API
function* enableIPToWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(enableIPWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let tokenID = yield select(userAccessToken);
            var headers = { 'Authorization': tokenID }

            // To call Enable IP whitelist api
            const response = yield call(swaggerPostAPI, Method.EnableIpAddress, payload, headers);

            // To set Enable IP Whitelist success response to reducer
            yield put(enableIPWhitelistSuccess(response));
        }
    } catch (error) {
        // To set Enable IP Whitelist failure response to reducer
        yield put(enableIPWhitelistFailure(error));
    }
}

//Function for Update IP Whitelist API
function* updateIPToWhitelistApi({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(UpdateIPToWhitelistSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let tokenID = yield select(userAccessToken);
            var headers = { 'Authorization': tokenID }
            const response = yield call(swaggerPostAPI, Method.UpdateIpAddress, payload, headers);

            // To set Update IP Whitelist success response to reducer
            yield put(UpdateIPToWhitelistSuccess(response));
        }
    } catch (error) {
        // To set Update IP Whitelist failure response to reducer
        yield put(UpdateIPToWhitelistFailure(error));
    }
}

export default function* ipWhiteListSaga() {

    //To fetch IP WhiteList
    yield takeLatest(LIST_IP_WHITELIST, getIPWhitelistApi);

    //To Add IP to WhiteList
    yield takeLatest(ADD_IP_TO_WHITELIST, addIPToWhitelistApi);

    //Delete IP to WhiteList
    yield takeLatest(DELETE_IP_TO_WHITELIST, deleteIPToWhitelistApi);

    //Disable IP to WhiteList
    yield takeLatest(DISABLE_IP_TO_WHITELIST, disableIPToWhitelistApi);

    //Enable IP to WhiteList
    yield takeLatest(ENABLE_IP_TO_WHITELIST, enableIPToWhitelistApi);

    //Update IP to WhiteList
    yield takeLatest(UPDATE_IP_TO_WHITELIST, updateIPToWhitelistApi);
}

