/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Email With OTP Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    SIGNUP_WITH_EMAIL,
    SIGNUP_EMAIL_RESEND_OTP,
    SIGNUP_EMAIL_VERIFY_OTP,
} from 'Actions/types';

//Action methods..
import {
    signUpWithEmailSuccess,
    signUpWithEmailFailure,
    signUpEmailResendSuccess,
    signUpEmailResendFailure,
    signUpEmailVerifySuccess,
    signUpEmailVerifyFailure,
} from 'Actions/MyAccount';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Signup Email
function* signupEmailAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/SignUpWithEmail',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpWithEmailSuccess(response));
        } else {
            yield put(signUpWithEmailFailure(response));
        }
    } catch (error) {
        yield put(signUpWithEmailFailure(error));
    }
}

//Function for Resend OTP to Email
function* resendOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/ReSendOtpWithEmail',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpEmailResendSuccess(response));
        } else {
            yield put(signUpEmailResendFailure(response));
        }
    } catch (error) {
        yield put(signUpEmailResendFailure(error));
    }
}

//Function for Verify OTP
function* verifyOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/EmailOtpVerification',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpEmailVerifySuccess(response));
        } else {
            yield put(signUpEmailVerifyFailure(response));
        }
    } catch (error) {
        yield put(signUpEmailVerifyFailure(error));
    }
}

/* Create Sagas method for Signup Email */
export function* signupEmailSagas() {
    yield takeEvery(SIGNUP_WITH_EMAIL, signupEmailAPI);
}

/* Create Sagas method for Signup Email */
export function* resendOTPSagas() {
    yield takeEvery(SIGNUP_EMAIL_RESEND_OTP, resendOTPAPI);
}

/* Create Sagas method for Signup Email */
export function* verifyOTPSagas() {
    yield takeEvery(SIGNUP_EMAIL_VERIFY_OTP, verifyOTPAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(signupEmailSagas),
        fork(resendOTPSagas),
        fork(verifyOTPSagas),
    ]);
}