// AffiliateSchemeDetailSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    AFFILIATE_SCHEME_DETAIL_LIST,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    AFFILIATE_SCHEME_TYPE_MAPPING_LIST,
    ADD_AFFILIATE_SCHEME_DETAIL,
    EDIT_AFFILIATE_SCHEME_DETAIL
} from '../../actions/ActionTypes';

import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, swaggerGetAPI } from '../../api/helper';
import {
    affiliateSchemeDetailListSuccess,
    affiliateSchemeDetailListFailure,
    changeAffiliateSchemeDetailStatusSuccess,
    changeAffiliateSchemeDetailStatusFailure,
    affiliateSchemeMappingListSuccess,
    affiliateSchemeMappingListFailure,
    addAffiliateSchemeDetailSuccess,
    addAffiliateSchemeDetailFailure,
    editAffiliateSchemeDetailSuccess,
    editAffiliateSchemeDetailFailure
} from '../../actions/account/AffiliateSchemeDetailAction';

// for Scheme Detail List
function* schemeDetailListRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme detail list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeDetail + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme detail list success response to reducer
        yield put(affiliateSchemeDetailListSuccess(response));
    } catch (error) {

        // To set affiliate scheme detail list failure response to reducer
        yield put(affiliateSchemeDetailListFailure());
    }
}

// for Scheme Detail List
function* changeSchemeDetailStatusRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme detail status change api
        const response = yield call(swaggerPostAPI, Method.ChangeAffiliateShemeDetailStatus, payload, {}, headers);

        // To set affiliate scheme detail status change success response to reducer
        yield put(changeAffiliateSchemeDetailStatusSuccess(response));
    } catch (error) {

        // To set affiliate scheme detail status change failure response to reducer
        yield put(changeAffiliateSchemeDetailStatusFailure());
    }
}

// for mapping type data
function* mappingListRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type mapping list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeTypeMapping + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme type mapping list success response to reducer
        yield put(affiliateSchemeMappingListSuccess(response));
    } catch (error) {

        // To set affiliate scheme type mapping list failure response to reducer
        yield put(affiliateSchemeMappingListFailure());
    }
}

// for add Scheme Detail
function* addSchemeDetailRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme detail add api
        const response = yield call(swaggerPostAPI, Method.AddAffiliateShemeDetail, payload, headers);

        // To set affiliate scheme detail add success response to reducer
        yield put(addAffiliateSchemeDetailSuccess(response));
    } catch (error) {

        // To set affiliate scheme detail add failure response to reducer
        yield put(addAffiliateSchemeDetailFailure());
    }
}

// for add Scheme Detail
function* editSchemeDetailRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme detail edit api
        const response = yield call(swaggerPostAPI, Method.UpdateAffiliateShemeDetail, payload, headers);

        // To set affiliate scheme detail edit success response to reducer
        yield put(editAffiliateSchemeDetailSuccess(response));
    } catch (error) {

        // To set affiliate scheme detail edit failure response to reducer
        yield put(editAffiliateSchemeDetailFailure());
    }
}

//call api's
function* AffiliateSchemeDetailSaga() {
    yield takeLatest(AFFILIATE_SCHEME_DETAIL_LIST, schemeDetailListRequest)
    yield takeLatest(CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS, changeSchemeDetailStatusRequest)
    yield takeLatest(AFFILIATE_SCHEME_TYPE_MAPPING_LIST, mappingListRequest)
    yield takeLatest(ADD_AFFILIATE_SCHEME_DETAIL, addSchemeDetailRequest)
    yield takeLatest(EDIT_AFFILIATE_SCHEME_DETAIL, editSchemeDetailRequest)
}

export default AffiliateSchemeDetailSaga;