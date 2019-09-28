// ChatUserListSaga
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
//import action types
import {
    CHANGEUSERBLOCKSTATUSCHAT,
    GET_CHATUSERHISTORY,
    GET_CHAT_USER_LIST
} from '../../actions/ActionTypes';

//import function from action
import {
    changeBlockUserChatStatusSuccess,
    changeBlockUserChatStatusFailure,
    getChatUserhistorySuccess,
    getChatUserhistoryFailure,
    getUserChatListApiSuccess,
    getUserChatListApiFailure
} from '../../actions/CMS/ChatUserListAction';
import { swaggerPostAPI, swaggerGetAPI } from '../../api/helper';
import { Method } from "../../controllers/Constants";
import { userAccessToken } from '../../selector';

// set change block user status to Server
function* changeBlockUserChatStatusApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Chat user status change Data Api
        const response = yield call(swaggerPostAPI, Method.BlockUser, payload, headers);

        // To set Chat user status change success response to reducer
        yield put(changeBlockUserChatStatusSuccess(response));
    } catch (error) {

        // To set Chat user status change success response to reducer
        yield put(changeBlockUserChatStatusFailure(error));
    }
}

//  Get Chat User History API Call
function* getChatUserhistoryAPI({ payload }) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Get user wise chat list Data Api
        const response = yield call(swaggerPostAPI, Method.GetUserWiseChat, payload, headers);

        // To set Get user wise chat list success response to reducer
        yield put(getChatUserhistorySuccess(response));
    } catch (error) {

        // To set Get user wise chat list success response to reducer
        yield put(getChatUserhistoryFailure(error));
    }
}

//  Arbitrage user wallet ledger api 
function* getUserChatlistApiData({ payload }) {

    try {
        const request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Call api based on screen 
        let methodName
        if (request.screenType == 1)
            methodName = Method.GetOnlineUserList
        else if (request.screenType == 2)
            methodName = Method.GetOfflineUserList
        else if (request.screenType == 3)
            methodName = Method.GetActiveUserList
        else if (request.screenType == 4)
            methodName = Method.GetBlockedUserList

        // Create request url
        var URL = methodName + '/' + request.PageNo + "/" + request.PageSize;

        // To call Get user chat list Data Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Get user chat list success response to reducer
        yield put(getUserChatListApiSuccess(response));
    } catch (error) {

        // To set Get user chat list failure response to reducer
        yield put(getUserChatListApiFailure(error));
    }
}

// set change block user status
export function* changeBlockUserChatStatus() {
    yield takeLatest(CHANGEUSERBLOCKSTATUSCHAT, changeBlockUserChatStatusApi);
}

//  Get Chat User History
export function* getChatUserhistory() {
    yield takeLatest(GET_CHATUSERHISTORY, getChatUserhistoryAPI);
}

//  Get Chat User History
export function* getChatUserList() {
    yield takeLatest(GET_CHAT_USER_LIST, getUserChatlistApiData);
}


// chat user list Root Saga
function* ChatUserListSaga() {
    yield all([
        fork(changeBlockUserChatStatus),
        fork(getChatUserhistory),
        fork(getChatUserList),
    ]);
}
export default ChatUserListSaga;