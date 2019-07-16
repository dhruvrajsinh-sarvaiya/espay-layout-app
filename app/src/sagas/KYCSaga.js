//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
//Action Types..
import { PERSONAL_VERIFICATION } from "../actions/ActionTypes";
//Action methods..
import { personalVerificationSuccess, personalVerificationFailure } from "../actions/KYC/KycAction";
import { swaggerPostAPI, convertObjToFormData, slowInternetStaticResponse } from "../api/helper";
import { Method } from "../controllers/Constants";
import { userAccessToken } from "../selector";
import { getIPAddress } from '../controllers/CommonUtils';

//Function for Personal Verification
function* personalVerificationAPI(payload) {
	try {
		// To get IP Address
		payload.reqKYC.IPAddress = yield call(getIPAddress);

		//If ip address is empty than show static slow internet dialog
		if (payload.reqKYC.IPAddress === '') {
			yield put(personalVerificationSuccess(slowInternetStaticResponse()));
		} else {
			
			var formData = convertObjToFormData(payload.reqKYC);
			//to get tokenID of currently logged in user.
			let tokenID = yield select(userAccessToken);
			var headers = { 'Authorization': tokenID }

			// To call Personal Verification api
			const response = yield call(swaggerPostAPI, Method.PersonalVerification, formData, headers);

			// To set Personal Verification success response to reducer
			yield put(personalVerificationSuccess(response));
		}
	} catch (error) {
		// To set Personal Verification failure response to reducer
		yield put(personalVerificationFailure(error));
	}
}

/* Create Sagas method for personalVerification */
export function* personalVerificationSagas() {
	yield takeLatest(PERSONAL_VERIFICATION, personalVerificationAPI);
}

/* Export methods to rootSagas */
export default function* KYCSaga() {
	yield all([
		fork(personalVerificationSagas)
	]);
}
