/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount ChangePassword Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { CHANGE_PASSWORD_DASHBOARD } from "Actions/types";
// import functions from action
import { changePasswordDataSuccess, changePasswordDataFailure } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';

//Function for ChangePassword Configuration API
function* changePasswordDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
         if (response.statusCode === 200) {
            yield put(changePasswordDataSuccess(response));
        } else {
            yield put(changePasswordDataFailure(response));
        }
    } catch (error) {
        yield put(changePasswordDataFailure(error));
    }
}

/* Create Sagas method for ChangePassword Configuration */
export function* changePasswordData() {
    yield takeEvery(CHANGE_PASSWORD_DASHBOARD, changePasswordDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(changePasswordData),
    ]);
}