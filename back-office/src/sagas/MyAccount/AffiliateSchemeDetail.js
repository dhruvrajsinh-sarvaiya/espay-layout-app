/**
 * Author : Saloni Rathod
 * Created : 28/03/2019
 * Affiliate Scheme  Detail Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_AFFILIATE_SCHEME_DETAIL,
    EDIT_AFFILIATE_SCHEME_DETAIL,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    LIST_AFFILIATE_SCHEME_DETAIL,
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL
} from "Actions/types";

import {
    addAffiliateSchemeDetailSuccess,
    addAffiliateSchemeDetailFailure,
    editAffiliateSchemeDetailSuccess,
    editAffiliateSchemeDetailFailure,
    changeStatusAffiliateSchemeDetailSuccess,
    changeStatusAffiliateSchemeDetailFailure,
    getAffiliateSchemeDetailListSuccess,
    getAffiliateSchemeDetailListFailure,
    getAffiliateSchemeDetailByIdSuccess,
    getAffiliateSchemeDetailByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Affiliate Scheme Detail API
function* addAffiliateSchemeDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/AddAffiliateShemeDetail', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addAffiliateSchemeDetailSuccess(response));
        } else {
            yield put(addAffiliateSchemeDetailFailure(response));
        }
    } catch (error) {
        yield put(addAffiliateSchemeDetailFailure(error));
    }
}

//Function for Edit Affiliate Scheme Detail API
function* editAffiliateSchemeDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/UpdateAffiliateShemeDetail', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editAffiliateSchemeDetailSuccess(response));
        } else {
            yield put(editAffiliateSchemeDetailFailure(response));
        }
    } catch (error) {
        yield put(editAffiliateSchemeDetailFailure(error));
    }
}

//Function for List Affiliate Scheme Detail API
function* listAffiliateSchemeDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/ListAffiliateSchemeDetail/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeDetailListSuccess(response));
        } else {
            yield put(getAffiliateSchemeDetailListFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeDetailListFailure(error));
    }
}

//Function for Get By ID Affiliate Scheme Detail API
function* getByIdAffiliateSchemeDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiliateSchemeDetail/' + payload.DetailId, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeDetailByIdSuccess(response));
        } else {
            yield put(getAffiliateSchemeDetailByIdFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeDetailByIdFailure(error));
    }
}

//Function for Change Status Affiliate Scheme Detail API
function* changeStatusAffiliateSchemeDetailAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/ChangeAffiliateShemeDetailStatus', payload, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusAffiliateSchemeDetailSuccess(response));
        } else {
            yield put(changeStatusAffiliateSchemeDetailFailure(response));
        }
    } catch (error) {
        yield put(changeStatusAffiliateSchemeDetailFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Scheme Detail */
export function* addAffiliateSchemeDetailSagas() {
    yield takeEvery(ADD_AFFILIATE_SCHEME_DETAIL, addAffiliateSchemeDetailAPI);
}

/* Create Sagas method for Edit Affiliate Scheme Detail */
export function* editAffiliateSchemeDetailSagas() {
    yield takeEvery(EDIT_AFFILIATE_SCHEME_DETAIL, editAffiliateSchemeDetailAPI);
}

/* Create Sagas method for List Affiliate Scheme Detail */
export function* listAffiliateSchemeDetailSagas() {
    yield takeEvery(LIST_AFFILIATE_SCHEME_DETAIL, listAffiliateSchemeDetailAPI);
}

/* Create Sagas method for Get By ID Affiliate Scheme Detail */
export function* getByIdAffiliateSchemeDetailSagas() {
    yield takeEvery(GET_BY_ID_AFFILIATE_SCHEME_DETAIL, getByIdAffiliateSchemeDetailAPI);
}

/* Create Sagas method for Change Status Affiliate Scheme Detail */
export function* changeStatusAffiliateSchemeDetailSagas() {
    yield takeEvery(CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS, changeStatusAffiliateSchemeDetailAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addAffiliateSchemeDetailSagas),
        fork(editAffiliateSchemeDetailSagas),
        fork(listAffiliateSchemeDetailSagas),
        fork(getByIdAffiliateSchemeDetailSagas),
        fork(changeStatusAffiliateSchemeDetailSagas),
    ]);
}