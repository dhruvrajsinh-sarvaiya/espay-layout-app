// AffiliateSchemeTypeSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    AFFILIATE_SCHEME_TYPE_LIST,
    AFFILIATE_SCHEME_TYPE_STATUS,
    ADD_AFFILIATE_SCHEME_TYPE,
    EDIT_AFFILIATE_SCHEME_TYPE
} from '../../actions/ActionTypes';

import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import {
    affiliateSchemeTypeListSuccess,
    affiliateSchemeTypeListFailure,
    changeAffiliateSchemeTypeStatusSuccess,
    changeAffiliateSchemeTypeStatusFailure,
    addAffiliateSchemeTypeSuccess,
    addAffiliateSchemeTypeFailure,
    editAffiliateSchemeTypeSuccess,
    editAffiliateSchemeTypeFailure
} from '../../actions/account/AffiliateSchemeTypeAction';

function* schemeTypeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeType + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme type list success response to reducer
        yield put(affiliateSchemeTypeListSuccess(response));
    } catch (error) {

        // To set affiliate scheme type list failure response to reducer
        yield put(affiliateSchemeTypeListFailure());
    }
}

function* statusSchemeTypeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type status change api
        const response = yield call(swaggerPostAPI, Method.ChangeAffiliateSchemeTypeStatus, payload, headers);

        // To set affiliate scheme type status change success response to reducer
        yield put(changeAffiliateSchemeTypeStatusSuccess(response));
    } catch (error) {

        // To set affiliate scheme type status change failure response to reducer
        yield put(changeAffiliateSchemeTypeStatusFailure());
    }
}

function* addSchemeTypeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type add api
        const response = yield call(swaggerPostAPI, Method.AddAffiliateSchemeType, payload, headers);

        // To set affiliate scheme type add success response to reducer
        yield put(addAffiliateSchemeTypeSuccess(response));
    } catch (error) {

        // To set affiliate scheme type add failure response to reducer
        yield put(addAffiliateSchemeTypeFailure());
    }
}

function* editSchemeTypeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type edit api
        const response = yield call(swaggerPostAPI, Method.UpdateAffiliateSchemeType, payload, headers);

        // To set affiliate scheme type edit success response to reducer
        yield put(editAffiliateSchemeTypeSuccess(response));
    } catch (error) {

        // To set affiliate scheme type edit failure response to reducer
        yield put(editAffiliateSchemeTypeFailure());
    }
}

//call api's
function* AffiliateSchemeTypeSaga() {
    yield takeLatest(AFFILIATE_SCHEME_TYPE_LIST, schemeTypeDataRequest)
    yield takeLatest(AFFILIATE_SCHEME_TYPE_STATUS, statusSchemeTypeDataRequest)
    yield takeLatest(ADD_AFFILIATE_SCHEME_TYPE, addSchemeTypeDataRequest)
    yield takeLatest(EDIT_AFFILIATE_SCHEME_TYPE, editSchemeTypeDataRequest)
}

export default AffiliateSchemeTypeSaga;