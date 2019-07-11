/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Updated by : Saloni Rathod(27/03/2019)
 * Affiliate Scheme Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_AFFILIATE_SCHEME,
    EDIT_AFFILIATE_SCHEME,
    CHANGE_AFFILIATE_SCHEME_STATUS,
    LIST_AFFILIATE_SCHEME,
    GET_BY_ID_AFFILIATE_SCHEME
} from "Actions/types";

import {
    addAffiliateSchemeSuccess,
    addAffiliateSchemeFailure,
    editAffiliateSchemeSuccess,
    editAffiliateSchemeFailure,
    changeStatusAffiliateSchemeSuccess,
    changeStatusAffiliateSchemeFailure,
    getAffiliateSchemeListSuccess,
    getAffiliateSchemeListFailure,
    getAffiliateSchemeByIdSuccess,
    getAffiliateSchemeByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Affiliate Scheme API
function* addAffiliateSchemeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/AddAffiliateScheme', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addAffiliateSchemeSuccess(response));
        } else {
            yield put(addAffiliateSchemeFailure(response));
        }
    } catch (error) {
        yield put(addAffiliateSchemeFailure(error));
    }
}

//Function for Edit Affiliate Scheme API
function* editAffiliateSchemeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/UpdateAffiliateScheme', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editAffiliateSchemeSuccess(response));
        } else {
            yield put(editAffiliateSchemeFailure(response));
        }
    } catch (error) {
        yield put(editAffiliateSchemeFailure(error));
    }
}

//Function for List Affiliate Scheme API
function* listAffiliateSchemeAPI({payload}) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/ListAffiliateScheme/'+payload.PageNo+'?PageSize='+payload.PageSize, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeListSuccess(response));
        } else {
            yield put(getAffiliateSchemeListFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeListFailure(error));
    }
}

//Function for Get By ID Affiliate Scheme API
function* getByIdAffiliateSchemeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiliateSchemeById/'+ payload.SchemeMasterId, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliateSchemeByIdSuccess(response));
        } else {
            yield put(getAffiliateSchemeByIdFailure(response));
        }
    } catch (error) {
        yield put(getAffiliateSchemeByIdFailure(error));
    }
}

//Function for Change Status Affiliate Scheme API
function* changeStatusAffiliateSchemeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/ChangeAffiliateSchemeStatus' , payload, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusAffiliateSchemeSuccess(response));
        } else {
            yield put(changeStatusAffiliateSchemeFailure(response));
        }
    } catch (error) {
        yield put(changeStatusAffiliateSchemeFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Scheme */
export function* addAffiliateSchemeSagas() {
    yield takeEvery(ADD_AFFILIATE_SCHEME, addAffiliateSchemeAPI);
}

/* Create Sagas method for Edit Affiliate Scheme */
export function* editAffiliateSchemeSagas() {
    yield takeEvery(EDIT_AFFILIATE_SCHEME, editAffiliateSchemeAPI);
}

/* Create Sagas method for List Affiliate Scheme */
export function* listAffiliateSchemeSagas() {
    yield takeEvery(LIST_AFFILIATE_SCHEME, listAffiliateSchemeAPI);
}

/* Create Sagas method for Get By ID Affiliate Scheme */
export function* getByIdAffiliateSchemeSagas() {
    yield takeEvery(GET_BY_ID_AFFILIATE_SCHEME, getByIdAffiliateSchemeAPI);
}

/* Create Sagas method for Change Status Affiliate Scheme */
export function* changeStatusAffiliateSchemeSagas() {
    yield takeEvery(CHANGE_AFFILIATE_SCHEME_STATUS, changeStatusAffiliateSchemeAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addAffiliateSchemeSagas),
        fork(editAffiliateSchemeSagas),
        fork(listAffiliateSchemeSagas),
        fork(getByIdAffiliateSchemeSagas),
        fork(changeStatusAffiliateSchemeSagas),
    ]);
}