// AffiliateSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
    GET_AFFILIATE_DATA,
    GET_EMAIL_SEND_REPORT,
    GET_CLICK_ON_LINK_REPORT,
    GET_COMMISSION_REPORT,
    GET_SMS_SEND_REPORT,
    GET_FACEBOOK_SHARE_REPORT,
    GET_TWITTER_SHARE_REPORT,
    GET_AFFILIATE_SIGNUP_REPORT,
    GET_AFFILIATE_USER_LIST,
    GET_SCHEME_MAPPING_IDS,
    GET_AFFILIATE_PIE_CHART_DATA,
    GET_AFFILIATE_LINE_CHART_DATA
} from '../actions/ActionTypes';
import {
    AffiliatedataSuccess, AffiliatedataFailure,
    EmailSendDataSuccess, EmailSendDataFailure,
    getClikOnLinkReportSuccess, getClikOnLinkReportFailure,
    getCommissionReportSuccess, getCommissionReportFailure,
    SmsSendDataSuccess, SmsSendDataFailure,
    FacebookShareDataSuccess, FacebookShareDataFailure,
    TwitterShareDataSuccess, TwitterShareDataFailure,
    AffiliateSignupDataSuccess, AffiliateSignupDataFailure,
    getAffiliateUserListSuccess, getAffiliateUserListFailure,
    getSchemeMappigIdsSuccess, getSchemeMappigIdsFailure,
    getPieChartDataSuccess, getPieChartDataFailure,
    getLineChartDataSuccess, getLineChartDataFailure
} from '../actions/Affiliate/AffiliateAction';

import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from '../api/helper';
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';

// Generator for Affiliate Data
function* fetchAffiliateData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate dashboard count api
        const response = yield call(swaggerGetAPI, Method.GetAffiliateDashboardCount, {}, headers);

        // To set affiliate count data success response to reducer
        yield put(AffiliatedataSuccess(response))
    } catch (e) {
        // To set affiliate count data failure response to reducer
        yield put(AffiliatedataFailure())
    }
}

// Generator for Affiliate Email Report
function* fetchEmailReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Email Report count api
        const data = yield call(swaggerPostAPI, Method.GetEmailSent, action.payload, headers)

        // To set Email Send Report success response to reducer
        yield put(EmailSendDataSuccess(data))
    } catch (e) {
        // To set Email Send Report failure response to reducer
        yield put(EmailSendDataFailure())
    }
}

// Generator for Click on link report
function* fetchClickOnLinkReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Click On Link api
        const data = yield call(swaggerPostAPI, Method.GetReferralLinkClick, action.payload, headers)

        // To set Click On Link Report success response to reducer
        yield put(getClikOnLinkReportSuccess(data))
    } catch (e) {
        // To set Click On Link Report failure response to reducer
        yield put(getClikOnLinkReportFailure())
    }
}

// Generator for Commission Report
function* fetchCommissionReport({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To create request
        var Request = Method.AffiliateCommissionHistoryReport + '/' + payload.PageNo + '/' + payload.PageSize;

        let obj = {}

        // FromDate is not undefine and empty
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }

        // ToDate is not undefine and empty
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        // TrnUserId is not undefine and empty
        if (payload.TrnUserId !== undefined && payload.TrnUserId !== '') {
            obj = {
                ...obj,
                TrnUserId: payload.TrnUserId
            }
        }

        // SchemeMappingId is not undefine and empty
        if (payload.SchemeMappingId !== undefined && payload.SchemeMappingId !== '') {
            obj = {
                ...obj,
                SchemeMappingId: payload.SchemeMappingId
            }
        }

        // TrnRefNo is not undefine and empty
        if (payload.TrnRefNo !== undefined && payload.TrnRefNo !== '') {
            obj = {
                ...obj,
                TrnRefNo: payload.TrnRefNo
            }
        }

        // Create Request into QueryBuilder
        let newRequest = Request + queryBuilder(obj)

        // To call Commission Report api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);
        // To set Commission Report success response to reducer
        yield put(getCommissionReportSuccess(data))
    } catch (e) {
        // To set Commission Report failure response to reducer
        yield put(getCommissionReportFailure())
    }
}

// Generator for Scheme Mapping Ids
function* fetchSchemeMappingIds({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create request
        var Request = Method.ListAffiliateSchemeTypeMapping + '/' + payload.PageNo + '?PageSize=' + payload.PageSize;
        
        // To call Sheme Mapping Ids api
        const data = yield call(swaggerGetAPI, Request, {}, headers);

        // To set Scheme Mapping Ids success response to reducer
        yield put(getSchemeMappigIdsSuccess(data))
    } catch (e) {
        // To set Scheme Mapping Ids failure response to reducer
        yield put(getSchemeMappigIdsFailure())
    }
}

