/**
 * Auther : Salim Deraiya
 * Created : 29/10/2018
 * Email Confirmation Sagas
 */

//Sagas Effects..
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

//Action Types..
import { EMAIL_CONFIRMATION } from 'Actions/types';

//Action methods..
import {
    emailConfirmationSuccess,
    emailConfirmationFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';


//Function for Email Confirmation
function* emailConfirmationAPI({payload}) { 
    const response = yield call(swaggerGetAPI,'api/SignUp/ConfirmEmail?emailConfirmCode='+payload.emailConfirmCode,payload);
    
    try {
        //console.log('Email Res',response);
        if(response.statusCode === 200) {
            yield put(emailConfirmationSuccess(response));
        } else {
            yield put(emailConfirmationFailure(response));
        }
    } catch (error) {
        yield put(emailConfirmationFailure(error));
    }
}

/* Create Sagas method for Email Confirmation */
export function* emailConfirmationSagas() {
    yield takeEvery(EMAIL_CONFIRMATION, emailConfirmationAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(emailConfirmationSagas)
    ]);
}