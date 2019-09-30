import { all, fork, call, put, takeEvery, select } from "redux-saga/effects";
import {
    AFFILIATE_SIGNUP_REPORT,
} from '../../actions/ActionTypes';
import { Method } from "../../controllers/Constants";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from "../../api/helper";
import { affiliateSignupReportSuccess, affiliateSignupReportFailure } from "../../actions/account/AffiliateSignUpReeportAction";

//Display Affiliate Signup report API
function* affiliateSignupReportApi({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affliate user regsitred api
        const response = yield call(swaggerPostAPI, Method.GetAffiateUserRegistered, payload, headers);

        // To set affliate user regsitred success response to reducer
        yield put(affiliateSignupReportSuccess(response));
    } catch (error) {

        // To set affliate user regsitred failure response to reducer
        yield put(affiliateSignupReportFailure(error));
    }
}

//Display Affiliate Signup report
function* affiliateSignupReportSaga() {
    yield takeEvery(AFFILIATE_SIGNUP_REPORT, affiliateSignupReportApi);
}

//rootsaga to middleware
export default function* rootSaga() {
    yield all([
        fork(affiliateSignupReportSaga),
    ]);
}