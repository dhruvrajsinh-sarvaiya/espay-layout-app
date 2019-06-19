/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated by:Saloni Rathod(19th March 2019)
 * Device Whitelist Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import {
	LIST_DEVICE_WHITELIST,
	ADD_DEVICE_WHITELIST,
	DELETE_DEVICE_WHITELIST,
	DISABLE_DEVICE_WHITELIST,
	ENABLE_DEVICE_WHITELIST
} from "Actions/types";

import {
	deviceWhiteListSuccess,
	deviceWhiteListFailure,
	addDeviceWhiteListSuccess,
	addDeviceWhiteListFailure,
	deleteDeviceWhiteListSuccess,
	deleteDeviceWhiteListFailure,
	disableDeviceWhiteListSuccess,
	disableDeviceWhiteListFailure,
	enableDeviceWhiteListSuccess,
	enableDeviceWhiteListFailure
} from "Actions";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Device White List API Added by Saloni Rathod 19/03/2019
function* getDeviceWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	var swaggerUrl = 'api/Manage/GetDeviceId/' + payload.PageIndex + '/' + payload.Page_Size + '?';

	if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
		swaggerUrl += '&FromDate=' + payload.FromDate;
	}
	if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
		swaggerUrl += '&ToDate=' + payload.ToDate;
	}
	if (payload.hasOwnProperty("Device") && payload.Device !== "") {
		swaggerUrl += '&Device=' + payload.Device;
	}


	const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
	try {

		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(deviceWhiteListFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(deviceWhiteListSuccess(response));
		} else {
			yield put(deviceWhiteListFailure(response));
		}
	} catch (error) {
		yield put(deviceWhiteListFailure(error));
	}
}

//Function for Add Device Whitelist API
function* addDeviceWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/AddDevice', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(addDeviceWhiteListFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(addDeviceWhiteListSuccess(response));
		} else {
			yield put(addDeviceWhiteListFailure(response));
		}
	} catch (error) {
		yield put(addDeviceWhiteListFailure(error));
	}
}

//Function for Delete Device Whitelist API
function* deleteDeviceWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/DeleteDeviceId', payload, headers);
	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(deleteDeviceWhiteListFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(deleteDeviceWhiteListSuccess(response));
		} else {
			yield put(deleteDeviceWhiteListFailure(response));
		}
	} catch (error) {
		yield put(deleteDeviceWhiteListFailure(error));
	}
}

//Function for Disable Device Whitelist API
function* disableDeviceWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/DisableDeviceId', payload, headers);
	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(disableDeviceWhiteListFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(disableDeviceWhiteListSuccess(response));
		} else {
			yield put(disableDeviceWhiteListFailure(response));
		}
	} catch (error) {
		yield put(disableDeviceWhiteListFailure(error));
	}
}

//Function for Enable Device Whitelist API
function* enableDeviceWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/EnableDeviceId', payload, headers);
	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(enableDeviceWhiteListFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(enableDeviceWhiteListSuccess(response));
		} else {
			yield put(enableDeviceWhiteListFailure(response));
		}
	} catch (error) {
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
 * Add Device WhiteList
 */
export function* addDeviceWhitelistSagas() {
	yield takeEvery(ADD_DEVICE_WHITELIST, addDeviceWhitelistApi);
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
		fork(addDeviceWhitelistSagas),
		fork(deleteDeviceWhitelistSagas),
		fork(disableDeviceWhitelistSagas),
		fork(enableDeviceWhitelistSagas)
	]);
}