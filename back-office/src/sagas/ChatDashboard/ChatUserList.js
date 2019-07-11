/* 
    Createdby : Dhara gajera
    CreatedDate : 26-12-2018
    Description : For chat user list Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import action types
import {
    GET_CHATUSERLIST,
    CHANGEUSERBLOCKSTATUSCHAT,
    GET_CHATUSERHISTORY
} from 'Actions/types';

//import function from action
import {
    getChatUserListSuccess,
    getChatUserListFailure,
    changeBlockUserChatStatusSuccess,
    changeBlockUserChatStatusFailure,
    getChatUserhistorySuccess,
    getChatUserhistoryFailure
} from 'Actions/ChatDashboard';
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

/**
 * Get Chat User List API
 */
function* getChatUserlistApi({ payload }) {

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetUserList', payload, headers);
        if (typeof response.Users != 'undefined' && response.ReturnCode === 0) {
            yield put(getChatUserListSuccess(response));
        } else {
            yield put(getChatUserListFailure(response));
        }
    } catch (error) {
        yield put(getChatUserListFailure(error));
    }
}
/**
 * Change User Block Unblock
 */
function* changeBlockUserChatStatusApi({ payload }) {
    try {
        const response = yield call(swaggerPostAPI, 'api/Chat/BlockUser', payload, 1);

        if (response.ReturnCode === 0) {
            yield put(changeBlockUserChatStatusSuccess(response));
        } else {
            yield put(changeBlockUserChatStatusFailure(response));
        }
    } catch (error) {
        yield put(changeBlockUserChatStatusFailure(error));
    }
}

/**
 * Get Chat User History API Call
 */
function* getChatUserhistoryAPI({ payload }) {
    try {
        const response = yield call(swaggerPostAPI, 'api/Chat/GetUserWiseChat', payload, 1);

        if (response.ReturnCode === 0) {
            yield put(getChatUserhistorySuccess(response));
        } else {
            yield put(getChatUserhistoryFailure(response));
        }
    } catch (error) {
        yield put(getChatUserhistoryFailure(error));
    }
}

/**
 * Get cht user list
 */
export function* getChatUserList() {
    yield takeEvery(GET_CHATUSERLIST, getChatUserlistApi);
}
/**
 * Get cht user list
 */
export function* changeBlockUserChatStatus() {
    yield takeEvery(CHANGEUSERBLOCKSTATUSCHAT, changeBlockUserChatStatusApi);
}

/**
 * Get Chat User History
 */
export function* getChatUserhistory() {
    yield takeEvery(GET_CHATUSERHISTORY, getChatUserhistoryAPI);
}

/**
 * chat user list Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getChatUserList),
        fork(changeBlockUserChatStatus),
        fork(getChatUserhistory)
    ]);
}