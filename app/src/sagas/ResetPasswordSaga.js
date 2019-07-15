//Sagas Effects..
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerPostAPI } from '../api/helper';
//Action Types..
import { CHANGE_PASSWORD } from '../actions/ActionTypes';
//Action methods..
import { changePasswordSuccess, changePasswordFailure } from '../actions/Login/ResetPasswordAction';

//Function for Change Password
function* changePasswordAPI({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Change Password api
		const response = yield call(swaggerPostAPI, Method.changepassword, payload, headers);

		// To set Change Password success response to reducer
		yield put(changePasswordSuccess(response));
	} catch (error) {
		// To set Change Password failure response to reducer
		yield put(changePasswordFailure(error));
	}
}

// Create Sagas method for Change Password
export function* ResetPasswordSaga() {
	// To register change password method
	yield takeLatest(CHANGE_PASSWORD, changePasswordAPI);
}

/* Export methods to rootSagas */
export default ResetPasswordSaga