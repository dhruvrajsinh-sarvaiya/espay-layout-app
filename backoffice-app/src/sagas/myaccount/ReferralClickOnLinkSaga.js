import { all, fork, call, put, takeEvery, select } from "redux-saga/effects";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from "../../api/helper";
import { CLICK_REFERRAL_LINK_REPORT } from "../../actions/ActionTypes";
import { clickReferralLinkReportSuccess, clickReferralLinkReportFailure } from "../../actions/account/ReferralClickOnLinkAction";
import { Method } from "../../controllers/Constants";

//Display referral click link Data
function* clickReferralLinkDataAPI({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        var URL = Method.ListAdminReferralUserClick + '?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
        if (payload.hasOwnProperty("Username") && payload.Username !== "") {
            URL += '&UserName=' + payload.Username;
        }
        if (payload.hasOwnProperty("ReferralChannelTypeId") && payload.ReferralChannelTypeId !== "") {
            URL += '&ReferralChannelTypeId=' + payload.ReferralChannelTypeId;
        }
        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            URL += '&FromDate=' + payload.FromDate;
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            URL += '&ToDate=' + payload.ToDate;
        }
        if (payload.hasOwnProperty("ServiceReferralServiceId") && payload.ReferralServiceId !== "") {
            URL += '&ReferralServiceId=' + payload.ReferralServiceId;
        }

        // To call click on link report list Data Api
        const response = yield call(swaggerPostAPI, URL, payload, headers);

        // To set click on link report list success response to reducer
        yield put(clickReferralLinkReportSuccess(response));
    } catch (error) {

        // To set click on link report list failure response to reducer
        yield put(clickReferralLinkReportFailure(error));
    }
}

//click on link api
function* ReferralClickOnLinkSaga() {
    yield takeEvery(CLICK_REFERRAL_LINK_REPORT, clickReferralLinkDataAPI);
}

//root saga middleware
export default function* rootSaga() {
    yield all([
        fork(ReferralClickOnLinkSaga),
    ]);
}