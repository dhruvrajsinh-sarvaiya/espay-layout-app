/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING,
} from "Actions/types";

import {
    addAffiliateSchemeTypeMappingSuccess,
    addAffiliateSchemeTypeMappingFailure,
    editAffiliateSchemeTypeMappingSuccess,
    editAffiliateSchemeTypeMappingFailure,
    changeStatusAffiliateSchemeTypeMappingSuccess,
    changeStatusAffiliateSchemeTypeMappingFailure,
    getAffiliateSchemeTypeMappingListSuccess,
    getAffiliateSchemeTypeMappingListFailure,
    getAffiliateSchemeTypeMappingByIdSuccess,
    getAffiliateSchemeTypeMappingByIdFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Affiliate Scheme Type API
function* addAffiliateSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/AddAffiliateSchemeTypeMapping', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addAffiliateSchemeTypeMappingSuccess(response));
        } else {
            yield put(addAffiliateSchemeTypeMappingFailure(response));
        }
    } catch (error) {
        yield put(addAffiliateSchemeTypeMappingFailure(error));
    }
}

//Function for Edit Affiliate Scheme Type API
function* editAffiliateSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/UpdateAffiliateSchemeTypeMapping', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editAffiliateSchemeTypeMappingSuccess(response));
        } else {
            yield put(editAffiliateSchemeTypeMappingFailure(response));
        }
    } catch (error) {
        yield put(editAffiliateSchemeTypeMappingFailure(error));
    }
}

//Function for List Affiliate Scheme Type API
function* listAffiliateSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/ListAffiliateSchemeTypeMapping/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);
    // if else to add url
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeTypeMappingListSuccess(response));
        } else {
            yield put(getAffiliateSchemeTypeMappingListFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeTypeMappingListFailure(error));
    }
}

//Function for Get By ID Affiliate Scheme Type API
function* getByIdAffiliateSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiliateSchemeTypeMapping', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeTypeMappingByIdSuccess(response));
        } else {
            yield put(getAffiliateSchemeTypeMappingByIdFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeTypeMappingByIdFailure(error));
    }
}

//Function for Change Status Affiliate Scheme Type API
function* changeStatusAffiliateSchemeTypeMappingAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/ChangeAffiliateSchemeTypeMappingStatus', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusAffiliateSchemeTypeMappingSuccess(response));
        } else {
            yield put(changeStatusAffiliateSchemeTypeMappingFailure(response));
        }
    } catch (error) {
        yield put(changeStatusAffiliateSchemeTypeMappingFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Scheme Type */
export function* addAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(ADD_AFFILIATE_SCHEME_TYPE_MAPPING, addAffiliateSchemeTypeMappingAPI);
}

/* Create Sagas method for Edit Affiliate Scheme Type */
export function* editAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(EDIT_AFFILIATE_SCHEME_TYPE_MAPPING, editAffiliateSchemeTypeMappingAPI);
}

/* Create Sagas method for List Affiliate Scheme Type */
export function* listAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(LIST_AFFILIATE_SCHEME_TYPE_MAPPING, listAffiliateSchemeTypeMappingAPI);
}

/* Create Sagas method for Get By ID Affiliate Scheme Type */
export function* getByIdAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING, getByIdAffiliateSchemeTypeMappingAPI);
}

/* Create Sagas method for Change Status Affiliate Scheme Type */
export function* changeStatusAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS, changeStatusAffiliateSchemeTypeMappingAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addAffiliateSchemeTypeMappingSagas),
        fork(editAffiliateSchemeTypeMappingSagas),
        fork(listAffiliateSchemeTypeMappingSagas),
        fork(getByIdAffiliateSchemeTypeMappingSagas),
        fork(changeStatusAffiliateSchemeTypeMappingSagas),
    ]);
}