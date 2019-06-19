/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Normal Login Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import { NORMAL_LOGIN } from 'Actions/types';
//Action methods..
import { normalLoginSuccess, normalLoginFailure } from 'Actions/MyAccount';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for Normal Register
function* normalLoginAPI({payload}) {
    const response = yield call(swaggerPostAPI,'api/Signin/StandardLogin',payload);
    // const response = yield call(swaggerPostAPI,'api/Signin/BackOfficeStandardLoginV1',payload);
    // console.log('Login Request',payload);
    // console.log('Login Response',response);
    try {
        if(response.ReturnCode === 0) {
            yield put(normalLoginSuccess(response));
        } else {
            yield put(normalLoginFailure(response));
        }
    } catch (error) {
        yield put(normalLoginFailure(error));
    }
}

/* Create Sagas method for Normal Login */
export function* normalLoginSagas() {
    yield takeEvery(NORMAL_LOGIN, normalLoginAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(normalLoginSagas)
    ]);
}