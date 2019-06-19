/**
 * Auther : Kevin Ladani
 * Created : 14/09/2018
 * Membership Level Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { MEMBERSHIP_LEVEL } from 'Actions/types';
import { membershipLevelSuccess, membershipLevelFailure } from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Membership Level API
function* membershipLevelAPI({ payload }) {
    var headers =  {'Authorization': AppConfig.authorizationToken}
	const response = yield call(swaggerGetAPI,'api/Profile/GetProfileData',payload,headers);
	
	try {
		//console.log('Memeber Res', response);
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			staticRes = staticResponse(response.statusCode);
			yield put(membershipLevelFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(membershipLevelSuccess(response));
		} else {
			yield put(membershipLevelFailure(response));
		}
	} catch (error) {
		yield put(membershipLevelFailure(error));
	}
}

/* Membership Level */
export function* membershipLevelSagas() {
	yield takeEvery(MEMBERSHIP_LEVEL, membershipLevelAPI);
}

export default function* rootSaga() {
	yield all([
		fork(membershipLevelSagas)
	]);
}