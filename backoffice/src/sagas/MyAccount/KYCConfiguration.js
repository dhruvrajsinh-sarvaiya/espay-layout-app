/**
 * Auther : Salim Deraiya
 * Created : 27/12/2018
 * KYC Verify Sagas Method
 */

import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import {
	KYC_ADD_DOCUMENT_CONFIG,
	KYC_EDIT_DOCUMENT_CONFIG,
	KYC_LIST_DOCUMENT_CONFIG,
	USER_ADD_KYC_DOCUMENT_CONFIG,
	USER_EDIT_KYC_DOCUMENT_CONFIG,
	USER_LIST_KYC_DOCUMENT_CONFIG,
	KYC_LIST_CONFIG
} from "Actions/types";

// import functions from action
import {
	addKYCDocumentConfigSuccess,
	addKYCDocumentConfigFailure,
	editKYCDocumentConfigSuccess,
	editKYCDocumentConfigFailure,
	getKYCDocumentListSuccess,
	getKYCDocumentListFailure,
	addUserKYCDocumentConfigSuccess,
	addUserKYCDocumentConfigFailure,
	editUserKYCDocumentConfigSuccess,
	editUserKYCDocumentConfigFailure,
	getUserKYCDocumentListSuccess,
	getUserKYCDocumentListFailure,
	listKYCConfigSuccess,
	listKYCConfigFailure
} from "Actions/MyAccount";

//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//For Add KYC Document Config API
function* addKYCDocumentConfigAPI({ payload }) {
	const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/DocumasterAdd', payload, 1);
	// console.log('Req :',payload);
	// console.log('Res :',response);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(addKYCDocumentConfigSuccess(response));
		} else {
			yield put(addKYCDocumentConfigFailure(response));
		}
	} catch (error) {
		yield put(addKYCDocumentConfigFailure(error));
	}
}

//For Edit KYC Document Config API
function* editKYCDocumentConfigAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/DocumasterUpdate', payload, 1);
    // console.log('Req :',payload);
	// console.log('Res :',response);

	try {
		if (response.ReturnCode === 0) {
			yield put(editKYCDocumentConfigSuccess(response));
		} else {
			yield put(editKYCDocumentConfigFailure(response));
		}
	} catch (error) {
		yield put(editKYCDocumentConfigFailure(error));
	}
}

//For Get KYC Document Type List API
function* getKYCDocumentTypeListAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/DocumasterUpdate', payload, 1);
    // console.log('Req :',payload);
	// console.log('Res :',response);

	try {
		if (response.ReturnCode === 0) {
			yield put(getKYCDocumentListSuccess(response));
		} else {
			yield put(getKYCDocumentListFailure(response));
		}
	} catch (error) {
		yield put(getKYCDocumentListFailure(error));
	}
}

//For Add User KYC Document Config API
function* addUserKYCDocumentConfigAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/UserKYCIdentityMappingAdd', payload, 1);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(addUserKYCDocumentConfigSuccess(response));
		} else {
			yield put(addUserKYCDocumentConfigFailure(response));
		}
	} catch (error) {
		yield put(addUserKYCDocumentConfigFailure(error));
	}
}

//For Edit User KYC Document Config API
function* editUserKYCDocumentConfigAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/UserKYCIdentityMappingUpdate', payload, 1);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(editUserKYCDocumentConfigSuccess(response));
		} else {
			yield put(editUserKYCDocumentConfigFailure(response));
		}
	} catch (error) {
		yield put(editUserKYCDocumentConfigFailure(error));
	}
}

//For Get User KYC Document List API
function* getUserKYCDocumentListAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/KYCConfiguration/UserKYCIdentityMappingUpdate', payload, 1);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getUserKYCDocumentListSuccess(response));
		} else {
			yield put(getUserKYCDocumentListFailure(response));
		}
	} catch (error) {
		yield put(getUserKYCDocumentListFailure(error));
	}
}

//For List KYC Config API
function* listKYCConfigAPI({ payload }) {
    const response = yield call(swaggerGetAPI, 'api/KYCConfiguration/KYCIndentityConfigurationList', payload, 1);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(listKYCConfigSuccess(response));
		} else {
			yield put(listKYCConfigFailure(response));
		}
	} catch (error) {
		yield put(listKYCConfigFailure(error));
	}
}

//For Add KYC Document Config
function* addKYCDocumentConfig() {
	yield takeEvery(KYC_ADD_DOCUMENT_CONFIG, addKYCDocumentConfigAPI);
}

//For Edit KYC Document Config
function* editKYCDocumentConfig() {
	yield takeEvery(KYC_EDIT_DOCUMENT_CONFIG, editKYCDocumentConfigAPI);
}

//For Get User KYC Document Type List
function* getKYCDocumentTypeList() {
	yield takeEvery(KYC_LIST_DOCUMENT_CONFIG, getKYCDocumentTypeListAPI);
}

//For Add User KYC Document Config
function* addUserKYCDocumentConfig() {
	yield takeEvery(USER_ADD_KYC_DOCUMENT_CONFIG, addUserKYCDocumentConfigAPI);
}

//For Edit User KYC Document Config
function* editUserKYCDocumentConfig() {
	yield takeEvery(USER_EDIT_KYC_DOCUMENT_CONFIG, editUserKYCDocumentConfigAPI);
}

//For Get User KYC Document List
function* getUserKYCDocumentList() {
	yield takeEvery(USER_LIST_KYC_DOCUMENT_CONFIG, getUserKYCDocumentListAPI);
}

//For List KYC Config
function* listKYCConfig() {
	yield takeEvery(KYC_LIST_CONFIG, listKYCConfigAPI);
}

export default function* rootSaga() {
	yield all([
		fork(addKYCDocumentConfig),
		fork(editKYCDocumentConfig),
		fork(getKYCDocumentTypeList),
		fork(addUserKYCDocumentConfig),
		fork(editUserKYCDocumentConfig),
		fork(listKYCConfig)
	]);
}