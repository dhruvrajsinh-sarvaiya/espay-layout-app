/**
 * Auther : Salim Deraiya
 * Created : 08/10/2018
 * SLA Configuration Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
//Action Types..
import {
	LIST_SLA,
	EDIT_SLA,
	ADD_SLA,
	DELETE_SLA
} from "Actions/types";
//Action methods..
import {
	slaConfigurationListSuccess,
	slaConfigurationListFailure,
	editSLAConfigurationSuccess,
	editSLAConfigurationFailure,
	addSLAConfigurationSuccess,
	addSLAConfigurationFailure,
	deleteSLAConfigurationSuccess,
	deleteSLAConfigurationFailure
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for SLA Configuration List API
function* getSLAConfigurationListAPI({ payload }) {
	let headers = { 'Authorization': AppConfig.authorizationToken };
	const response = yield call(swaggerGetAPI, 'api/BackOffice/GetComplaintPriority?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.PAGE_SIZE, {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(slaConfigurationListSuccess(response));
		} else {
			yield put(slaConfigurationListFailure(response));
		}
	} catch (error) {
		yield put(slaConfigurationListFailure(error));
	}
}

//Function for Edit SLA Configuration API
function* editSLAConfigurationAPI({ payload }) {
	let headers = { 'Authorization': AppConfig.authorizationToken };
	const response = yield call(swaggerPostAPI, 'api/BackOffice/ComplaintPriorityUpdate', payload, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(editSLAConfigurationSuccess(response));
		} else {
			yield put(editSLAConfigurationFailure(response));
		}
	} catch (error) {
		yield put(editSLAConfigurationFailure(error));
	}
}

//Function for Get SLA Configuration By Id API
function* deleteSLAConfigurationAPI({ payload }) {
	let headers = { 'Authorization': AppConfig.authorizationToken };
	const response = yield call(swaggerPostAPI, 'api/BackOffice/ComplaintPriorityDelete', payload, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(deleteSLAConfigurationSuccess(response));
		} else {
			yield put(deleteSLAConfigurationFailure(response));
		}
	} catch (error) {
		yield put(deleteSLAConfigurationFailure(error));
	}
}

//Function for Replay SLA Configuration API
function* addSLAConfigurationAPI({ payload }) {
	let headers = { 'Authorization': AppConfig.authorizationToken };
	const response = yield call(swaggerPostAPI, 'api/BackOffice/ComplaintPriorityAdd', payload, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(addSLAConfigurationSuccess(response));
		} else {
			yield put(addSLAConfigurationFailure(response));
		}
	} catch (error) {
		yield put(addSLAConfigurationFailure(error));
	}
}

/* Create Sagas method for SLA Configuration List */
export function* slaConfigurationListSagas() {
	yield takeEvery(LIST_SLA, getSLAConfigurationListAPI);
}

/* Create Sagas method for Edit SLA Configuration */
export function* editSLAConfigurationSagas() {
	yield takeEvery(EDIT_SLA, editSLAConfigurationAPI);
}

/* Create Sagas method for Replay SLA Configuration */
export function* addSLAConfigurationSagas() {
	yield takeEvery(ADD_SLA, addSLAConfigurationAPI);
}

/* Create Sagas method for get SLA Configuration Conversion By Id */
export function* deleteSLAConfigurationSagas() {
	yield takeEvery(DELETE_SLA, deleteSLAConfigurationAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(slaConfigurationListSagas),
		fork(editSLAConfigurationSagas),
		fork(addSLAConfigurationSagas),
		fork(deleteSLAConfigurationSagas)
	]);
}