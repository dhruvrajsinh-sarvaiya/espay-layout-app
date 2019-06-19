/* 
    Developer : Kevin Ladani
    Date : 16-01-2019
    File Comment : MyAccount IPRange Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { LIST_IPRANGE_DASHBOARD, ADD_IPRANGE_DASHBOARD, DELETE_IPRANGE_DASHBOARD } from "Actions/types";
// import functions from action
import {
    getIPRangeDataSuccess,
    getIPRangeDataFailure,
    addIPRangeDataSuccess,
    addIPRangeDataFailure,
    deleteIPRangeDataSuccess,
    deleteIPRangeDataFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display IPRange Data
function* getIPRangeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOffice/GetIpRange?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.PAGE_SIZE, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getIPRangeDataSuccess(response));
        } else {
            yield put(getIPRangeDataFailure(response));
        }
    } catch (error) {
        yield put(getIPRangeDataFailure(error));
    }
}

//Function for Add IPRange Configuration API
function* addIPRangeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOffice/AllowIpRange', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addIPRangeDataSuccess(response));
        } else {
            yield put(addIPRangeDataFailure(response));
        }
    } catch (error) {
        yield put(addIPRangeDataFailure(error));
    }
}

//Function for Delete IPRange Configuration API
function* deleteIPRangeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOffice/DeleteIpRange', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(deleteIPRangeDataSuccess(response));
        } else {
            yield put(deleteIPRangeDataFailure("Error"));
        }
    } catch (error) {
        yield put(deleteIPRangeDataFailure(error));
    }

}

//Display IPRange Data
function* getIPRangeDataValue() {
    yield takeEvery(LIST_IPRANGE_DASHBOARD, getIPRangeDataAPI);
}


/* Create Sagas method for Add IPRange Configuration */
export function* addIPRangeDataValue() {
    yield takeEvery(ADD_IPRANGE_DASHBOARD, addIPRangeDataAPI);
}


/* Create Sagas method for Add IPRange Configuration */
export function* deleteIPRangeDataValue() {
    yield takeEvery(DELETE_IPRANGE_DASHBOARD, deleteIPRangeDataAPI);
}
export default function* rootSaga() {
    yield all([
        fork(getIPRangeDataValue),
        fork(addIPRangeDataValue),
        fork(deleteIPRangeDataValue),
    ]);
}