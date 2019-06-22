// effects for redux-saga
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
// types for set actions and reducers
import {
	GET_API_KEY_LIST,
	ADD_IP_ADDRESS,
	REMOVE_IP_ADDRESS,
	UPDATE_API_KEY_LIST,
	GENERATE_API_KEY,
	GET_IP_WHITELIST_DATA,
	VERIFY_2FA_API_KEY,
	GET_API_KEY_BY_ID,
} from "../actions/ActionTypes";

// action sfor set data or response
import {
	getApiKeyListSuccess,
	getApiKeyListFailure,
	addIPAddressSuccess,
	addIPAddressFailure,
	removeIPAddressSuccess,
	removeIPAddressFailure,
	updateApiKeyListSuccess,
	updateApiKeyListFailure,
	generateApiKeySuccess,
	generateApiKeyFailure,
	getIpWhiteListdataSuccess,
	getIpWhiteListdataFailure,
	twoFAGoogleAuthenticationSuccess,
	twoFAGoogleAuthenticationFailure,
	getApiKeyByIDSuccess,
	getApiKeyByIDFailure,
} from "../actions/ApiKey/ApiKeyAction";
import { userAccessToken } from "../selector";
import { swaggerPostAPI, swaggerDeleteAPI } from "../api/helper";
import { Method } from "../controllers/Constants";

// Sagas Function for get api Key list
function* getApiKeyList() {
	yield takeEvery(GET_API_KEY_LIST, getApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiKeyListDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Api Key List Detail api
		const response = yield call(swaggerPostAPI, Method.GetAPIKeyList + '/' + payload.PlanID, {}, headers);

		// To set Api Key List success response to reducer
		yield put(getApiKeyListSuccess(response));
	} catch (error) {
		// To set Api Key List failure response to reducer
		yield put(getApiKeyListFailure(error));
	}
}

// Sagas Function for get api Key list
function* addIPAddress() {
	yield takeEvery(ADD_IP_ADDRESS, addIPAddressDetail);
}

// Function for set response to data and Call Function for Api Call
function* addIPAddressDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Add IP Address Detail api
		const response = yield call(swaggerPostAPI, Method.IPWhitelist, payload, headers);

		// To set Add Ip Address success response to reducer
		yield put(addIPAddressSuccess(response));
	} catch (error) {
		// To set Add Ip Address failure response to reducer
		yield put(addIPAddressFailure(error));
	}
}

// Sagas Function for get api Key list
function* updateApiKeyList() {
	yield takeEvery(UPDATE_API_KEY_LIST, updateApiKeyListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateApiKeyListDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Update Api Key List Detail api
		const response = yield call(swaggerPostAPI, Method.UpdateAPIKey + '/' + payload.planKey, {}, headers);

		// To set Update Api Key List success response to reducer
		yield put(updateApiKeyListSuccess(response));
	} catch (error) {
		// To set Update Api Key List failure response to reducer
		yield put(updateApiKeyListFailure(error));
	}
}

// Sagas Function for get api Key list
function* generateApiKey() {
	yield takeEvery(GENERATE_API_KEY, generateApiKeyDetail);
}

// Function for set response to data and Call Function for Api Call
function* generateApiKeyDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Generate Api Key Detail api
		const response = yield call(swaggerPostAPI, Method.GenerateAPIKey, payload.data, headers);

		// To set Generate Api Key success response to reducer
		yield put(generateApiKeySuccess(response));
	} catch (error) {
		// To set Generate Api Key failure response to reducer
		yield put(generateApiKeyFailure(error));
	}
}

// Sagas Function for get Ip White list
function* getIpWhiteListdata() {
	yield takeEvery(GET_IP_WHITELIST_DATA, getIpWhiteListdataDetail);
}

// Function for set response to data and Call Function for Api Call
function* getIpWhiteListdataDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Ip White List Data api
		const response = yield call(swaggerPostAPI, Method.GetWhitelistIP + '/' + payload.planKey, {}, headers);

		// To set IP Whitelist success response to reducer
		yield put(getIpWhiteListdataSuccess(response));
	} catch (error) {
		// To set IP Whitelist failure response to reducer
		yield put(getIpWhiteListdataFailure(error));
	}
}

// Sagas Function for get api Key list
function* removeIPAddress() {
	yield takeEvery(REMOVE_IP_ADDRESS, removeIPAddressDetail);
}

// Function for set response to data and Call Function for Api Call
function* removeIPAddressDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID };

		// To call Remove IP Address Detail api
		const response = yield call(swaggerDeleteAPI, Method.DeleteWhitelistIP + '/' + payload.IPId, {}, headers);

		// To set Remove IP Address Detail success response to reducer
		yield put(removeIPAddressSuccess(response));
	} catch (error) {
		// To set Remove IP Address Detail failure response to reducer
		yield put(removeIPAddressFailure(error));
	}
}

// Sagas Function for get Ip White list
function* verifyGoogleAuth() {
	//For Verify 2FA
	yield takeEvery(VERIFY_2FA_API_KEY, verifyGoogleAuthCode)
}

function* verifyGoogleAuthCode(payload) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Verify Google Auth Code api
		const response = yield call(swaggerPostAPI, Method.TwoFAVerifyCode, payload.verifyCodeRequest, headers);

		// To set Verify Google Auth success response to reducer
		yield put(twoFAGoogleAuthenticationSuccess(response));
	} catch (error) {
		// To set Verify Google Auth failure response to reducer
		yield put(twoFAGoogleAuthenticationFailure(error));
	}
}

// Sagas Function for get api Key list ID 
function* getApiKeyByID() {
	yield takeEvery(GET_API_KEY_BY_ID, getApiKeyByIDDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiKeyByIDDetail({ payload }) {
	try {
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Api Key By Detail api
		const response = yield call(swaggerPostAPI, Method.GetAPIKeyByID + '/' + payload.KeyID, {}, headers);

		// To set Api Key By ID Detail success response to reducer
		yield put(getApiKeyByIDSuccess(response));
	} catch (error) {
		// To set Api Key By ID Detail failure response to reducer
		yield put(getApiKeyByIDFailure(error));
	}
}

// Function for root saga
export default function* rootSaga() {
	yield all([
		// To register getApiKeyList method
		fork(getApiKeyList),
		// To register addIPAddress method
		fork(addIPAddress),
		// To register removeIPAddress method
		fork(removeIPAddress),
		// To register updateApiKeyList method
		fork(updateApiKeyList),
		// To register generateApiKey method
		fork(generateApiKey),
		// To register getIpWhiteListdata method
		fork(getIpWhiteListdata),
		// To register verifyGoogleAuth method
		fork(verifyGoogleAuth),
		// To register getApiKeyByID method
		fork(getApiKeyByID),
	]);
}
