import { all, fork, call, put, takeEvery, select } from "redux-saga/effects";
import { Method } from "../../controllers/Constants";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from "../../api/helper";
import { REFERRAL_REWARD_REPORT } from "../../actions/ActionTypes";
import { referralRewardReportSuccess, referralRewardReportFailure } from "../../actions/account/ConvertsAction";

function* referralRewardReportDataAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //Url
        var URL = Method.ListAdminReferralRewards + '?PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;
        if (payload.hasOwnProperty("TrnUserId") && payload.TrnUserId !== "") {
            URL += '&TrnUserId=' + payload.TrnUserId;
        }
        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            URL += '&FromDate=' + payload.FromDate;
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            URL += '&ToDate=' + payload.ToDate;
        }
        if (payload.hasOwnProperty("ReferralServiceId") && payload.ReferralServiceId !== "") {
            URL += '&ReferralServiceId=' + payload.ReferralServiceId;
        }

        // To call admin referral rewards Data Api
        const response = yield call(swaggerPostAPI, URL, payload, headers);

        // To set admin referral rewards success response to reducer
        yield put(referralRewardReportSuccess(response));
    } catch (error) {

        // To set admin referral rewards failure response to reducer
        yield put(referralRewardReportFailure(error));
    }
}

//call report list api
function* ConvertsSaga() {
    yield takeEvery(REFERRAL_REWARD_REPORT, referralRewardReportDataAPI);
}

//rootsaga middleware
export default function* rootSaga() {
    yield all([
        fork(ConvertsSaga),
    ]);
}