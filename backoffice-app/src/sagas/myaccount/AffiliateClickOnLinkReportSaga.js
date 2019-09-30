// AffiliateClickOnLinkReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    AFFILIATE_CLICK_ON_LINK_REPORT,
} from '../../actions/ActionTypes';

import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import {
    affiliateClickOnLinkReportSuccess,
    affiliateClickOnLinkReportFailure
} from '../../actions/account/AffiliateClickOnLinkReportAction';

function* clickLinkDataRequest(payload) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call referral link click list api
        const response = yield call(swaggerPostAPI, Method.GetReferralLinkClick, payload.data, headers);

        // To set referral link click list success response to reducer
        yield put(affiliateClickOnLinkReportSuccess(response));
    } catch (error) {

        // To set referral link click list Failure response to reducer
        yield put(affiliateClickOnLinkReportFailure());
    }
}

//call api
function* AffiliateClickOnLinkReportSaga() {
    yield takeLatest(AFFILIATE_CLICK_ON_LINK_REPORT, clickLinkDataRequest)
}

export default AffiliateClickOnLinkReportSaga;