import {
    NORMAL_LOGIN,
    //Action types For SignIn With Email
    SIGNIN_WITH_EMAIL,
    SIGNIN_EMAIL_RESEND_OTP,
    SIGNIN_EMAIL_VERIFY_OTP,
    //Action types For SignIn With Mobile
    SIGNIN_WITH_MOBILE,
    SIGNIN_MOBILE_RESEND_OTP,
    SIGNIN_MOBILE_VERIFY_OTP,
    //For 2FA Verify
    TWO_FA_GOOGLE_AUTHENTICATION,
    SOCIAL_LOGIN,
    SOCIAL_FACEBOOK_LOGIN
} from '../actions/ActionTypes'

//Action methods..
import {
    normalLoginSuccess,
    normalLoginFailure,

    //Action method For SignIn With Email
    signInWithEmailSuccess,
    signInWithEmailFailure,
    signInEmailResendSuccess,
    signInEmailResendFailure,
    signInEmailVerifySuccess,
    signInEmailVerifyFailure,
    //Action method For SignIn With Mobile
    signInWithMobileSuccess,
    signInWithMobileFailure,
    signInMobileResendSuccess,
    signInMobileResendFailure,
    signInMobileVerifySuccess,
    signInMobileVerifyFailure,
    //For 2FA Verify
    twoFAGoogleAuthenticationSuccess,
    twoFAGoogleAuthenticationFailure,
    socialLoginSuccess,
    socialLoginFailure,
    socialFacebookLoginSuccess,
    socialFacebookLoginFailure
} from '../actions/Login/loginAction';

import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { swaggerPostAPI, slowInternetStaticResponse } from '../api/helper';
import { getIPAddress } from '../controllers/CommonUtils';

// Generator for Social Login
function* socialLoginAPI({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(socialLoginSuccess(slowInternetStaticResponse()));
        } else {
            var swapperUrl = '';

            // Check if provider name is google or not
            if (payload.ProviderName === 'Google') {
                swapperUrl = Method.ExternalLoginForGoogle;
            }

            // To call Social Login api
            const data = yield call(swaggerPostAPI, swapperUrl, payload);

            // To set Social Login success response to reducer
            yield put(socialLoginSuccess(data));
        }
    } catch (error) {
        // To set Social Login failure response to reducer
        yield put(socialLoginFailure());
    }
}

// Generator for Social Facebook Login
function* socialFacebookLoginAPI({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(socialFacebookLoginSuccess(slowInternetStaticResponse()));
        } else {
            var swapperUrl = '';

            // Check if provider name is facebook or not
            if (payload.ProviderName === 'Facebook') {
                swapperUrl = Method.ExternalLoginForFacebook;
            }

            // To call Social Facebook Login api
            const data = yield call(swaggerPostAPI, swapperUrl, payload);

            // To set Social Facebook Login success response to reducer
            yield put(socialFacebookLoginSuccess(data));
        }
    } catch (error) {
        // To set Social Facebook Login failure response to reducer
        yield put(socialFacebookLoginFailure());
    }
}

function* verifyGoogleAuthCode(payload) {
    try {
        // To get IP Address
        payload.verifyCodeRequest.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.verifyCodeRequest.ipAddress === '') {
            yield put(twoFAGoogleAuthenticationSuccess(slowInternetStaticResponse()));
        } else {

            // To call Verify Google Auth api
            const response = yield call(swaggerPostAPI, Method.VerifyCode, payload.verifyCodeRequest);

            // To set Verify Google Auth success response to reducer
            yield put(twoFAGoogleAuthenticationSuccess(response));
        }
    } catch (error) {
        // To set Verify Google Auth failure response to reducer
        yield put(twoFAGoogleAuthenticationFailure(error));
    }
}

//Function for Normal Register
function* normalLoginAPI({ payload }) {
    try {

        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Normal Login success response to reducer
            yield put(normalLoginSuccess(slowInternetStaticResponse()));
        } else {

            // To call normal login API response
            const response = yield call(swaggerPostAPI, Method.StandardLogin, payload);

            // To set Normal Login success response to reducer
            yield put(normalLoginSuccess(response));
        }

    } catch (error) {
        // To set Normal Login failure response to reducer
        yield put(normalLoginFailure(error));
    }
}

