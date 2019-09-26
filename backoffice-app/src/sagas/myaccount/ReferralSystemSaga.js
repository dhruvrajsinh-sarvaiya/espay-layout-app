// ReferralSystemSaga
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import { REFERRAL_SYSTEM_DASHBOARD_DATA, GET_ADMIN_REFERRAL_CHANNNEL_LIST, } from '../../actions/ActionTypes';

import { userAccessToken } from '../../selector';
import { swaggerPostAPI, queryBuilder } from '../../api/helper';
import { getReferalSystemDashDataSuccess, getReferalSystemDashDataFailure, getAdminRefChannelListSuccess, getAdminRefChannelListFailure } from '../../actions/account/ReferralSystemAction';
import { Method } from '../../controllers/Constants';

//Function for Get 
function* getAdminReferralChannelData({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        let Request = Method.ListAdminReferralChannelWithChannelType;
        let obj = payload

        if (payload.ReferralPayTypeId !== undefined && payload.ReferralPayTypeId !== '') {
            obj = {
                ...obj,
                ReferralPayTypeId: payload.ReferralPayTypeId
            }
        }

        if (payload.ReferralServiceId !== undefined && payload.ReferralServiceId !== '') {
            obj = {
                ...obj,
                ReferralServiceId: payload.ReferralServiceId
            }
        }

        if (payload.UserName !== undefined && payload.UserName !== '') {
            obj = {
                ...obj,
                UserName: payload.UserName
            }
        }

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }

        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        let newRequest = Request + queryBuilder(obj)

        // To call chanel api Api
        const data = yield call(swaggerPostAPI, newRequest, payload, headers);

        // To set admin chanel success response to reducer
        yield put(getAdminRefChannelListSuccess(data));
    } catch (error) {

        // To set Arbitrage Trade recon failure response to reducer
        yield put(getAdminRefChannelListFailure(error));
    }
}

//Function for Get 
function* getReferalDashboardData({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call AllCountForAdminReferralChannel Api
        const response = yield call(swaggerPostAPI, Method.AllCountForAdminReferralChannel, {}, headers);

        // To set referral system dashbaord success response to reducer
        yield put(getReferalSystemDashDataSuccess(response));
    } catch (error) {

        // To set referral system dashbaord failure response to reducer
        yield put(getReferalSystemDashDataFailure(error));
    }
}

//CrmForm Saga
function* ReferralSystemSaga() {
    yield takeLatest(REFERRAL_SYSTEM_DASHBOARD_DATA, getReferalDashboardData)
    yield takeLatest(GET_ADMIN_REFERRAL_CHANNNEL_LIST, getAdminReferralChannelData)
}
export default ReferralSystemSaga;