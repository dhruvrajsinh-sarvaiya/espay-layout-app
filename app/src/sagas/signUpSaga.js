import { put, call, takeLatest } from 'redux-saga/effects';
import {
    EMAIL_SIGNUP,
    EMAIL_SIGNUP_SUCCESS,
    EMAIL_SIGNUP_FAILURE,
    VERIFY_SIGNUP_OTP,
    VERIFY_SIGNUP_OTP_SUCCESS,
    VERIFY_SIGNUP_OTP_FAILURE,
    RESEND_OTP,
    RESEND_OTP_SUCCESS,
    RESEND_OTP_FAILURE,
    NORMAL_REGISTER,
    SIGNUP_WITH_MOBILE,
    SIGNUP_MOBILE_RESEND_OTP,
    SIGNUP_MOBILE_VERIFY_OTP,
    SIGNUP_RESEND_CONFIRM_EMAIL,
} from '../actions/ActionTypes';
import { Method } from '../controllers/Constants';
//Action methods..
import {
    normalRegisterSuccess,
    normalRegisterFailure,
    signUpWithMobileSuccess,
    signUpWithMobileFailure,
    signUpMobileResendSuccess,
    signUpMobileResendFailure,
    signUpMobileVerifySuccess,
    signUpMobileVerifyFailure,
    resendConfirmationLinkSuccess,
    resendConfirmationLinkFailure,
} from '../actions/SignUpProcess/signUpAction';
import { swaggerPostAPI, slowInternetStaticResponse } from '../api/helper';
import { getIPAddress } from '../controllers/CommonUtils';

function* onEmailSuccess(action) {
    try {
        // To get IP Address
        action.emailRegisterRequest.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (action.emailRegisterRequest.ipAddress === '') {
            let data = slowInternetStaticResponse()
            // To set Email SignUp success response to reducer
            yield put({ type: EMAIL_SIGNUP_SUCCESS, data });
        } else {

            // To call SignUp with Email api
            const data = yield call(swaggerPostAPI, Method.SignUpWithEmail, action.emailRegisterRequest);
            // To set Email SignUp success response to reducer
            yield put({ type: EMAIL_SIGNUP_SUCCESS, data })
        }
    } catch (e) {
        // To set Email SignUp failure response to reducer
        yield put({ type: EMAIL_SIGNUP_FAILURE })
    }
}

//Function for Resend Confirmation Link
function* resendConfirmationLinkAPI({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Resend confirmation Link success response to reducer
            yield put(resendConfirmationLinkSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend confirmation link api
            const response = yield call(swaggerPostAPI, Method.ReSendRegisterlink, payload);

            // To set Resend confirmation Link success response to reducer
            yield put(resendConfirmationLinkSuccess(response));
        }
    } catch (error) {
        // To set Resend confirmation Link failure response to reducer
        yield put(resendConfirmationLinkFailure(error));
    }
}

//Function Used to call Verify Otp Api in Signup Process
function* onVerifyOTP(action) {

    try {
        // To get IP Address
        action.emailOtpVerifyRequest.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (action.emailOtpVerifyRequest.ipAddress === '') {

            let data = slowInternetStaticResponse()
            // To set Verify OTP using SignUp Email success response to reducer
            yield put({ type: VERIFY_SIGNUP_OTP_SUCCESS, data })
        } else {

            // To call Verify OTP api
            const data = yield call(swaggerPostAPI, Method["EmailOtpVerification.SignUp"], action.emailOtpVerifyRequest);

            // To set Verify OTP using SignUp Email success response to reducer
            yield put({ type: VERIFY_SIGNUP_OTP_SUCCESS, data })
        }
    } catch (e) {
        // To set Verify OTP using SignUp Email failure response to reducer
        yield put({ type: VERIFY_SIGNUP_OTP_FAILURE })
    }
}

