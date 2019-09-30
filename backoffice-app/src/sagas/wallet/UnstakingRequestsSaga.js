import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../../api/helper";
import {
    GET_LIST_PENDING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST
} from '../../actions/ActionTypes';
import {
    getListPendingRequestSuccess,
    getListPendingRequestFailure,
    AccepetRejectRequestSuccess,
    AccepetRejectRequestFailure
} from '../../actions/Wallet/UnstakingRequestsAction';
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";

//unstaking request List
function* getUnstakingPendingRequestAPI({ payload }) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call unstaking requests List  Data Api
        const response = yield call(swaggerGetAPI, Method.ListUnStackingRequest + queryBuilder(payload), {}, headers);

        // To set unstaking requests list success response to reducer
        yield put(getListPendingRequestSuccess(response));
    } catch (error) {
        // To set unstaking requests list Failure response to reducer
        yield put(getListPendingRequestFailure(error));
    }
}

//AcceptRejectRequestApi
function* AcceptRejectRequestApi({ payload }) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call unstaking requests accept reject  Data Api
        const response = yield call(swaggerPostAPI, Method.AcceptRejectUnstakingRequest + '/' + payload.AdminReqID + '/' + payload.Bit, payload, headers);

        // To set unstaking requests accept reject success response to reducer
        yield put(AccepetRejectRequestSuccess(response));
    } catch (error) {
        // To set unstaking requests accept reject failure response to reducer
        yield put(AccepetRejectRequestFailure(error));
    }
}

// accept reject Request
export function* AcceptRejectRequest() {
    yield takeEvery(ACCEPTREJECT_UNSTAKING_REQUEST, AcceptRejectRequestApi);
}

//unstaking list
export function* getUnstakingList() {
    yield takeEvery(GET_LIST_PENDING_REQUEST, getUnstakingPendingRequestAPI);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getUnstakingList),
        fork(AcceptRejectRequest)
    ]);
}
