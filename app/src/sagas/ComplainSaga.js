//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../api/helper";
import { userAccessToken } from '../selector';

//Action Types..
import {
    LIST_COMPLAIN,
    ADD_COMPLAIN,
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_TYPE,
    REPLAY_SEND,
} from '../actions/ActionTypes';
//Action methods..
import {
    complainListSuccess,
    complainListFailure,
    addComplainSuccess,
    addComplainFailure,
    getComplainByIdSuccess,
    getComplainByIdFailure,
    getComplaintTypeFailure,
    getComplaintTypeSuccess,
    replaySendSuccess,
    replaySendFailure,
} from '../actions/account/Complain';

//Function for Complain List API
function* getComplainListAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Complain List api
        const data = yield call(swaggerGetAPI, Method.GetUserWiseComplain + queryBuilder(payload), {}, headers);

        // To set Complain List success response to reducer
        yield put(complainListSuccess(data));
    } catch (error) {
        // To set Complain List failure response to reducer
        yield put(complainListFailure(error));
    }
}

//Function for Add Complain API
function* addComplainAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Complain api
        const response = yield call(swaggerPostAPI, Method.Raisecomplaint, payload, headers);

        // To set Add Complain success response to reducer
        yield put(addComplainSuccess(response));
    } catch (error) {
        // To set Add Complain failure response to reducer
        yield put(addComplainFailure(error));
    }
}

//Function for Get Complain By Id API
function* getComplainByIdAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Complain By Id api
        const response = yield call(swaggerGetAPI, Method.GetComplain + '?ComplainId=' + payload.ComplainId, {}, headers);

        // To set Complain By Id success response to reducer
        yield put(getComplainByIdSuccess(response));
    } catch (error) {
        // To set Complain By Id failure response to reducer
        yield put(getComplainByIdFailure());
    }
}

function* replaySendComplaintAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Reply Complain api
        const response = yield call(swaggerPostAPI, Method.AddCompainTrail, payload, headers);
        // To set Reply Send success response to reducer
        yield put(replaySendSuccess(response));
    } catch (error) {
        // To set Reply Send failure response to reducer
        yield put(replaySendFailure());
    }
}

//Function for Get Complain Type API
function* getComplainTypeAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Complain Type api
        const data = yield call(swaggerGetAPI, Method.GetTypeMaster + '?Type=complain', {}, headers);

        // To set Complain Type success response to reducer
        yield put(getComplaintTypeSuccess(data));
    } catch (error) {
        // To set Complain Type failure response to reducer
        yield put(getComplaintTypeFailure(error));
    }
}

/* Create Sagas method for Complain List */
export function* complainListSagas() {
    yield takeLatest(LIST_COMPLAIN, getComplainListAPI);
}

/* Create Sagas method for Add Complain */
export function* addComplainSagas() {
    yield takeLatest(ADD_COMPLAIN, addComplainAPI);
}

/* Create Sagas method for get Complain By Id */
export function* getComplainByIdSagas() {
    yield takeLatest(GET_COMPLAIN_BY_ID, getComplainByIdAPI);
}

/* Create Sagas method for get complaint type */
export function* complaintTypeSagas() {
    yield takeLatest(GET_COMPLAIN_TYPE, getComplainTypeAPI);
}

/* Create Sagas method for get complaint type */
export function* sendReplaySagas() {
    yield takeLatest(REPLAY_SEND, replaySendComplaintAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {

    yield all([
        // To register Complain list method
        fork(complainListSagas),
        // To register Add Complain method
        fork(addComplainSagas),
        // To register Complain By Id  method
        fork(getComplainByIdSagas),
        // To register Complain By Id  method
        fork(complaintTypeSagas),
        // To register Send Reply  method
        fork(sendReplaySagas),
    ]);
}

