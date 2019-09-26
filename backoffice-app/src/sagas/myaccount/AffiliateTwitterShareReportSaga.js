// AffiliateTwitterShareReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';
//import action types
import {
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import {
    affiliateShareOnTwitterReportSuccess,
    affiliateShareOnTwitterReportFailure
} from '../../actions/account/AffiliateTwitterShareReportAction';

function* twitterShareDataRequest(payload) {
    try {

        //to get tokenID of currently logged in user. 
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call twitter link click list api
        const response = yield call(swaggerPostAPI, Method.GetTwitterLinkClick, payload.data, headers);

        // To set twitter link click list success response to reducer
        yield put(affiliateShareOnTwitterReportSuccess(response));
    } catch (error) {

        // To set twitter link click list failure response to reducer
        yield put(affiliateShareOnTwitterReportFailure(error));
    }
}

//call apis
function* AffiliateTwitterShareReportSaga() {
    yield takeLatest(AFFILIATE_SHARE_ON_TWITTER_REPORT, twitterShareDataRequest)
}

export default AffiliateTwitterShareReportSaga;