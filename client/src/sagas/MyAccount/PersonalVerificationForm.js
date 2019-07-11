/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By : Salim Deraiya (24-01-2019)
 * Personal Verification Form Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { PERSONAL_VERIFICATION, GET_KYC_STATUS } from "Actions/types";
//Action methods..
import { 
	personalVerificationSuccess,
	personalVerificationFailure,
	getKYCStatusSuccess,
	getKYCStatusFailure,
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, convertObjToFormData } from 'Helpers/helpers';

//Function for Personal Verification
function* personalVerificationAPI({ payload }) {
	var formData = convertObjToFormData(payload);
	var headers =  { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI,'api/KYC/PersonalVerification',formData,headers);
	
	
	try {
		if (response.ReturnCode === 0) {
			yield put(personalVerificationSuccess(response));
		} else {
			yield put(personalVerificationFailure(response));
		}
	} catch (error) {
		yield put(personalVerificationFailure(error));
	}
}

//Function for Get KYC Status
function* getKYCStatusAPI() {
	var headers =  { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerGetAPI,'api/KYC/CheckUserKYCStatus',{},headers);
	
	
	try {
		if (response.ReturnCode === 0) {
			yield put(getKYCStatusSuccess(response));
		} else {
			yield put(getKYCStatusFailure(response));
		}
	} catch (error) {
		yield put(getKYCStatusFailure(error));
	}
}

/* Create Sagas method for personalVerification */
export function* personalVerificationSagas() {
	yield takeEvery(PERSONAL_VERIFICATION, personalVerificationAPI);
}

/* Create Sagas method for Get KYC Status */
export function* getKYCStatusSagas() {
	yield takeEvery(GET_KYC_STATUS, getKYCStatusAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(personalVerificationSagas),
		fork(getKYCStatusSagas)
	]);
}