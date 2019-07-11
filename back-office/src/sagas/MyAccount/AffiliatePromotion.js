/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Updated by:Saloni Rathod(25/03/2019)
 * Affiliate Promotion Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    ADD_AFFILIATE_PROMOTION,
    EDIT_AFFILIATE_PROMOTION,
    CHANGE_AFFILIATE_PROMOTION_STATUS,
    LIST_AFFILIATE_PROMOTION,
    GET_BY_ID_AFFILIATE_PROMOTION,
} from "Actions/types";

import {
    addAffiliatePromotionSuccess,
    addAffiliatePromotionFailure,
    editAffiliatePromotionSuccess,
    editAffiliatePromotionFailure,
    changeStatusAffiliatePromotionSuccess,
    changeStatusAffiliatePromotionFailure,
    getAffiliatePromotionListSuccess,
    getAffiliatePromotionListFailure,
    getAffiliatePromotionByIdSuccess,
    getAffiliatePromotionByIdFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Function for Add Affiliate Promotion API
function* addAffiliatePromotionAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/AddAffiliatePromotion', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(addAffiliatePromotionSuccess(response));
        } else {
            yield put(addAffiliatePromotionFailure(response));
        }
    } catch (error) {
        yield put(addAffiliatePromotionFailure(error));
    }
}

//Function for Edit Affiliate Promotion API
function* editAffiliatePromotionAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/UpdateAffiliatePromotion', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(editAffiliatePromotionSuccess(response));
        } else {
            yield put(editAffiliatePromotionFailure(response));
        }
    } catch (error) {
        yield put(editAffiliatePromotionFailure(error));
    }
}

//Function for List Affiliate Promotion API
function* listAffiliatePromotionAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // Updated by Saloni Rathod
    const response = yield call(swaggerGetAPI, 'api/AffiliateBackOffice/ListAffiliatePromotion/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliatePromotionListSuccess(response));
        } else {
            yield put(getAffiliatePromotionListFailure(response));
        }
    } catch (error) {
        yield put(getAffiliatePromotionListFailure(error));
    }
}

//Function for Get By ID Affiliate Promotion API
function* getByIdAffiliatePromotionAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    //Updated by Saloni Rathod
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/GetAffiliatePromotionById/' + payload.ID, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getAffiliatePromotionByIdSuccess(response));
        } else {
            yield put(getAffiliatePromotionByIdFailure(response));
        }
    } catch (error) {
        yield put(getAffiliatePromotionByIdFailure(error));
    }
}

//Function for Change Status Affiliate Promotion API
function* changeStatusAffiliatePromotionAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/AffiliateBackOffice/ChangeAffiliatePromotionStatus', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(changeStatusAffiliatePromotionSuccess(response));
        } else {
            yield put(changeStatusAffiliatePromotionFailure(response));
        }
    } catch (error) {
        yield put(changeStatusAffiliatePromotionFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Promotion */
export function* addAffiliatePromotionSagas() {
    yield takeEvery(ADD_AFFILIATE_PROMOTION, addAffiliatePromotionAPI);
}

/* Create Sagas method for Edit Affiliate Promotion */
export function* editAffiliatePromotionSagas() {
    yield takeEvery(EDIT_AFFILIATE_PROMOTION, editAffiliatePromotionAPI);
}

/* Create Sagas method for List Affiliate Promotion */
export function* listAffiliatePromotionSagas() {
    yield takeEvery(LIST_AFFILIATE_PROMOTION, listAffiliatePromotionAPI);
}

/* Create Sagas method for Get By ID Affiliate Promotion */
export function* getByIdAffiliatePromotionSagas() {
    yield takeEvery(GET_BY_ID_AFFILIATE_PROMOTION, getByIdAffiliatePromotionAPI);
}

/* Create Sagas method for Change Status Affiliate Promotion */
export function* changeStatusAffiliatePromotionSagas() {
    yield takeEvery(CHANGE_AFFILIATE_PROMOTION_STATUS, changeStatusAffiliatePromotionAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addAffiliatePromotionSagas),
        fork(editAffiliatePromotionSagas),
        fork(listAffiliatePromotionSagas),
        fork(getByIdAffiliatePromotionSagas),
        fork(changeStatusAffiliatePromotionSagas),
    ]);
}