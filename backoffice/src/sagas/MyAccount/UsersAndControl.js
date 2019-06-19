/*
    Developer : Bharat Jograna
    Date : 18-02-2019
    update by :
    File Comment : Users and Control Saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { USERS_ROLE_ASSIGN_HISTORY, USERS_ADD_ROLE, USERS_LIST_ROLE } from "Actions/types";
// import functions from action
import {
    roleAssignHistorySuccess, roleAssignHistoryFailure, addRoleSuccess, addRoleFailure, listRoleSuccess, listRoleFailure
} from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';

const response = {
    "referral":
        [
            {
                "Id": 58,
                "ipaddress": "192.168.1.3",
                "username": "bharat",
                "module": "role",
                "modificationdetail": "",
                "status": "created",
                "Createddate": "2019-02-08T05:56:47.3095165"
            },
            {
                "Id": 57,
                "ipaddress": "192.168.1.2",
                "username": "bharatrj",
                "module": "user",
                "modificationdetail": "",
                "status": "updated",
                "Createddate": "2019-01-31T11:35:45.4160353"
            },
            {
                "Id": 56,
                "ipaddress": "192.168.1.1",
                "username": "BharatJograna",
                "module": "group",
                "modificationdetail": "",
                "status": "created",
                "Createddate": "2019-01-24T13:54:36.6431853"
            }],
    "TotalCount": 3,
    "ReturnCode": 0,
    "ReturnMsg": "Successfully get Referral Report filter data.",
    "ErrorCode": 0,
    "statusCode": 200
}

const roleList = {
    "data": [{
        "Id": 56,
        "ipaddress": "192.168.1.1",
        "username": "BharatJograna",
        "module": "group",
        "modificationdetail": "",
        "status": "created",
        "Createddate": "2019-01-24T13:54:36.6431853"
    }],
    "ReturnCode": 0,
}

//Function for Buy Trade Report Configuration API
function* roleAssignHistoryAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(roleAssignHistorySuccess(response));
        } else {
            yield put(roleAssignHistoryFailure(response));
        }
    } catch (error) {
        yield put(roleAssignHistoryFailure(error));
    }
}
/* Create Sagas method for Buy Trade Report Configuration */
export function* userRoleAssignHistory() {
    yield takeEvery(USERS_ROLE_ASSIGN_HISTORY, roleAssignHistoryAPI);
}


//Function for User Role Add Report Configuration API
function* userRoleAddAPI({ payload }) {
    // console.log("74 saga payload:", payload)
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(addRoleSuccess(response));
        } else {
            yield put(addRoleFailure(response));
        }
    } catch (error) {
        yield put(addRoleFailure(error));
    }
}
/* Create Sagas method for User role Add Report Configuration */
export function* userRoleAdd() {
    yield takeEvery(USERS_ADD_ROLE, userRoleAddAPI);
}


//Function for User Role List Report Configuration API
function* userRoleListAPI({ payload }) {
    // var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, '/api/Manage/changepassword', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(listRoleSuccess(roleList));
        } else {
            yield put(listRoleFailure(roleList));
        }
    } catch (error) {
        yield put(listRoleFailure(error));
    }
}
/* Create Sagas method for User role List Report Configuration */
export function* userRoleList() {
    yield takeEvery(USERS_LIST_ROLE, userRoleListAPI);
}

export default function* rootSaga() {
    yield all([
        fork(userRoleAssignHistory),
        fork(userRoleAdd),
        fork(userRoleList),
    ]);
}
