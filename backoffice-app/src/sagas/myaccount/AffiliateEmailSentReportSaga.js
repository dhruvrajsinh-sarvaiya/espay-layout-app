// AffiliateEmailSentReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';
//import action types
import {
    AFFILIATE_EMAIL_SENT_REPORT,
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import {
    affiliateEmailSentReportSuccess,
    affiliateEmailSentReportFailure
} from '../../actions/account/AffiliateEmailSentReportAction';

function* emailSentDataRequest(payload) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call email sent list api
        const response = yield call(swaggerPostAPI, Method.GetEmailSent, payload.data, headers);

        // To set email sent list success response to reducer
        yield put(affiliateEmailSentReportSuccess(response));
    } catch (error) {

        // To set email sent list failure response to reducer
        yield put(affiliateEmailSentReportFailure());
    }
}


//call apis
function* AffiliateEmailSentReportSaga() {
    yield takeLatest(AFFILIATE_EMAIL_SENT_REPORT, emailSentDataRequest)
}

export default AffiliateEmailSentReportSaga;