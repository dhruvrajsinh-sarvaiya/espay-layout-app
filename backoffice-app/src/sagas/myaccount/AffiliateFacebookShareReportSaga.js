// AffiliateFacebookShareReportSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';
//import action types
import {
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';
import {
    affiliateShareOnFacebookReportSuccess,
    affiliateShareOnFacebookReportFailure
} from '../../actions/account/AffiliateFacebookShareReportAction';

function* facebookShareDataRequest(payload) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call facebook  link click list api
        const response = yield call(swaggerPostAPI, Method.GetFacebookLinkClick, payload.data, headers);

        // To set facebook  link click list success response to reducer
        yield put(affiliateShareOnFacebookReportSuccess(response));
    } catch (error) {

        // To set facebook  link click list success response to reducer
        yield put(affiliateShareOnFacebookReportFailure());
    }
}

//call api
function* AffiliateFacebookShareReportSaga() {
    yield takeLatest(AFFILIATE_SHARE_ON_FACEBOOK_REPORT, facebookShareDataRequest)
}

export default AffiliateFacebookShareReportSaga;