// ReferralSystemSaga
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    GET_REFERAL_SYSTEM_DATA,
    GET_REFERAL_INVITES_DATA
} from '../../actions/ActionTypes';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, queryBuilder } from '../../api/helper';
import {
    getReferalSystemDataSuccess, getReferalSystemDataFailure,
    getReferralInvitesDataSuccess, getReferralInvitesDataFailure
} from '../../actions/account/ReferralInvitesAction';

//Function for Get 
function* getReferalData(payload) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call referral system Api
        const response = yield call(swaggerPostAPI, Method.AllCountForAdminReferralChannel, {}, headers);

        // To set referral system success response to reducer
        yield put(getReferalSystemDataSuccess(response));
    } catch (error) {

        // To set referral system failure response to reducer
        yield put(getReferalSystemDataFailure());
    }
}
// -----------------------------------------------------------------------------------

//Function for Get 
function* getReferalInvitesData(action) {

    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call referral invites list Api
        const response = yield call(swaggerPostAPI, Method.ListAdminReferralChannelInvite + queryBuilder(action.data, true), {}, headers);

        // To set referral invites list success response to reducer
        yield put(getReferralInvitesDataSuccess(response));
    } catch (error) {

        // To set referral invites list failure response to reducer
        yield put(getReferralInvitesDataFailure());
    }
}
// -----------------------------------------------------------------------------------

//middleware Saga
function* ReferralInvitesSaga() {
    yield takeLatest(GET_REFERAL_SYSTEM_DATA, getReferalData)
    yield takeLatest(GET_REFERAL_INVITES_DATA, getReferalInvitesData)
}

export default ReferralInvitesSaga;