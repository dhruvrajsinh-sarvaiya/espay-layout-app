//Sagas Effects..
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { DISABLE_GOOGLE_AUTH } from "../actions/ActionTypes";
import {
	disableGoogleauthSuccess,
	disableGoogleauthFailure
} from "../actions/account/DisableGoogleAuthAction";

import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerPostAPI } from '../api/helper';

//Function for Disable Google Auth API
function* disableGoogleAuthApi(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Disable Google Auth api
		const response = yield call(swaggerPostAPI, Method.Disable2fa, payload.disableGoogleAuthRequest, headers);
		
		// To set Disable Google Auth api success response to reducer
		yield put(disableGoogleauthSuccess(response));
	} catch (error) {
		// To set Disable Google Auth api failure response to reducer
		yield put(disableGoogleauthFailure(error));
	}
}

export default function* DisableGoogleAuthSaga() {
	// To register Disable Google Auth method
	yield takeLatest(DISABLE_GOOGLE_AUTH, disableGoogleAuthApi);
}