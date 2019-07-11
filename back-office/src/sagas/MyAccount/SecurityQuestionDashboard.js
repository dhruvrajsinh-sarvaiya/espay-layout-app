/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount Security Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { ADD_SECURITY_QUESTION_DASHBOARD } from "Actions/types";
import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';
// import functions from action
import { addSecurityQuestionDataSuccess, addSecurityQuestionDataFailure } from "Actions/MyAccount";

//Function for Add Complain API
function* addSecurityQuestionDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/BackOffice/SecurityQuestionAdd', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addSecurityQuestionDataSuccess(response));
        } else {
            yield put(addSecurityQuestionDataFailure(response));
        }
    } catch (error) {
        yield put(addSecurityQuestionDataFailure(error));
    }
}

/* Create Sagas method for Add Security Question Configuration */
export function* addSecurityQuestionData() {
    yield takeEvery(ADD_SECURITY_QUESTION_DASHBOARD, addSecurityQuestionDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addSecurityQuestionData),
    ]);
}