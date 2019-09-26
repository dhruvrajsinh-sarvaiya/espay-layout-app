//Sagas Effects..
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { DISABLE_GOOGLE_AUTH } from "../../actions/ActionTypes";
import { disableGoogleauthSuccess, disableGoogleauthFailure } from "../../actions/account/DisableGoogleAuthAction";
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';

//Function for Disable Google Auth API
function* disableGoogleAuthApi(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Disable Google Auth Data Api
		const response = yield call(swaggerPostAPI, Method.Disable2fa, payload.disableGoogleAuthRequest, headers);

		// To set Disable Google Auth success response to reducer
		yield put(disableGoogleauthSuccess(response));
	} catch (error) {
		// To set Disable Google Auth failure response to reducer
		yield put(disableGoogleauthFailure(error));
	}
}

/**
 * Call Submit Send Google Auth
 */
export default function* DisableGoogleAuthSaga() {
	yield takeLatest(DISABLE_GOOGLE_AUTH, disableGoogleAuthApi);
}