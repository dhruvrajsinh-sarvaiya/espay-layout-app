/**
 * Auther : Kevin Ladani
 * Created : 08/10/2018
 * Disable Google Auth Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { DISABLE_GOOGLE_AUTH } from "Actions/types";

import {
	disableGoogleauthSuccess,
	disableGoogleauthFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Disable Google Auth API
function* disableGoogleAuthApi({ payload }) {
	var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerPostAPI,'api/TwoFASetting/Disable2fa',payload,headers);
	
	try {
		if(lgnErrCode.includes(response.statusCode)){
			redirectToLogin();
		} else if(statusErrCode.includes(response.statusCode)){               
			staticRes = staticResponse(response.statusCode);
			yield put(disableGoogleauthFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(disableGoogleauthSuccess(response));
		} else {
			yield put(disableGoogleauthFailure(response));
		}
	} catch (error) {
		yield put(disableGoogleauthFailure(error));
	}
}

/**
 * Call Submit Send Google Auth
 */
export function* disableGoogleAuthSagas() {
	yield takeEvery(DISABLE_GOOGLE_AUTH, disableGoogleAuthApi);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
	yield all([
		fork(disableGoogleAuthSagas)
	]);
}