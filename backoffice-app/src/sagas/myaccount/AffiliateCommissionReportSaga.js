// AffiliateCommissionReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';
//import action types
import {
    AFFILIATE_COMMISSION_REPORT,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { queryBuilder, swaggerGetAPI } from '../../api/helper';
import {
    affiliateCommissionReportSuccess,
    affiliateCommissionReportFailure,
    affiliateSchemeTypeMappingSuccess,
    affiliateSchemeTypeMappingFailure
} from '../../actions/account/AffiliateCommissionReportAction';

function* listAffiliateSchemeTypeMappingRequest({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call scheme type mapping api
        const response = yield call(swaggerGetAPI, Method.ListAffiliateSchemeTypeMapping + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set scheme type mapping success response to reducer
        yield put(affiliateSchemeTypeMappingSuccess(response));
    } catch (error) {

        // To set scheme type mapping success response to reducer
        yield put(affiliateSchemeTypeMappingFailure(error));
    }
}

function* commissionReportDataRequest({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        //request 
        var Request = Method.AffiliateCommissionHistoryReport + '/' + payload.PageNo + '/' + payload.PageSize;

        let obj = {}

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }
        if (payload.TrnUserId !== undefined && payload.TrnUserId !== '') {
            obj = {
                ...obj,
                TrnUserId: payload.TrnUserId
            }
        }
        if (payload.AffiliateUserId !== undefined && payload.AffiliateUserId !== '') {
            obj = {
                ...obj,
                AffiliateUserId: payload.AffiliateUserId
            }
        }
        if (payload.SchemeMappingId !== undefined && payload.SchemeMappingId !== '') {
            obj = {
                ...obj,
                SchemeMappingId: payload.SchemeMappingId
            }
        }
        if (payload.TrnRefNo !== undefined && payload.TrnRefNo !== '') {
            obj = {
                ...obj,
                TrnRefNo: payload.TrnRefNo
            }
        }

        // Create Request into QueryBuilder
        let newRequest = Request + queryBuilder(obj)

        // To call commission report List api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set commission report List success response to reducer
        yield put(affiliateCommissionReportSuccess(data))
    } catch (e) {

        // To set commission report List failure response to reducer
        yield put(affiliateCommissionReportFailure())
    }
}

//call apis
function* AffiliateCommissionReportSaga() {
    yield takeLatest(AFFILIATE_COMMISSION_REPORT, commissionReportDataRequest)
    yield takeLatest(LIST_AFFILIATE_SCHEME_TYPE_MAPPING, listAffiliateSchemeTypeMappingRequest)
}

export default AffiliateCommissionReportSaga;