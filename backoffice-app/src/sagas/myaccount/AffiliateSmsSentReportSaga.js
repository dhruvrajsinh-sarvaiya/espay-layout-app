// AffiliateSmsSentReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';
//import action types
import {
    AFFILIATE_SMS_SENT_REPORT,
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import {
    affiliateSmsSentReportSuccess,
    affiliateSmsSentReportFailure
} from '../../actions/account/AffiliateSmsSentReportAction';

function* smsSentDataRequest(payload) {

    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call sms sent list api
        const response = yield call(swaggerPostAPI, Method.GetSMSSent, payload.data, headers);

        // To set sms sent list success response to reducer
        yield put(affiliateSmsSentReportSuccess(response));
    } catch (error) {

        // To set sms sent list success response to reducer
        yield put(affiliateSmsSentReportFailure());
    }
}

//call api
function* AffiliateSmsSentReportSaga() {
    yield takeLatest(AFFILIATE_SMS_SENT_REPORT, smsSentDataRequest)
}

export default AffiliateSmsSentReportSaga;