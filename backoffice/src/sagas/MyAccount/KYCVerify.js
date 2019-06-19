/**
 * Auther : Salim Deraiya
 * Created : 02/10/2018
 * UpdatedBy : Salim Deraiya 29/12/2018
 * KYC Verify Sagas Method
 */

import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';

import {
	LIST_KYC_VERIFY,
	EDIT_KYC_VERIFY,
	GET_KYC_VERIFY_BY_ID
} from "Actions/types";

// import functions from action
import {
	kycVerifySuccess,
	kycVerifyFailure,
	editKycVerifySuccess,
	editKycVerifyFailure,
	getKycVerifyByIdSuccess,
	getKycVerifyByIdFailure
} from "Actions/MyAccount";

//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';
const querystring = require('querystring')

//Function for Get KYC Verify API
function* getKycVerifyAPI({ payload }) {
	// console.log('Payload :',payload,querystring.stringify(payload));
	var swaggerUrl = 'api/KYCConfiguration/GetKYCList?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;
	if(typeof payload.Status !== 'undefined' && payload.Status !== '') {
		swaggerUrl += '&Status='+payload.Status;
	}
	if(typeof payload.Mobile !== 'undefined' && payload.Mobile !== '') {
		swaggerUrl += '&Mobile='+payload.Mobile;
	}	
	if(typeof payload.EmailAddress !== 'undefined' && payload.EmailAddress !== '') {
		swaggerUrl += '&EmailAddress='+payload.EmailAddress;
	}
	if(typeof payload.FromDate !== 'undefined' && payload.FromDate !== '') {
		swaggerUrl += '&FromDate='+payload.FromDate;
	}
	if(typeof payload.ToDate !== 'undefined' && payload.ToDate !== '') {
		swaggerUrl += '&ToDate='+payload.ToDate;
	}
	const response = yield call(swaggerGetAPI, swaggerUrl, payload, 1);
	// console.log('Req :',payload);
	// console.log('Res :',response);

	try {
		if (response.ReturnCode === 0) {
			yield put(kycVerifySuccess(response));
		} else {
			yield put(kycVerifyFailure(response));
		}
	} catch (error) {
		yield put(kycVerifyFailure(error));
	}
}

//Function for Edit KYC Verify API
function* editKycVerifyAPI({ payload }) {
	const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/KYCStatusUpdate', payload, 1);
	// console.log('Req :',payload);
	// console.log('Res :',response);

	try {
		if (response.ReturnCode === 0) {
			yield put(editKycVerifySuccess(response));
		} else {
			yield put(editKycVerifyFailure(response));
		}
	} catch (error) {
		yield put(editKycVerifyFailure(error));
	}
}

//Function for KYC Verify By ID API
function* getKycVerifyByIdAPI({ payload }) {
	const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/KYCStatusUpdate', payload, 1);
	// console.log('Req :',payload);
	// console.log('Res :',response);

	try {
		if (response.ReturnCode === 0) {
			yield put(getKycVerifyByIdSuccess(response));
		} else {
			yield put(getKycVerifyByIdFailure(response));
		}
	} catch (error) {
		yield put(getKycVerifyByIdFailure(error));
	}
}

//List KYC Verify
function* getKycVerifyList() {
	yield takeEvery(LIST_KYC_VERIFY, getKycVerifyAPI);
}

//Edit KYC Verify
function* editKycVerify() {
	yield takeEvery(EDIT_KYC_VERIFY, editKycVerifyAPI);
}

//Edit KYC Verify
function* getKycVerifyById() {
	yield takeEvery(GET_KYC_VERIFY_BY_ID, getKycVerifyByIdAPI);
}

export default function* rootSaga() {
	yield all([
		fork(getKycVerifyList),
		fork(editKycVerify),
		fork(getKycVerifyById)
	]);
}