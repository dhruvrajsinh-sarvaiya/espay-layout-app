/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * SignIn Email With OTP Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    SIGNIN_WITH_EMAIL,
    SIGNIN_EMAIL_RESEND_OTP,
    SIGNIN_EMAIL_VERIFY_OTP,
} from 'Actions/types';

//Action methods..
import {
    signInWithEmailSuccess,
    signInWithEmailFailure,
    signInEmailResendSuccess,
    signInEmailResendFailure,
    signInEmailVerifySuccess,
    signInEmailVerifyFailure,
} from 'Actions/MyAccount';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for SignIn Email
function* signInEmailAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/LoginWithEmailV1',payload);
   
    try {
        if(response.ReturnCode === 0) {
            yield put(signInWithEmailSuccess(response));
        } else {
            yield put(signInWithEmailFailure(response));
        }
    } catch (error) {
        yield put(signInWithEmailFailure(error));
    }
}

//Function for Resend OTP to Email
function* resendOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/ReSendOtpWithEmail',payload);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(signInEmailResendSuccess(response));
        } else {
            yield put(signInEmailResendFailure(response));
        }
    } catch (error) {
        yield put(signInEmailResendFailure(error));
    }
}

//Function for Verify OTP
function* verifyOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/EmailOtpVerification',payload);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(signInEmailVerifySuccess(response));
        } else {
            yield put(signInEmailVerifyFailure(response));
        }
    } catch (error) {
        yield put(signInEmailVerifyFailure(error));
    }
}

/* Create Sagas method for SignIn Email */
export function* signInEmailSagas() {
    yield takeEvery(SIGNIN_WITH_EMAIL, signInEmailAPI);
}

/* Create Sagas method for SignIn Email */
export function* resendOTPSagas() {
    yield takeEvery(SIGNIN_EMAIL_RESEND_OTP, resendOTPAPI);
}

/* Create Sagas method for SignIn Email */
export function* verifyOTPSagas() {
    yield takeEvery(SIGNIN_EMAIL_VERIFY_OTP, verifyOTPAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(signInEmailSagas),
        fork(resendOTPSagas),
        fork(verifyOTPSagas),
    ]);
}