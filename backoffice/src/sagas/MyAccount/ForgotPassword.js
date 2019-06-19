/**
 * Create By : Sanjay 
 * Created Date: 31/01/2019
 * Forgot Pass Saga
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { FORGOT_PASSWORD_SCREEN } from 'Actions/types';
//Action methods..
import {
    forgotPasswordScreenSuccess,
    forgotPasswordScreenFailure
} from 'Actions/MyAccount';
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Forgot Password API
function* forgotPasswordAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/ForgotPassword',payload);
    try {
        
        if(response.ReturnCode === 0) {
            yield put(forgotPasswordScreenSuccess(response));
        } else {
            yield put(forgotPasswordScreenFailure(response));
        }
    } catch (error) {
        yield put(forgotPasswordScreenFailure(error));
    }
}

/* Create Sagas method for Forgot Password */
export function* forgotPasswordSagas() {
    yield takeEvery(FORGOT_PASSWORD_SCREEN, forgotPasswordAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(forgotPasswordSagas)
    ]);
}
