/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Change Password Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
	CHANGE_PASSWORD
} from 'Actions/types';

//Action methods..
import {
	changePasswordSuccess,
	changePasswordFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();
const socketApiUrl = AppConfig.socketAPIUrl;

//Function for Change Password
function* changePasswordAPI({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/Manage/changepassword', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			var staticRes = staticResponse(response.statusCode);
			yield put(changePasswordFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(changePasswordSuccess(response));
		} else {
			yield put(changePasswordFailure(response));
		}
	} catch (error) {
		yield put(changePasswordFailure(error));
	}
}

/* Create Sagas method for Change Password */
export function* changePasswordSagas() {
	yield takeEvery(CHANGE_PASSWORD, changePasswordAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(changePasswordSagas)
	]);
}