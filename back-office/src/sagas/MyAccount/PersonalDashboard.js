/* 
    Developer : Kevin Ladani
    Date : 20-12-2018
    File Comment : MyAccount Dashboard Actions
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { GET_PERSONAL_INFO, EDIT_PERSONAL_INFO } from "Actions/types";
// import functions from action
import { getPersonalInfoDataSuccess, getPersonalInfoDataFailure, editPersonalInfoDataSuccess, editPersonalInfoDataFailure } from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Personal Information Data Configuration API
function* getPersonalInfoDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Manage/userinfo', {}, headers);
    try {
        if (response.statusCode === 200) {
            yield put(getPersonalInfoDataSuccess(response));
        } else {
            yield put(getPersonalInfoDataFailure(response));
        }
    } catch (error) {
        yield put(getPersonalInfoDataFailure(error));
    }
}

//Function for Edit Personal Information Data Configuration API
function* editPersonalInfoDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Manage/userinfo', payload, headers);
    try {
        if (response.statusCode === 200) {
            yield put(editPersonalInfoDataSuccess(response));
        } else {
            yield put(editPersonalInfoDataFailure(response));
        }
    } catch (error) {
        yield put(editPersonalInfoDataFailure(error));
    }
}

//Display Personal Information Data 
function* getPersonalInfoData() {
    yield takeEvery(GET_PERSONAL_INFO, getPersonalInfoDataAPI);
}

//Function for Edit Personal Information Data
function* editPersonalInfoData() {
    yield takeEvery(EDIT_PERSONAL_INFO, editPersonalInfoDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getPersonalInfoData),
        fork(editPersonalInfoData)
    ]);
}