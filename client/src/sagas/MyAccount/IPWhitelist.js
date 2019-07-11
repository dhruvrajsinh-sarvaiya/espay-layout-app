/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By: Saloni Rathod(05th April 2019)
 * IP History List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
	LIST_IP_WHITELIST,
	ADD_IP_TO_WHITELIST,
	DELETE_IP_TO_WHITELIST,
	DISABLE_IP_TO_WHITELIST,
	ENABLE_IP_TO_WHITELIST
} from "Actions/types";

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
	enableIPWhitelistFailure
} from "Actions";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for IP White List API
function* getIPWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	var swaggerUrl = 'api/Manage/GetIpAddress/' + payload.PageIndex + '/' + payload.Page_Size + '?';
	if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
		swaggerUrl += '&FromDate=' + payload.FromDate;
	}
	if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
		swaggerUrl += '&ToDate=' + payload.ToDate;
	}
	if (payload.hasOwnProperty("IPAddress") && payload.IPAddress !== "") {
		swaggerUrl += '&IPAddress=' + payload.IPAddress;
	}

	const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(listIPWhitelistFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(listIPWhitelistSuccess(response));
		} else {
			yield put(listIPWhitelistFailure(response));
		}
	} catch (error) {
		yield put(listIPWhitelistFailure(error));
	}
}

//Function for Add IP Whitelist API
function* addIPToWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/IpAddress', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(AddIPToWhitelistFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(AddIPToWhitelistSuccess(response));
		} else {
			yield put(AddIPToWhitelistFailure(response));
		}
	} catch (error) {
		yield put(AddIPToWhitelistFailure(error));
	}
}

//Function for Delete IP Whitelist API
function* deleteIPToWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/DeleteIpAddress', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(DeleteIPToWhitelistFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(DeleteIPToWhitelistSuccess(response));
		} else {
			yield put(DeleteIPToWhitelistFailure(response));
		}
	} catch (error) {
		yield put(DeleteIPToWhitelistFailure(error));
	}
}

//Function for Disable IP Whitelist API
function* disableIPToWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/DisableIpAddress', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(disableIPWhitelistFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(disableIPWhitelistSuccess(response));
		} else {
			yield put(disableIPWhitelistFailure(response));
		}
	} catch (error) {
		yield put(disableIPWhitelistFailure(error));
	}
}

//Function for Enable IP Whitelist API
function* enableIPToWhitelistApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/EnableIpAddress', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(enableIPWhitelistFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(enableIPWhitelistSuccess(response));
		} else {
			yield put(enableIPWhitelistFailure(response));
		}
	} catch (error) {
		yield put(enableIPWhitelistFailure(error));
	}
}

/**
 * IP WhiteList
 */
export function* getIPWhitelistSagas() {
	yield takeEvery(LIST_IP_WHITELIST, getIPWhitelistApi);
}

/**
 * Add IP to WhiteList
 */
export function* addIPToWhitelistSagas() {
	yield takeEvery(ADD_IP_TO_WHITELIST, addIPToWhitelistApi);
}

/**
 * Delete IP to WhiteList
 */
export function* deleteIPToWhitelistSagas() {
	yield takeEvery(DELETE_IP_TO_WHITELIST, deleteIPToWhitelistApi);
}

/**
 * Disable IP to WhiteList
 */
export function* disableIPToWhitelistSagas() {
	yield takeEvery(DISABLE_IP_TO_WHITELIST, disableIPToWhitelistApi);
}

/**
 * Enable IP to WhiteList
 */
export function* enableIPToWhitelistSagas() {
	yield takeEvery(ENABLE_IP_TO_WHITELIST, enableIPToWhitelistApi);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
	yield all([
		fork(getIPWhitelistSagas),
		fork(addIPToWhitelistSagas),
		fork(deleteIPToWhitelistSagas),
		fork(disableIPToWhitelistSagas),
		fork(enableIPToWhitelistSagas)
	]);
}