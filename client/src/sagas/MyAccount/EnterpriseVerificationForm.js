/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Enterprise Verification Form Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { ENTERPRISE_VERIFICATION } from "Actions/types";
//Action methods..
import { enterpriseVerificationSuccess, enterpriseVerificationFailure } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, convertObjToFormData } from 'Helpers/helpers';

//Function for Enterprise Verification API
function* enterpriseVerificationAPI({ payload }) {
	var formData = convertObjToFormData(payload);
	var headers =  { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI,'api/KYC/PersonalVerification',formData,headers);
	
	try {
		if (response.ReturnCode === 0) {
			yield put(enterpriseVerificationSuccess(response));
		} else {
			yield put(enterpriseVerificationFailure(response));
		}
	} catch (error) {
		yield put(enterpriseVerificationFailure(error));
	}
}

/* Create Sagas method for Enterprise Verification */
export function* enterpriseVerificationSagas() {
	yield takeEvery(ENTERPRISE_VERIFICATION, enterpriseVerificationAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(enterpriseVerificationSagas)
	]);
}