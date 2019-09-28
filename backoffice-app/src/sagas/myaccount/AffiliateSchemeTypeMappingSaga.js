// AffiliateSchemeTypeMappingSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    LIST_AFFILIATE_SCHEME_DATA,
    LIST_AFFILIATE_SCHEME_TYPE_DATA,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING
} from '../../actions/ActionTypes';

import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, swaggerGetAPI } from '../../api/helper';
import {
    listAffiliateSchemeTypeMappingDataSuccess,
    listAffiliateSchemeTypeMappingDataFailure,
    changeAffiliateSchemeTypeMappingStatusSuccess,
    changeAffiliateSchemeTypeMappingStatusFailure,
    listAffiliateSchemeDataSuccess,
    listAffiliateSchemeDataFailure,
    listAffiliateSchemeTypeDataSuccess,
    listAffiliateSchemeTypeDataFailure,
    addAffiliateSchemeTypeMappingSuccess,
    addAffiliateSchemeTypeMappingFailure,
    editAffiliateSchemeTypeMappingSuccess,
    editAffiliateSchemeTypeMappingFailure
} from '../../actions/account/AffiliateSchemeTypeMappingAction';

//for get scheme maping List Data
function* schemeMappingDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type mapping list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeTypeMapping + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme type mapping list success response to reducer
        yield put(listAffiliateSchemeTypeMappingDataSuccess(response));
    } catch (error) {

        // To set affiliate scheme type mapping list failure response to reducer
        yield put(listAffiliateSchemeTypeMappingDataFailure());
    }
}

//for get scheme data
function* schemeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateScheme + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme success response to reducer
        yield put(listAffiliateSchemeDataSuccess(response));
    } catch (error) {

        // To set affiliate scheme failure response to reducer
        yield put(listAffiliateSchemeDataFailure());
    }
}

// for get scheme type data
function* schemeTypeDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeType + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate scheme type list success response to reducer
        yield put(listAffiliateSchemeTypeDataSuccess(response));
    } catch (error) {

        // To set affiliate scheme type list failure response to reducer
        yield put(listAffiliateSchemeTypeDataFailure());
    }
}

// for add mapping data
function* addSchemeMappingDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type mapping add api
        const response = yield call(swaggerPostAPI, Method.AddAffiliateSchemeTypeMapping, payload, headers);

        // To set affiliate scheme type mapping add success response to reducer
        yield put(addAffiliateSchemeTypeMappingSuccess(response));
    } catch (error) {

        // To set affiliate scheme type mapping add failure response to reducer
        yield put(addAffiliateSchemeTypeMappingFailure());
    }
}

// for Edit mapping data
function* editSchemeMappingDataRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type mapping edit api
        const response = yield call(swaggerPostAPI, Method.UpdateAffiliateSchemeTypeMapping, payload, headers);

        // To set affiliate scheme type mapping edit success response to reducer
        yield put(editAffiliateSchemeTypeMappingSuccess(response));
    } catch (error) {

        // To set affiliate scheme type mapping edit failure response to reducerF
        yield put(editAffiliateSchemeTypeMappingFailure());
    }
}

// for status change Request
function* statusChangeRequest({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate scheme type mapping change status api
        const response = yield call(swaggerPostAPI, Method.ChangeAffiliateSchemeTypeMappingStatus, payload, headers);

        // To set affiliate scheme type mapping change status success response to reducer
        yield put(changeAffiliateSchemeTypeMappingStatusSuccess(response));
    } catch (error) {

        // To set affiliate scheme type mapping change status failure response to reducer
        yield put(changeAffiliateSchemeTypeMappingStatusFailure());
    }
}

//call api's
function* AffiliateSchemeTypeMappingSaga() {
    yield takeLatest(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA, schemeMappingDataRequest)
    yield takeLatest(CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS, statusChangeRequest)
    yield takeLatest(LIST_AFFILIATE_SCHEME_DATA, schemeDataRequest)
    yield takeLatest(LIST_AFFILIATE_SCHEME_TYPE_DATA, schemeTypeDataRequest)
    yield takeLatest(ADD_AFFILIATE_SCHEME_TYPE_MAPPPING, addSchemeMappingDataRequest)
    yield takeLatest(EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING, editSchemeMappingDataRequest)
}

export default AffiliateSchemeTypeMappingSaga;