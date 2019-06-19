/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Sagas
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
} from "Actions/types";

import {
    getAffiliateSchemeTypeMappingListSuccess,
    getAffiliateSchemeTypeMappingListFailure,
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI } from 'Helpers/helpers';

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

/* Create Sagas method for List Affiliate Scheme Type */
export function* listAffiliateSchemeTypeMappingSagas() {
    yield takeEvery(LIST_AFFILIATE_SCHEME_TYPE_MAPPING, listAffiliateSchemeTypeMappingAPI);
}

export default function* rootSaga() {
    yield all([
        fork(listAffiliateSchemeTypeMappingSagas),
    ]);
}