// Generator for SMS Report
function* fetchSMSReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call SMS Report Ids api
        const data = yield call(swaggerPostAPI, Method.GetSMSSent, action.payload, headers)
        // To set SMS Send Data success response to reducer
        yield put(SmsSendDataSuccess(data))
    } catch (e) {
        // To set SMS Send Data failure response to reducer
        yield put(SmsSendDataFailure())
    }
}

// Generator for Facebook share report
function* fetchFacebookShareReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Facebook Share Data api
        const data = yield call(swaggerPostAPI, Method.GetFacebookLinkClick, action.payload, headers)

        // To set Facebook Share Data success response to reducer
        yield put(FacebookShareDataSuccess(data))
    } catch (e) {
        // To set Facebook Share Data failure response to reducer
        yield put(FacebookShareDataFailure())
    }
}

// Generator for Twitter Share report
function* fetchTwitterShareReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Twitter Share Data api
        const data = yield call(swaggerPostAPI, Method.GetTwitterLinkClick, action.payload, headers)

        // To set Twitter Share Data success response to reducer
        yield put(TwitterShareDataSuccess(data))
    } catch (e) {
        // To set Twitter Share Data failure response to reducer
        yield put(TwitterShareDataFailure())
    }
}

// Generator for Signup Report
function* fetchSignupReport(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Signup Report Data api
        const data = yield call(swaggerPostAPI, Method.GetAffiateUserRegistered, action.payload, headers)

        // To set Affiliate SignUp Data success response to reducer
        yield put(AffiliateSignupDataSuccess(data))
    } catch (e) {
        // To set Affiliate SignUp Data failure response to reducer
        yield put(AffiliateSignupDataFailure())
    }
}

// Generator for Affiliate User List
function* affiliateUserList() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Affiliate User List Data api
        const data = yield call(swaggerGetAPI, Method.GetAllAffiliateUser, {}, headers)

        // To set Affiliate User List success response to reducer
        yield put(getAffiliateUserListSuccess(data))
    } catch (e) {
        // To set Affiliate User List failure response to reducer
        yield put(getAffiliateUserListFailure())
    }
}

// Generator for Pie Chart Data
function* pieChartData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Affiliate Pie chart Data api
        const data = yield call(swaggerGetAPI, Method.GetAffiliateInvitieChartDetail, {}, headers)

        // To set Pie Chart Data success response to reducer
        yield put(getPieChartDataSuccess(data))
    } catch (e) {
        // To set Pie Chart Data failure response to reducer
        yield put(getPieChartDataFailure())
    }
}

// Generator for Line Chart Data
function* lineChartData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Line Chart Data api
        const data = yield call(swaggerGetAPI, Method.GetMonthWiseCommissionChartDetail + '?Year=' + payload.year, {}, headers)
        
        // To set Line Chart Data success response to reducer
        yield put(getLineChartDataSuccess(data))
    } catch (e) {
        // To set Line Chart Data failure response to reducer
        yield put(getLineChartDataFailure())
    }
}

function* AffiliateSaga() {
    // To register Affiliate Data method 
    yield takeLatest(GET_AFFILIATE_DATA, fetchAffiliateData)
    // To register Email Send Report method 
    yield takeLatest(GET_EMAIL_SEND_REPORT, fetchEmailReport)
    // To register Click on Link Report method 
    yield takeLatest(GET_CLICK_ON_LINK_REPORT, fetchClickOnLinkReport)
    // To register Commission Report method 
    yield takeLatest(GET_COMMISSION_REPORT, fetchCommissionReport)
    // To register SMS Send Report method 
    yield takeLatest(GET_SMS_SEND_REPORT, fetchSMSReport)
    // To register Facebook Share Report method 
    yield takeLatest(GET_FACEBOOK_SHARE_REPORT, fetchFacebookShareReport)
    // To register Twitter Share Report method 
    yield takeLatest(GET_TWITTER_SHARE_REPORT, fetchTwitterShareReport)
    // To register Affiliate Signup Report method 
    yield takeLatest(GET_AFFILIATE_SIGNUP_REPORT, fetchSignupReport)
    // To register Affiliate User List method 
    yield takeLatest(GET_AFFILIATE_USER_LIST, affiliateUserList)
    // To register Scheme Mapping Ids method 
    yield takeLatest(GET_SCHEME_MAPPING_IDS, fetchSchemeMappingIds)
    // To register Affiliate Pie Chart method 
    yield takeLatest(GET_AFFILIATE_PIE_CHART_DATA, pieChartData)
    // To register Affiliate Link Chart method 
    yield takeLatest(GET_AFFILIATE_LINE_CHART_DATA, lineChartData)
}

export default AffiliateSaga;