//Function for SignIn Email
function* signInEmailAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set SignIn With Email success response to reducer
            yield put(signInWithEmailSuccess(slowInternetStaticResponse()));
        } else {

            // To call SignIn with Email api
            const response = yield call(swaggerPostAPI, Method.LoginWithEmail, payload);

            // To set SignIn With Email success response to reducer
            yield put(signInWithEmailSuccess(response));
        }
    } catch (error) {
        // To set SignIn With Email failure response to reducer
        yield put(signInWithEmailFailure(error));
    }
}


//Function for Resend OTP to Email
function* resendEmailOTPAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Signin Email with OTP success response to reducer
            yield put(signInEmailResendSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend Email OTP api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithEmail.SignIn"], payload);

            // To set Signin Email with OTP success response to reducer
            yield put(signInEmailResendSuccess(response));
        }
    } catch (error) {
        // To set Signin Email with OTP failure response to reducer
        yield put(signInEmailResendFailure(error));
    }
}

//Function for Verify Email OTP
function* verifyEmailOTPAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Verify OTP using SignIn Email success response to reducer
            yield put(signInEmailVerifySuccess(slowInternetStaticResponse()));
        } else {

            // To call Verify Email OTP api
            const response = yield call(swaggerPostAPI, Method["EmailOtpVerification.SignIn"], payload);

            // To set Verify OTP using SignIn Email success response to reducer
            yield put(signInEmailVerifySuccess(response));
        }
    } catch (error) {
        // To set Verify OTP using SignIn Email failure response to reducer
        yield put(signInEmailVerifyFailure(error));
    }
}

//Function for SignIn with Mobile
function* signInMobileAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set SignIn with Mobile success response to reducer
            yield put(signInWithMobileSuccess(slowInternetStaticResponse()));
        } else {

            // To call SignIn With Mobile api
            const response = yield call(swaggerPostAPI, Method.LoginWithMobile, payload);

            // To set SignIn with Mobile success response to reducer
            yield put(signInWithMobileSuccess(response));
        }
    } catch (error) {
        // To set SignIn with Mobile failure response to reducer
        yield put(signInWithMobileFailure(error));
    }
}

//Function for SignIn Resend OTP to Mobile
function* resendMobileOTPAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Resend OTP using Signin with Mobile success response to reducer
            yield put(signInMobileResendSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend Mobile OTP api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithMobile.SignIn"], payload);

            // To set Resend OTP using Signin with Mobile success response to reducer
            yield put(signInMobileResendSuccess(response));
        }
    } catch (error) {
        // To set Resend OTP using Signin with Mobile failure response to reducer
        yield put(signInMobileResendFailure(error));
    }
}

//Function for SignIn Verify Mobile OTP
function* verifyMobileOTPAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Verify OTP using SignIn Mobile success response to reducer
            yield put(signInMobileVerifySuccess(slowInternetStaticResponse()));
        } else {

            // To call Verify Signin OTP api
            const response = yield call(swaggerPostAPI, Method["MobileOtpVerification.SignIn"], payload);

            // To set Verify OTP using SignIn Mobile success response to reducer
            yield put(signInMobileVerifySuccess(response));
        }
    } catch (error) {
        // To set Verify OTP using SignIn Mobile failure response to reducer
        yield put(signInMobileVerifyFailure(error));
    }
}


function* loginSaga() {
    yield takeLatest(TWO_FA_GOOGLE_AUTHENTICATION, verifyGoogleAuthCode)

    //To register Normal Login
    yield takeLatest(NORMAL_LOGIN, normalLoginAPI);

    // To register SignIn with Email
    yield takeLatest(SIGNIN_WITH_EMAIL, signInEmailAPI);

    // To register Resend Email Otp in SignIn with Email
    yield takeLatest(SIGNIN_EMAIL_RESEND_OTP, resendEmailOTPAPI);

    // To register Verify Otp In SignIn with Email
    yield takeLatest(SIGNIN_EMAIL_VERIFY_OTP, verifyEmailOTPAPI);

    // To register SignIn With Mobile
    yield takeLatest(SIGNIN_WITH_MOBILE, signInMobileAPI);

    // To register Resend Mobile Otp in Sign In With Mobile
    yield takeLatest(SIGNIN_MOBILE_RESEND_OTP, resendMobileOTPAPI);

    // To register Verify Otp In SignIn with Mobile
    yield takeLatest(SIGNIN_MOBILE_VERIFY_OTP, verifyMobileOTPAPI);

    //  To register Social Login with Google
    yield takeLatest(SOCIAL_LOGIN, socialLoginAPI)

    //  To register Social Login with Facebook
    yield takeLatest(SOCIAL_FACEBOOK_LOGIN, socialFacebookLoginAPI)
}

export default loginSaga;