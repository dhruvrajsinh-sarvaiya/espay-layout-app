/**
 * Auther : Kevin Ladani
 * Created : 27/10/2018
 * Forgot Confirmation Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    FORGOT_CONFIRMATION,
    SET_NEW_PASSWORD
} from 'Actions/types';


//Action methods..
import {
    forgotConfirmationSuccess,
    forgotConfirmationFailure,
    setNewPasswordSuccess,
    setNewPasswordFailure
} from 'Actions/MyAccount';

import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Forgot Confirmation
function* forgotConfirmationAPI({ payload }) {
    const response = yield call(swaggerGetAPI, 'api/Signin/Forgotverifylink?LinkData=' + payload.LinkData, payload);
    try {
        if (response.statusCode === 200) {
            yield put(forgotConfirmationSuccess(response));
        } else {
            yield put(forgotConfirmationFailure(response));
        }
    } catch (error) {
        yield put(forgotConfirmationFailure(error));
    }
}

//Function for Set New Password
function* setNewPasswordAPI({ payload }) {
    const response = yield call(swaggerPostAPI, 'api/Signin/setpassword', payload);
    try {
        if (response.statusCode === 200) {
            yield put(setNewPasswordSuccess(response));
        } else {
            yield put(setNewPasswordFailure(response));
        }
    } catch (error) {
        yield put(setNewPasswordFailure(error));
    }
}

/* Create Sagas method for Normal Login */
export function* forgotConfirmationSagas() {
    yield takeEvery(FORGOT_CONFIRMATION, forgotConfirmationAPI);
}

/* Create Sagas method for Set New Password */
export function* setNewPasswordSagas() {
    yield takeEvery(SET_NEW_PASSWORD, setNewPasswordAPI);
}


/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(forgotConfirmationSagas),
        fork(setNewPasswordSagas)
    ]);
}