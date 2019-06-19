/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Forgot Password Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
//Action Types..
import { FORGOT_PASSWORD } from 'Actions/types';
//Action methods..
import {
    forgotPasswordSuccess,
    forgotPasswordFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Forgot Password API
function* forgotPasswordAPI({payload}) {
    //console.log("Request",payload);
    const response = yield call(swaggerPostAPI,'api/Signin/ForgotPassword',payload);
    //console.log("Response",response);
    try {
        
        if(response.ReturnCode === 0) {
            yield put(forgotPasswordSuccess(response));
        } else {
            yield put(forgotPasswordFailure(response));
        }
    } catch (error) {
        yield put(forgotPasswordFailure(error));
    }
}

/* Create Sagas method for Forgot Password */
export function* forgotPasswordSagas() {
    yield takeEvery(FORGOT_PASSWORD, forgotPasswordAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(forgotPasswordSagas)
    ]);
}
