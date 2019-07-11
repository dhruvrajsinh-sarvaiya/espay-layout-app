/**
 * Auther : Saloni Rathod
 * Created : 1203/2019
 * User Confirmation Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { USER_CONFIRMATION } from 'Actions/types';
//Action methods..
import {
    userConfirmationSuccess,
    userConfirmationFailure
} from 'Actions/MyAccount';

import { swaggerGetAPI } from 'Helpers/helpers';


//Function for User Confirmation
function* userConfirmationAPI({ payload }) {
    const response = yield call(swaggerGetAPI, 'api/BackofficeRoleManagement/ConfirmInvitation?emailConfirmCode=' + payload.emailConfirmCode, payload);

    try {
        if (response.statusCode === 200) {
            yield put(userConfirmationSuccess(response));
        } else {
            yield put(userConfirmationFailure(response));
        }
    } catch (error) {
        yield put(userConfirmationFailure(error));
    }
}

/* Create Sagas method for User Confirmation */
export function* userConfirmationSagas() {
    yield takeEvery(USER_CONFIRMATION, userConfirmationAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(userConfirmationSagas)
    ]);
}