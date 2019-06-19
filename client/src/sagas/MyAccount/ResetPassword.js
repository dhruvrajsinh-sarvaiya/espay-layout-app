/**
 * Auther : Kevin Ladani
 * Updated By : Salim Deraiya
 * Created : 16/10/2018
 * Reset Password Actions
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { RESET_PASSWORD } from "Actions/types";

import {
  resetPasswordSuccess,
  resetPasswordFailure
} from "Actions";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

//Function for Reset Password
function* resetPasswordAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Manage/setpassword',payload);
    
    try {
        if(response.statusCode === 200) {
            yield put(resetPasswordSuccess(response));
        } else {
            yield put(resetPasswordFailure(response));
        }
    } catch (error) {
        yield put(resetPasswordFailure(error));
    }
}

/* Create Sagas method for Signup Mobile */
export function* resetPasswordSagas() {
  yield takeEvery(RESET_PASSWORD, resetPasswordAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
      fork(resetPasswordSagas)
  ]);
}