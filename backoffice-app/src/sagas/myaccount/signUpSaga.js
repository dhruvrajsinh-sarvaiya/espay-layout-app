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
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
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
} from '../../actions/SignUpProcess/signUpAction';
import { swaggerPostAPI, slowInternetStaticResponse } from '../../api/helper';
import { getIPAddress } from '../../controllers/CommonUtils';

function* onEmailSuccess(action) {
    try {
        // To get IP Address
        action.emailRegisterRequest.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (action.emailRegisterRequest.ipAddress === '') {
            let data = slowInternetStaticResponse()

            // To set Email Signup success response
            yield put({ type: EMAIL_SIGNUP_SUCCESS, data });
        } else {
            // To call Signup With Email Api Request Data Api
            const data = yield call(swaggerPostAPI, Method.SignUpWithEmail, action.emailRegisterRequest);

            // To set Email Signup success response
            yield put({ type: EMAIL_SIGNUP_SUCCESS, data })
        }
    } catch (e) {
        // To set Email Signup failure response
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
            yield put(resendConfirmationLinkSuccess(slowInternetStaticResponse()));
        } else {
            // To call Resend Confirmation Api Request Data Api
            const response = yield call(swaggerPostAPI, Method.ReSendRegisterlink, payload);

            // To set Resend Email Confirmation Link success response to reducer
            yield put(resendConfirmationLinkSuccess(response));
        }
    } catch (error) {
        // To set Resend Email Confirmation Link failure response to reducer
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

            // To set Verify Signup OTP success response
            yield put({ type: VERIFY_SIGNUP_OTP_SUCCESS, data })
        } else {
            // To call Verify Signup OTP Api Request Data Api
            const data = yield call(swaggerPostAPI, Method["EmailOtpVerification.SignUp"], action.emailOtpVerifyRequest);

            // To set Verify Signup OTP success response
            yield put({ type: VERIFY_SIGNUP_OTP_SUCCESS, data })
        }
    } catch (e) {
        // To set Verify Signup OTP failure response
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

            // To set Resend Signup OTP success response
            yield put({ type: RESEND_OTP_SUCCESS, data })
        } else {
            // To call Resend Signup OTP Api Request Data Api
            const data = yield call(swaggerPostAPI, Method["ReSendOtpWithEmail.SignUp"], action.emailOtpResendRequest);

            // To set Resend Signup OTP success response
            yield put({ type: RESEND_OTP_SUCCESS, data })
        }
    } catch (e) {
        // To set Resend Signup OTP failure response
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
            // To set Normal Register success response to reducer
            yield put(normalRegisterSuccess(slowInternetStaticResponse()));
        } else {
            // To call Normal Register Api Request Data Api
            const response = yield call(swaggerPostAPI, Method.register, payload);

            // To set Normal Register success response to reducer
            yield put(normalRegisterSuccess(response));
        }
    } catch (error) {
        // To set Normal Register failure response
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
            // To set Signup With Mobile success response to reducer
            yield put(signUpWithMobileSuccess(slowInternetStaticResponse()));
        } else {

            // To call Signup With Mobile Api Request Data Api
            const response = yield call(swaggerPostAPI, Method.SignUpWithMobile, payload);

            // To set Signup With Mobile success response to reducer
            yield put(signUpWithMobileSuccess(response));
        }

    } catch (error) {
        // To set Signup With Mobile failure response to reducer
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

            // To set Resend Mobile OTP success response to reducer
            yield put(signUpMobileResendSuccess(slowInternetStaticResponse()));
        } else {
            // To call Resend Mobile OTP Api Request Data Api
            const response = yield call(swaggerPostAPI, Method["ReSendOtpWithMobile.SignUp"], payload);

            // To set Resend Mobile OTP success response to reducer
            yield put(signUpMobileResendSuccess(response));
        }
    } catch (error) {
        // To set Resend Mobile OTP success failure to reducer
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

            // To set Verify Mobile OTP success response to reducer
            yield put(signUpMobileVerifySuccess(slowInternetStaticResponse()));
        } else {
            // To call Verify Mobile OTP Api Request Data Api
            const response = yield call(swaggerPostAPI, Method["MobileOtpVerification.SignUp"], payload);

            // To set Verify Mobile OTP success response to reducer
            yield put(signUpMobileVerifySuccess(response));
        }
        
    } catch (error) {
        // To set Verify Mobile OTP failure response to reducer
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