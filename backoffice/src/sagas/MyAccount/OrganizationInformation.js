/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : Organization Information Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { GET_ORGANIZATION_INFO, ADD_ORGANIZATION_INFO, EDIT_ORGANIZATION_INFO } from "Actions/types";
// import functions from action
import {
    getOrganizationSuccess,
    getOrganizationFailure,
    addOrganizationSuccess,
    addOrganizationFailure,
    editOrganizationSuccess,
    editOrganizationFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

// //Display Organization Data
function* getOrganizationDataAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeOrganization/OrganizationInfo', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getOrganizationSuccess(response));
            // console.log(response);
        } else {
            yield put(getOrganizationFailure(response));
        }
    } catch (error) {
        yield put(getOrganizationFailure(error));
    }
}

//Add Organization Data
function* addOrganizationDataAPI() {
    try {
        yield put(addOrganizationSuccess(response));
    } catch (error) {
        yield put(addOrganizationFailure(error));
    }
}

//Add Organization Data
function* editOrganizationDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeOrganization/OrganizationInfo', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editOrganizationSuccess(response));
            // console.log("Add Saga Response:", response)
        } else {
            yield put(editOrganizationFailure(response));
        }
    } catch (error) {
        yield put(editOrganizationFailure(error));
    }
}


// //Edit Organization Data
// function* editOrganizationDataAPI() {
//     try {
//         yield put(editOrganizationSuccess(response));
//     } catch (error) {
//         yield put(editOrganizationFailure(error));
//     }
// }

//Display Organization Data
function* getOrganizationData() {
    yield takeEvery(GET_ORGANIZATION_INFO, getOrganizationDataAPI);
}

//Add Organization Data
function* addOrganizationData() {
    yield takeEvery(ADD_ORGANIZATION_INFO, addOrganizationDataAPI);
}

//Edit Organization Data
function* editOrganizationData() {
    yield takeEvery(EDIT_ORGANIZATION_INFO, editOrganizationDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getOrganizationData),
        fork(addOrganizationData),
        fork(editOrganizationData)
    ]);
}