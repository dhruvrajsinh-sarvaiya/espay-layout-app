/**
 * Created By Dipesh
 * Created Date 01/03/19
 * Saga File for Referral participant
 */

import { all, call, fork, put, select, takeEvery } from "redux-saga/effects";

import {
    GET_REFERRAL_PARTICIPATE_LIST,
    GET_CHANNEL_TYPE,
    GET_SERVICE_LIST
} from "../../actions/ActionTypes";

// import functions from action
import {
    getReferralParticipateSuccess,
    getReferralParticipateFailure,
    getChannelTypeSuccess,
    getChannelTypeFailure,
    getServiceListSuccess,
    getServiceListFailure
} from "../../actions/account/ReferralParticipantAction";
import { userAccessToken } from "../../selector";
import { Method as MethodBO } from "../../controllers/Constants";
import { swaggerPostAPI, queryBuilder } from "../../api/helper";
import { isEmpty } from "../../validations/CommonValidation";

//Display referral Participate Data By Channel
function* getReferralParticipateAPI({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        var URL = MethodBO.ListAdminParticipateReferralUser + '?&PageIndex=' + payload.PageIndex + "&Page_Size=" + payload.Page_Size;

        //var URL = MethodBO.ListAdminParticipateReferralUser + queryBuilder(payload);

        if (payload.hasOwnProperty("UserName") && !isEmpty(payload.UserName)) {
            URL += '&UserName=' + payload.UserName;
        }
        if (payload.hasOwnProperty("FromDate") && !isEmpty(payload.FromDate)) {
            URL += '&FromDate=' + payload.FromDate;
        }
        if (payload.hasOwnProperty("ToDate") && !isEmpty(payload.ToDate)) {
            URL += '&ToDate=' + payload.ToDate;
        }
        if (payload.hasOwnProperty("ReferralChannelTypeId") && !isEmpty(payload.ReferralChannelTypeId)) {
            URL += '&ReferralChannelTypeId=' + payload.ReferralChannelTypeId;
        }
        if (payload.hasOwnProperty("ReferralServiceId") && !isEmpty(payload.ReferralServiceId)) {
            URL += '&ReferralServiceId=' + payload.ReferralServiceId;
        }
        if (payload.hasOwnProperty("ReferUserName") && !isEmpty(payload.ReferUserName)) {
            URL += '&ReferUserName=' + payload.ReferUserName;
        }

        // To call participant list Api 
        const response = yield call(swaggerPostAPI, URL, payload, headers);

        // To set participant list success response to reducer
        yield put(getReferralParticipateSuccess(response));

    } catch (error) {

        // To set participant list failure response to reducer
        yield put(getReferralParticipateFailure(error));
    }
}

//Display referral Channel Type Data
function* getChannelTypeDataAPI({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call chanel type Api 
        const response = yield call(swaggerPostAPI, MethodBO.DropDownReferralChannelType, {}, headers);

        // To set chanel type success response to reducer
        yield put(getChannelTypeSuccess(response));

    } catch (error) {

        // To set chanel type failure response to reducer
        yield put(getChannelTypeFailure(error));
    }
}

//Display referral Service Data
function* getServiceDataAPI({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }


        //url
        var URL = MethodBO.DropDownReferralService + queryBuilder(payload);

        // To call service type Api 
        const response = yield call(swaggerPostAPI, URL, {}, headers);

        //const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralService?PayTypeId=' + payload.PayTypeId, {}, headers);

        // To set service type success response to reducer
        yield put(getServiceListSuccess(response));

    } catch (error) {

        // To set service type failure response to reducer
        yield put(getServiceListFailure(error));
    }
}

//api referral participant list
function* getReferralParticipate() {
    yield takeEvery(GET_REFERRAL_PARTICIPATE_LIST, getReferralParticipateAPI);
}

//api chaneltype
function* getChannelTypeData() {
    yield takeEvery(GET_CHANNEL_TYPE, getChannelTypeDataAPI);
}

//api service type
function* getServiceData() {
    yield takeEvery(GET_SERVICE_LIST, getServiceDataAPI);
}

//saga middleware
export default function* rootSaga() {
    yield all([
        fork(getReferralParticipate),
        fork(getChannelTypeData),
        fork(getServiceData)
    ]);
}