//Function Used to call Resend Otp Api in Signup Process
function* onResendOTP(action) {

    try {
        // To get IP Address
        action.emailOtpResendRequest.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (action.emailOtpResendRequest.ipAddress === '') {

            let data = slowInternetStaticResponse()
            // To set Resend OTP using SignUp Email success response to reducer
            yield put({ type: RESEND_OTP_SUCCESS, data })
        } else {

            // To call Resend OTP with Email api
            const data = yield call(swaggerPostAPI, Method["ReSendOtpWithEmail.SignUp"], action.emailOtpResendRequest);

            // To set Resend OTP using SignUp Email success response to reducer
            yield put({ type: RESEND_OTP_SUCCESS, data })
        }
    } catch (e) {
        // To set Resend OTP using SignUp Email failure response to reducer
        yield put({ type: RESEND_OTP_FAILURE })
    }
}

//Function for Normal Register
function* normalRegisterAPI({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            // To set Normal SignUp success response to reducer
            yield put(normalRegisterSuccess(slowInternetStaticResponse()));
        } else {

            // To call normal register api
            const response = yield call(swaggerPostAPI, Method.register, payload);

            // To set Normal SignUp success response to reducer
            yield put(normalRegisterSuccess(response));
        }
    } catch (error) {
        // To set Normal SignUp failure response to reducer
        yield put(normalRegisterFailure(error));
    }
}

//Function for Signup Mobile
function* signUpMobileAPI({ payload }) {

    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set SignUp with Mobile success response to reducer
            yield put(signUpWithMobileSuccess(slowInternetStaticResponse()));
        } else {

            // To call SignUp with Mobile api
            const response = yield call(swaggerPostAPI, Method.SignUpWithMobile, payload);

            // To set SignUp with Mobile success response to reducer
            yield put(signUpWithMobileSuccess(response));
        }
    } catch (error) {
        // To set SignUp with Mobile failure response to reducer
        yield put(signUpWithMobileFailure(error));
    }
}

//Function for Resend OTP to Mobile
function* resendOTPMobileAPI({ payload }) {

    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Resend OTP using SignUp Mobile success response to reducer
            yield put(signUpMobileResendSuccess(slowInternetStaticResponse()));
        } else {

            // To call Resend OTP with Mobile api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithMobile.SignUp"], payload);

            // To set Resend OTP using SignUp Mobile success response to reducer
            yield put(signUpMobileResendSuccess(response));
        }
    } catch (error) {
        // To set Resend OTP using SignUp Mobile failure response to reducer
        yield put(signUpMobileResendFailure(error));
    }
}

//Function for Verify OTP
function* verifyOTPMobileAPI({ payload }) {

    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Verify OTP using SignUp Mobile success response to reducer
            yield put(signUpMobileVerifySuccess(slowInternetStaticResponse()));
        } else {

            // To call Verify OTP with Mobile api
            const response = yield call(swaggerPostAPI, Method["MobileOtpVerification.SignUp"], payload);

            // To set Verify OTP using SignUp Mobile success response to reducer
            yield put(signUpMobileVerifySuccess(response));
        }
    } catch (error) {
        // To set Verify OTP using SignUp Mobile failure response to reducer
        yield put(signUpMobileVerifyFailure(error));
    }
}


function* SignUpSaga() {
    yield takeLatest(EMAIL_SIGNUP, onEmailSuccess)

    //For Verify OTP in SignUp Process
    yield takeLatest(VERIFY_SIGNUP_OTP, onVerifyOTP)

    //For Resend OTP In SignUp Process
    yield takeLatest(RESEND_OTP, onResendOTP)

    //For Normal SignUp
    yield takeLatest(NORMAL_REGISTER, normalRegisterAPI);

    /* Create Sagas method for Signup Mobile */
    yield takeLatest(SIGNUP_WITH_MOBILE, signUpMobileAPI);

    //For Resend OTP In SignUp Mobile Process
    yield takeLatest(SIGNUP_MOBILE_RESEND_OTP, resendOTPMobileAPI);

    //For Verify OTP In SignUp Mobile Process
    yield takeLatest(SIGNUP_MOBILE_VERIFY_OTP, verifyOTPMobileAPI);

    //For Resend confirm Email Address for Already registred user.
    yield takeLatest(SIGNUP_RESEND_CONFIRM_EMAIL, resendConfirmationLinkAPI);
}
export default SignUpSaga;