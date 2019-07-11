/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Mobile With OTP Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    SIGNUP_WITH_MOBILE,
    SIGNUP_MOBILE_RESEND_OTP,
    SIGNUP_MOBILE_VERIFY_OTP,
} from 'Actions/types';

//Action methods..
import {
    signUpWithMobileSuccess,
    signUpWithMobileFailure,
    signUpMobileResendSuccess,
    signUpMobileResendFailure,
    signUpMobileVerifySuccess,
    signUpMobileVerifyFailure,
} from 'Actions/MyAccount';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Signup Mobile
function* signUpMobileAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/SignUpWithMobile',payload);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpWithMobileSuccess(response));
        } else {
            yield put(signUpWithMobileFailure(response));
        }
    } catch (error) {
        yield put(signUpWithMobileFailure(error));
    }
}

//Function for Resend OTP to Mobile
function* resendOTPMobileAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/ReSendOtpWithMobile',payload);
    
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpMobileResendSuccess(response));
        } else {
            yield put(signUpMobileResendFailure(response));
        }
    } catch (error) {
        yield put(signUpMobileResendFailure(error));
    }
}

//Function for Verify OTP
function* verifyOTPMobileAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/SignUp/MobileOtpVerification',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signUpMobileVerifySuccess(response));
        } else {
            yield put(signUpMobileVerifyFailure(response));
        }
    } catch (error) {
        yield put(signUpMobileVerifyFailure(error));
    }
}

/* Create Sagas method for Signup Mobile */
export function* signUpMobileSagas() {
    yield takeEvery(SIGNUP_WITH_MOBILE, signUpMobileAPI);
}

/* Create Sagas method for Signup Mobile */
export function* resendOTPMobileSagas() {
    yield takeEvery(SIGNUP_MOBILE_RESEND_OTP, resendOTPMobileAPI);
}

/* Create Sagas method for Signup Mobile */
export function* verifyOTPMobileSagas() {
    yield takeEvery(SIGNUP_MOBILE_VERIFY_OTP, verifyOTPMobileAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(signUpMobileSagas),
        fork(resendOTPMobileSagas),
        fork(verifyOTPMobileSagas)
    ]);
}