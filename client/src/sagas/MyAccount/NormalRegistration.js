/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Normal Registration Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { NORMAL_REGISTER, RESEND_CONFIRMATION_LINK } from 'Actions/types';
//Action methods..
import {
    normalRegisterSuccess,
    normalRegisterFailure,
    resendConfirmationLinkSuccess,
    resendConfirmationLinkFailure,
} from 'Actions/MyAccount';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Normal Register
function* normalRegisterAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/SignUp/register', payload);
    try {
        if (response.ReturnCode === 0) {
            yield put(normalRegisterSuccess(response));
        } else {
            yield put(normalRegisterFailure(response));
        }
    } catch (error) {
        yield put(normalRegisterFailure(error));
    }
}

//Function for Resend Confirmation Link
function* resendConfirmationLinkAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/SignUp/ReSendRegisterlink', payload);
    try {
        if (response.ReturnCode === 0) {
            yield put(resendConfirmationLinkSuccess(response));
        } else {
            yield put(resendConfirmationLinkFailure(response));
        }
    } catch (error) {
        yield put(resendConfirmationLinkFailure(error));
    }
}

/* Create Sagas method for Normal Register */
export function* normalRegisterSagas() {
    yield takeEvery(NORMAL_REGISTER, normalRegisterAPI);
}

/* Create Sagas method for Resend Confirmation Link */
export function* resendConfirmationLinkSagas() {
    yield takeEvery(RESEND_CONFIRMATION_LINK, resendConfirmationLinkAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(normalRegisterSagas),
        fork(resendConfirmationLinkSagas),
    ]);
}