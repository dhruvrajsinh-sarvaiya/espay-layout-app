/* 
    Createdby : Dhara gajera
    CreatedDate : 24-12-2018
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import action types
import {
    GET_CHATONLINEUSER_DASHBOARD,
    GET_CHATOFFLINEUSER_DASHBOARD,
    GET_CHATACTIVEUSER_DASHBOARD,
    GET_CHATBLOCKEDUSER_DASHBOARD,
} from 'Actions/types';

//import function from action
import {
    getChatOnlineUserDashboardSuccess,
    getChatOnlineUserDashboardFailure,
    getChatOfflineUserDashboardSuccess,
    getChatOfflineUserDashboardFailure,
    getChatActiveUserDashboardSuccess,
    getChatActiveUserDashboardFailure,
    getChatBlockedUserDashboardSuccess,
    getChatBlockedUserDashboardFailure,
} from 'Actions/ChatDashboard';

import {
    swaggerGetAPI,
} from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';

//Function for Get chat online user Data API
function* getChatOnlineUserDashboardAPI(payload) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetOnlineUserCount', payload, headers);

        if (typeof response.Count != 'undefined' && response.ReturnCode == 0) {
            yield put(getChatOnlineUserDashboardSuccess(response));
        } else {
            yield put(getChatOnlineUserDashboardFailure(response.data));
        }
    } catch (error) {
        yield put(getChatOnlineUserDashboardFailure(error));
    }
}
//Function for Get chat online user Data API
function* getChatOfflineUserDashboardAPI(payload) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetOfflineUserCount', payload, headers);

        if (typeof response.Count != 'undefined' && response.ReturnCode == 0) {
            yield put(getChatOfflineUserDashboardSuccess(response));
        } else {
            yield put(getChatOfflineUserDashboardFailure(response.data));
        }
    } catch (error) {
        yield put(getChatOfflineUserDashboardFailure(error));
    }
}

//Function for Get chat active user Data API
function* getChatActiveUserDashboardAPI(payload) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetActiveUserCount', payload, headers);

        if (typeof response.Count != 'undefined' && response.ReturnCode == 0) {
            yield put(getChatActiveUserDashboardSuccess(response));
        } else {
            yield put(getChatActiveUserDashboardFailure(response.data));
        }
    } catch (error) {
        yield put(getChatActiveUserDashboardFailure(error));
    }
}
//Function for Get chat online user Data API
function* getChatBlockedUserDashboardAPI(payload) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetBlockedUserCount', payload, headers);

        if (typeof response.Count != 'undefined' && response.ReturnCode == 0) {
            yield put(getChatBlockedUserDashboardSuccess(response));
        } else {
            yield put(getChatBlockedUserDashboardFailure(response.data));
        }
    } catch (error) {
        yield put(getChatBlockedUserDashboardFailure(error));
    }
}

//Get chat online user Dashboard
export function* getChatOnlineUserDashboard() {
    yield takeEvery(GET_CHATONLINEUSER_DASHBOARD, getChatOnlineUserDashboardAPI);
}

//Get chat offline user Dashboard
export function* getChatOfflineUserDashboard() {
    yield takeEvery(GET_CHATOFFLINEUSER_DASHBOARD, getChatOfflineUserDashboardAPI);
}

//Get chat Active user Dashboard
export function* getChatActiveUserDashboard() {
    yield takeEvery(GET_CHATACTIVEUSER_DASHBOARD, getChatActiveUserDashboardAPI);
}

//Get chat blocked user Dashboard
export function* getChatBlockedUserDashboard() {
    yield takeEvery(GET_CHATBLOCKEDUSER_DASHBOARD, getChatBlockedUserDashboardAPI);
}

//chat Dashboard Root Saga
export default function* rootSaga() {
    yield all([
        fork(getChatOnlineUserDashboard),
        fork(getChatOfflineUserDashboard),
        fork(getChatActiveUserDashboard),
        fork(getChatBlockedUserDashboard)
    ]);
}