//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { ENABLE_GOOGLE_AUTH, GET_GOOGLE_AUTH_INFO } from "../actions/ActionTypes";
import { userAccessToken } from '../selector';
import {
	getGoogleAuthInfoSuccess,
	getGoogleAuthInfoFailure,
	enableGoogleAuthSuccess,
	enableGoogleAuthFailure
} from "../actions/account/EnableGoogleAuthAction";
import { Method } from '../controllers/Constants';
import { swaggerPostAPI, swaggerGetAPI } from '../api/helper';

//Function for Enable Google Auth API
function* enableGooogleAuthApi(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Enable Google Authentication api
		const response = yield call(swaggerPostAPI, Method.enableauthenticator, payload.enableGoogleAuthRequest, headers);

		// To set Enable Google Auth success response to reducer
		yield put(enableGoogleAuthSuccess(response));
	} catch (error) {
		// To set Enable Google Auth failure response to reducer
		yield put(enableGoogleAuthFailure(error));
	}
}

//Function for Get Google Auth Info API
function* getGooogleAuthApi() {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Google Authentication Info api
		const response = yield call(swaggerGetAPI, Method.enableauthenticator, {}, headers);

		// To set Google Auth success response to reducer
		yield put(getGoogleAuthInfoSuccess(response));
	} catch (error) {
		// To set Google Auth failure response to reducer
		yield put(getGoogleAuthInfoFailure(error));
	}
}

// Enable Google Auth Sagas Method
export function* enableGooogleAuthSagas() {
	yield takeLatest(ENABLE_GOOGLE_AUTH, enableGooogleAuthApi);
}

// Get Google Auth Sagas Method
export function* getGooogleAuthSagas() {
	yield takeLatest(GET_GOOGLE_AUTH_INFO, getGooogleAuthApi);
}

export default function* EnableGoogleAuthSaga() {
	yield all([
		// To register Enable Google Auth method
		fork(enableGooogleAuthSagas),
		// To register Google Auth Info method
		fork(getGooogleAuthSagas)
	]);
}