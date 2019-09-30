import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    ADD_AFFILIATE_SCHEME,
    EDIT_AFFILIATE_SCHEME,
    CHANGE_AFFILIATE_SCHEME_STATUS,
    LIST_AFFILIATE_SCHEME,
} from "../../actions/ActionTypes";

import {
    addAffiliateSchemeSuccess,
    addAffiliateSchemeFailure,
    editAffiliateSchemeSuccess,
    editAffiliateSchemeFailure,
    changeStatusAffiliateSchemeSuccess,
    changeStatusAffiliateSchemeFailure,
    getAffiliateSchemeListSuccess,
    getAffiliateSchemeListFailure,
} from "../../actions/account/AffiliateSchemeAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";

//Function for Add Affiliate Scheme API
function* addAffiliateSchemeAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add affiliate scheme api
        const response = yield call(swaggerPostAPI, Method.AddAffiliateScheme, payload, headers);

        // To set add affiliate scheme success response to reducer
        yield put(addAffiliateSchemeSuccess(response));
    } catch (error) {

        // To set add affiliate scheme failure response to reducer
        yield put(addAffiliateSchemeFailure(error));
    }
}

//Function for Edit Affiliate Scheme API
function* editAffiliateSchemeAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call edit affiliate scheme api
        const response = yield call(swaggerPostAPI, Method.UpdateAffiliateScheme, payload, headers);

        // To set edit affiliate scheme success response to reducer
        yield put(editAffiliateSchemeSuccess(response));
    } catch (error) {

        // To set edit affiliate scheme failure response to reducer
        yield put(editAffiliateSchemeFailure(error));
    }
}

//Function for List Affiliate Scheme API
function* listAffiliateSchemeAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateScheme + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme list success response to reducer
        yield put(getAffiliateSchemeListSuccess(response));
    } catch (error) {

        // To set affiliate scheme list failure response to reducer
        yield put(getAffiliateSchemeListFailure(error));
    }
}

//Function for Change Status Affiliate Scheme API
function* changeStatusAffiliateSchemeAPI({ payload }) {

    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Change status affiliate scheme api
        const response = yield call(swaggerPostAPI, Method.ChangeAffiliateSchemeStatus, payload, {}, headers);

        // To set Change status affiliate scheme success response to reducer
        yield put(changeStatusAffiliateSchemeSuccess(response));
    } catch (error) {

        // To set Change status affiliate scheme failure response to reducer
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

/* Create Sagas method for Change Status Affiliate Scheme */
export function* changeStatusAffiliateSchemeSagas() {
    yield takeEvery(CHANGE_AFFILIATE_SCHEME_STATUS, changeStatusAffiliateSchemeAPI);
}

//root saga middleware
export default function* rootSaga() {
    yield all([
        fork(addAffiliateSchemeSagas),
        fork(editAffiliateSchemeSagas),
        fork(listAffiliateSchemeSagas),
        fork(changeStatusAffiliateSchemeSagas),
    ]);
}