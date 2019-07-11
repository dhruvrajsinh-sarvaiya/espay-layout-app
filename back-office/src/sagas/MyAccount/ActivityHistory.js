/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated by:Saloni Rathod(19th March 2019)
 * Activity List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
	GET_USER_DATA,
	GET_MODULE_TYPE,
	ACTIVITY_HISTORY_LIST
} from 'Actions/types';

//Action methods..
import {
	getUserDataListSuccess,
	getUserDataListFailure,
	getModuleTypeSuccess,
	getModuleTypeFailure,
	activityHistoryListSuccess,
	activityHistoryListFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Help & Support Dashbord Data
function* getUserDataAPI() {
	var headers = { 'Authorization': AppConfig.authorizationToken }

	const response = yield call(swaggerGetAPI, 'api/BackOfficeComplain/GetAllUserData', {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(getUserDataListSuccess(response));
		} else {
			yield put(getUserDataListFailure(response));
		}
	} catch (error) {
		yield put(getUserDataListFailure(error));
	}
}

//Display Help & Support Dashbord Data
function* getModuleTypeAPI() {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerGetAPI, 'api/BackOfficeActivityLog/GetAllModuleData', {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(getModuleTypeSuccess(response));
		} else {
			yield put(getModuleTypeFailure(response));
		}
	} catch (error) {
		yield put(getModuleTypeFailure(error));
	}
}


//Function for Activity List
/* function* activityHistoryListAPI({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	var swaggerUrl = 'api/BackOfficeActivityLog/GetAllActivityLog/' + payload.PageIndex + '/' + payload.Page_Size + '/?';

	if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
		swaggerUrl += '&FromDate=' + payload.FromDate;
	}
	if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
		swaggerUrl += '&ToDate=' + payload.ToDate;
	}
	if (payload.hasOwnProperty("UserId") && payload.UserId !== "") {
		swaggerUrl += '&UserId=' + payload.UserId;
	}
	if (payload.hasOwnProperty("IpAddress") && payload.IpAddress !== "") {
		swaggerUrl += '&IpAddress=' + payload.IpAddress;
	}
	if (payload.hasOwnProperty("DeviceId") && payload.DeviceId !== "") {
		swaggerUrl += '&DeviceId=' + payload.DeviceId;
	}
	if (payload.hasOwnProperty("ActivityAliasName") && payload.ActivityAliasName !== "") {
		swaggerUrl += '&ActivityAliasName=' + payload.ActivityAliasName;
	}
	if (payload.hasOwnProperty("ModuleType") && payload.ModuleType !== "") {
		swaggerUrl += '&ModuleType=' + payload.ModuleType;
	}
	if (payload.hasOwnProperty("StatusCode") && payload.StatusCode !== "") {
		swaggerUrl += '&StatusCode=' + payload.StatusCode;
	}

	const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(activityHistoryListSuccess(response));
		} else {
			yield put(activityHistoryListFailure(response));
		}
	} catch (error) {
		yield put(activityHistoryListFailure(error));
	}
} */

//Function for Activity List Added by Saloni Rathod 19/03/2019
function* activityHistoryListAPI({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	var swaggerUrl = 'api/BackOfficeActivityLog/GetActivityLogHistoryAdmin?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;

	if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
		swaggerUrl += '&FromDate=' + payload.FromDate;
	}
	if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
		swaggerUrl += '&ToDate=' + payload.ToDate;
	}
	if (payload.hasOwnProperty("UserName") && payload.UserName !== "") {
		swaggerUrl += '&UserName=' + payload.UserName;
	}
	if (payload.hasOwnProperty("IpAddress") && payload.IpAddress !== "") {
		swaggerUrl += '&IpAddress=' + payload.IpAddress;
	}

	if (payload.hasOwnProperty("Mode") && payload.Mode !== "") {
		swaggerUrl += '&Mode=' + payload.Mode;
	}
	// if (payload.hasOwnProperty("Location") && payload.Location !== "") {
	// 	swaggerUrl += '&Location=' + payload.Location;
	// }

	const response = yield call(swaggerPostAPI, swaggerUrl, {}, headers);
	try {
		if (response.ReturnCode === 0) {
			yield put(activityHistoryListSuccess(response));
		} else {
			yield put(activityHistoryListFailure(response));
		}
	} catch (error) {
		yield put(activityHistoryListFailure(error));
	}
}

/* Create Sagas method for Get User Data */
export function* getUserDataSagas() {
	yield takeEvery(GET_USER_DATA, getUserDataAPI);
}

/* Create Sagas method for activity History List */
export function* getModuleTypeDataSagas() {
	yield takeEvery(GET_MODULE_TYPE, getModuleTypeAPI);
}

/* Create Sagas method for activity History List */
export function* activityHistoryListSagas() {
	yield takeEvery(ACTIVITY_HISTORY_LIST, activityHistoryListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(getUserDataSagas),
		fork(getModuleTypeDataSagas),
		fork(activityHistoryListSagas)
	]);
}