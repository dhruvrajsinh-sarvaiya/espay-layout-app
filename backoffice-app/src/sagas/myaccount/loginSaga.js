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
} from '../../actions/ActionTypes'

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
} from '../../actions/Login/loginAction';

import { put, call, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../../controllers/Methods';
import { swaggerPostAPI, slowInternetStaticResponse } from '../../api/helper';
import { getIPAddress } from '../../controllers/CommonUtils';
import { userAccessToken } from '../../selector';

// Generator for Social Login
function* socialLoginAPI({ payload }) {
    try {
        let swapperUrl = '';

        // Check provider name is google or not
        if (payload.ProviderName === 'Google') {
            swapperUrl = Method.ExternalLoginForGoogle;
        }

        // To call Social Login Request Data Api
        const data = yield call(swaggerPostAPI, swapperUrl, payload)

        // To set Social Login success response to reducer
        yield put(socialLoginSuccess(data));
    } catch (error) {
        // To set Social Login failure response to reducer
        yield put(socialLoginFailure());
    }
}

// Generator for Social Facebook Login
function* socialFacebookLoginAPI({ payload }) {
    try {
        let swapperUrl = '';

        // Check provider name is Facebook or not
        if (payload.ProviderName === 'Facebook') {
            swapperUrl = Method.ExternalLoginForFacebook;
        }

        // To call Social Facebook Login Request Data Api
        const data = yield call(swaggerPostAPI, swapperUrl, payload);

        // To set Social Facebook Login success response to reducer
        yield put(socialFacebookLoginSuccess(data));
    } catch (error) {
        // To set Social Facebook Login failure response to reducer
        yield put(socialFacebookLoginFailure());
    }
}

// Generator for Verify Google Auth
function* verifyGoogleAuthCode(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Verify Google Auth Request Data Api
        const response = yield call(swaggerPostAPI, Method.TwoFAVerifyCode, payload.verifyCodeRequest, headers);

        // To set Verify Google Auth success response to reducer
        yield put(twoFAGoogleAuthenticationSuccess(response));

    } catch (error) {
        // To set Verify Google Auth failure response to reducer
        yield put(twoFAGoogleAuthenticationFailure(error));
    }
}

// Generator for Normal Register
function* normalLoginAPI({ payload }) {
    try {

        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(normalLoginSuccess(slowInternetStaticResponse()));
        } else {

            // To call Normal Login Request Data Api
            const response = yield call(swaggerPostAPI, Method.StandardLogin, payload);

            // To set Normal Login success response to reducer
            yield put(normalLoginSuccess(response));
        }

    } catch (error) {
        // To set Normal Login failure response to reducer
        yield put(normalLoginFailure(error));
    }
}

// Generator for SignIn Email
function* signInEmailAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(signInWithEmailSuccess(slowInternetStaticResponse()));
        } else {
            // To call SignIn With Email Request Data Api
            const response = yield call(swaggerPostAPI, Method.LoginWithEmail, payload);

            // To set SignIn With Email success response to reducer
            yield put(signInWithEmailSuccess(response));
        }
    } catch (error) {
        // To set SignIn With Email failure response to reducer
        yield put(signInWithEmailFailure(error));
    }
}

// Generator for Resend OTP to Email
function* resendEmailOTPAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            yield put(signInEmailResendSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend OTP to Email Request Data Api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithEmail.SignIn"], payload);

            // To set Resend OTP to Email success response to reducer
            yield put(signInEmailResendSuccess(response));
        }
    } catch (error) {
        // To set Resend OTP to Email failure response to reducer
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
            yield put(signInEmailVerifySuccess(slowInternetStaticResponse()));
        } else {

            // To call Verify OTP to Email Request Data Api
            const response = yield call(swaggerPostAPI, Method["EmailOtpVerification.SignIn"], payload);

            // To set Verify OTP to Email success response to reducer
            yield put(signInEmailVerifySuccess(response));
        }
    } catch (error) {
        // To set Verify OTP to Email failure response to reducer
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
            yield put(signInWithMobileSuccess(slowInternetStaticResponse()));
        } else {

            // To call SingIn With Mobile Request Data Api
            const response = yield call(swaggerPostAPI, Method.LoginWithMobile, payload);

            // To set SignIn With Mobile success response to reducer
            yield put(signInWithMobileSuccess(response));
        }
    } catch (error) {
        // To set SignIn With Mobile failure response to reducer
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
            yield put(signInMobileResendSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend OTP to Mobile Request Data Api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithMobile.SignIn"], payload);

            // To set Resend OTP to Mobile success response to reducer
            yield put(signInMobileResendSuccess(response));
        }
    } catch (error) {
        // To set Resend OTP to Mobile failure response to reducer
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
            yield put(signInMobileVerifySuccess(slowInternetStaticResponse()));
        } else {
            // To call Verify OTP to Mobile Request Data Api
            const response = yield call(swaggerPostAPI, Method["MobileOtpVerification.SignIn"], payload);

            // To set Verify OTP to Mobile success response to reducer
            yield put(signInMobileVerifySuccess(response));
        }
    } catch (error) {
        yield put(signInMobileVerifyFailure(error));
    }
}

function* loginSaga() {
    yield takeLatest(TWO_FA_GOOGLE_AUTHENTICATION, verifyGoogleAuthCode)

    //For Normal Login
    yield takeLatest(NORMAL_LOGIN, normalLoginAPI);

    //For SignIn with Email
    yield takeLatest(SIGNIN_WITH_EMAIL, signInEmailAPI);

    //For Resend Email Otp in SignIn with Email
    yield takeLatest(SIGNIN_EMAIL_RESEND_OTP, resendEmailOTPAPI);

    //For Verify Otp In SignIn with Email
    yield takeLatest(SIGNIN_EMAIL_VERIFY_OTP, verifyEmailOTPAPI);

    //For SignIn With Mobile
    yield takeLatest(SIGNIN_WITH_MOBILE, signInMobileAPI);

    //For Resend Mobile Otp in Sign In With Mobile
    yield takeLatest(SIGNIN_MOBILE_RESEND_OTP, resendMobileOTPAPI);

    //For Verify Otp In SignIn with Mobile
    yield takeLatest(SIGNIN_MOBILE_VERIFY_OTP, verifyMobileOTPAPI);

    // For Social Login with Google
    yield takeLatest(SOCIAL_LOGIN, socialLoginAPI)

    // For Social Login with Facebook
    yield takeLatest(SOCIAL_FACEBOOK_LOGIN, socialFacebookLoginAPI)
}

export default loginSaga;