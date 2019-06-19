/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * SignIn Mobile With OTP Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    SIGNIN_WITH_MOBILE,
    SIGNIN_MOBILE_RESEND_OTP,
    SIGNIN_MOBILE_VERIFY_OTP
} from 'Actions/types';

//Action methods..
import {
    signInWithMobileSuccess,
    signInWithMobileFailure,
    signInMobileResendSuccess,
    signInMobileResendFailure,
    signInMobileVerifySuccess,
    signInMobileVerifyFailure,
} from 'Actions/MyAccount';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for SignIn Email
function* signInMobileAPI({payload}) {
    // const response = yield call(swaggerPostAPI,'api/Signin/LoginWithMobile',payload);
    const response = yield call(swaggerPostAPI,'api/Signin/LoginWithMobileV1',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signInWithMobileSuccess(response));
        } else {
            yield put(signInWithMobileFailure(response));
        }
    } catch (error) {
        yield put(signInWithMobileFailure(error));
    }
}

//Function for Resend OTP to Email
function* resendOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/ReSendOtpWithMobile',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signInMobileResendSuccess(response));
        } else {
            yield put(signInMobileResendFailure(response));
        }
    } catch (error) {
        yield put(signInMobileResendFailure(error));
    }
}

//Function for Verify OTP
function* verifyOTPAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/MobileOtpVerification',payload);
    try {
        if(response.ReturnCode === 0) {
            yield put(signInMobileVerifySuccess(response));
        } else {
            yield put(signInMobileVerifyFailure(response));
        }
    } catch (error) {
        yield put(signInMobileVerifyFailure(error));
    }
}

/* Create Sagas method for SignIn Email */
export function* signInMobileSagas() {
    yield takeEvery(SIGNIN_WITH_MOBILE, signInMobileAPI);
}

/* Create Sagas method for SignIn Email */
export function* resendOTPSagas() {
    yield takeEvery(SIGNIN_MOBILE_RESEND_OTP, resendOTPAPI);
}

/* Create Sagas method for SignIn Email */
export function* verifyOTPSagas() {
    yield takeEvery(SIGNIN_MOBILE_VERIFY_OTP, verifyOTPAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(signInMobileSagas),
        fork(resendOTPSagas),
        fork(verifyOTPSagas),
    ]);
}