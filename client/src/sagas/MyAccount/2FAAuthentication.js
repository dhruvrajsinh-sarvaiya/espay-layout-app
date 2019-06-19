/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * 2FA Authentication Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

//Action Types..
import {
	TWO_FA_GOOGLE_AUTHENTICATION,
	TWO_FA_SMS_AUTHENTICATION,
	SEND_SMS
} from "Actions/types";

//Action methods..
import {
	twoFAGoogleAuthenticationSuccess,
	twoFAGoogleAuthenticationFailure,
	twoFASMSAuthenticationSuccess,
	twoFASMSAuthenticationFailure,
	sendSMSSuccess,
	sendSMSFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//WebSocket Call...
const watchMessages = (socket, request) => eventChannel((emit) => {
	socket.onopen = () => {
		socket.send(JSON.stringify(request)) // Send data to server
	};
	socket.onmessage = (event) => {
		const msg = JSON.parse(event.data);
		emit(msg);
	};
	return () => {
		socket.close();
	};
});

//Function for Google Authentication
function* googleAuthenticationAPI({ payload }) {
	const response = yield call(swaggerPostAPI,'api/Signin/VerifyCode',payload);
    // console.log('2Fa Request',payload);
    // console.log('2Fa Response',response);
    try {
        if(response.ReturnCode === 0) {
            yield put(twoFAGoogleAuthenticationSuccess(response));
        } else {
            yield put(twoFAGoogleAuthenticationFailure(response));
        }
    } catch (error) {
        yield put(twoFAGoogleAuthenticationFailure(error));
    }
}

//Function for SMS Authentication
function* smsAuthenticationAPI({ payload }) {
	const socket = new WebSocket(socketApiUrl);

	let request = {
		m: 0,
		i: 0,
		n: 'token',
		t: 1,
		r: 0,
		o: payload
	}

	const socketChannel = yield call(watchMessages, socket, request);
	while (true) {
		try {
			const response = yield take(socketChannel);
			if (response.statusCode === 200) {
				yield put(twoFASMSAuthenticationSuccess(response));
			} else {
				yield put(twoFASMSAuthenticationFailure(response));
			}
		} catch (error) {
			yield put(twoFASMSAuthenticationFailure(error));
		}
	}
}

//Function for Send SMS
function* sendSMSAPI({ payload }) {
	const socket = new WebSocket(socketApiUrl);

	let request = {
		m: 0,
		i: 0,
		n: 'token',
		t: 1,
		r: 0,
		o: payload
	}
	
	const socketChannel = yield call(watchMessages, socket, request);
	while (true) {
		try {
			const response = yield take(socketChannel);
			if (response.statusCode === 200) {
				yield put(sendSMSSuccess(response));
			} else {
				yield put(sendSMSFailure(response));
			}
		} catch (error) {
			yield put(sendSMSFailure(error));
		}
	}
}

/* Create Sagas method for googleAuthentication */
export function* googleAuthenticationSagas() {
	yield takeEvery(TWO_FA_GOOGLE_AUTHENTICATION, googleAuthenticationAPI);
}

/* Create Sagas method for smsAuthentication */
export function* smsAuthenticationSagas() {
	yield takeEvery(TWO_FA_SMS_AUTHENTICATION, smsAuthenticationAPI);
}

/* Create Sagas method for smsAuthentication */
export function* sendSMSSagas() {
	yield takeEvery(SEND_SMS, sendSMSAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
	yield all([
		fork(googleAuthenticationSagas),
		fork(smsAuthenticationSagas),
		fork(sendSMSSagas)
	]);
}