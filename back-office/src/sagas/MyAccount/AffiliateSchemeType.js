/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Affiliate Scheme Type Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_AFFILIATE_SCHEME_TYPE,
    EDIT_AFFILIATE_SCHEME_TYPE,
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS,
    LIST_AFFILIATE_SCHEME_TYPE,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE,
} from "Actions/types";

import {
    addAffiliateSchemeTypeSuccess,
    addAffiliateSchemeTypeFailure,
    editAffiliateSchemeTypeSuccess,
    editAffiliateSchemeTypeFailure,
    changeStatusAffiliateSchemeTypeSuccess,
    changeStatusAffiliateSchemeTypeFailure,
    getAffiliateSchemeTypeListSuccess,
    getAffiliateSchemeTypeListFailure,
    getAffiliateSchemeTypeByIdSuccess,
    getAffiliateSchemeTypeByIdFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Affiliate Scheme Type API
function* addAffiliateSchemeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/AddAffiliateSchemeType', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addAffiliateSchemeTypeSuccess(response));
        } else {
            yield put(addAffiliateSchemeTypeFailure(response));
        }
    } catch (error) {
        yield put(addAffiliateSchemeTypeFailure(error));
    }
}

//Function for Edit Affiliate Scheme Type API
function* editAffiliateSchemeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/UpdateAffiliateSchemeType', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editAffiliateSchemeTypeSuccess(response));
        } else {
            yield put(editAffiliateSchemeTypeFailure(response));
        }
    } catch (error) {
        yield put(editAffiliateSchemeTypeFailure(error));
    }
}

//Function for List Affiliate Scheme Type API
function* listAffiliateSchemeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/ListAffiliateSchemeType/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeTypeListSuccess(response));
        } else {
            yield put(getAffiliateSchemeTypeListFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeTypeListFailure(error));
    }
}

//Function for Get By ID Affiliate Scheme Type API
function* getByIdAffiliateSchemeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiliateSchemeTypeById/' + payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeTypeByIdSuccess(response));
        } else {
            yield put(getAffiliateSchemeTypeByIdFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeTypeByIdFailure(error));
    }
}

//Function for Change Status Affiliate Scheme Type API
function* changeStatusAffiliateSchemeTypeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/ChangeAffiliateSchemeTypeStatus', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusAffiliateSchemeTypeSuccess(response));
        } else {
            yield put(changeStatusAffiliateSchemeTypeFailure(response));
        }
    } catch (error) {
        yield put(changeStatusAffiliateSchemeTypeFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Scheme Type */
export function* addAffiliateSchemeTypeSagas() {
    yield takeEvery(ADD_AFFILIATE_SCHEME_TYPE, addAffiliateSchemeTypeAPI);
}

/* Create Sagas method for Edit Affiliate Scheme Type */
export function* editAffiliateSchemeTypeSagas() {
    yield takeEvery(EDIT_AFFILIATE_SCHEME_TYPE, editAffiliateSchemeTypeAPI);
}

/* Create Sagas method for List Affiliate Scheme Type */
export function* listAffiliateSchemeTypeSagas() {
    yield takeEvery(LIST_AFFILIATE_SCHEME_TYPE, listAffiliateSchemeTypeAPI);
}

/* Create Sagas method for Get By ID Affiliate Scheme Type */
export function* getByIdAffiliateSchemeTypeSagas() {
    yield takeEvery(GET_BY_ID_AFFILIATE_SCHEME_TYPE, getByIdAffiliateSchemeTypeAPI);
}

/* Create Sagas method for Change Status Affiliate Scheme Type */
export function* changeStatusAffiliateSchemeTypeSagas() {
    yield takeEvery(CHANGE_AFFILIATE_SCHEME_TYPE_STATUS, changeStatusAffiliateSchemeTypeAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addAffiliateSchemeTypeSagas),
        fork(editAffiliateSchemeTypeSagas),
        fork(listAffiliateSchemeTypeSagas),
        fork(getByIdAffiliateSchemeTypeSagas),
        fork(changeStatusAffiliateSchemeTypeSagas),
    ]);
}