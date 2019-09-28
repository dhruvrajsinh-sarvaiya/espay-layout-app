// SiteTokenConversionReportSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
    GET_BASE_MARKET_DATA,
    GET_SITETOKEN_REPORT_DATA
} from '../../actions/ActionTypes';
import {
    getTokenCurrencyDataSuccess, getTokenCurrencyDataFailure,
    getSiteTokenReportDataSuccess, getSiteTokenReportDataFailure
} from '../../actions/Trading/SiteTokenConversionReportAction';
import { swaggerGetAPI, queryBuilder } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import { userAccessToken } from '../../selector';

// Generator for tokenCurrency data 
function* TokenCurrencyData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call base market api
        const data = yield call(swaggerGetAPI, Method.GetBaseMarket, {}, headers);

        // To set base market success response to reducer
        yield put(getTokenCurrencyDataSuccess(data))
    } catch (e) {

        // To set base market failure response to reducer
        yield put(getTokenCurrencyDataFailure())
    }
}

// Generator for SiteTokenReport data 
function* SiteTokenReportData(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call site token converion report api
        const responce = yield call(swaggerGetAPI, Method.GetSiteTokenConversionDataBK + queryBuilder(action.data, true), {}, headers);

        // To set site token converion report success response to reducer
        yield put(getSiteTokenReportDataSuccess(responce))
    } catch (e) {

        // To set site token converion report failure response to reducer
        yield put(getSiteTokenReportDataFailure())
    }
}

function* SiteTokenConversionReportSaga() {
    // To register get TokenCurrency data method
    yield takeLatest(GET_BASE_MARKET_DATA, TokenCurrencyData)
    // To register get SiteToken data method
    yield takeLatest(GET_SITETOKEN_REPORT_DATA, SiteTokenReportData)
}
export default SiteTokenConversionReportSaga;