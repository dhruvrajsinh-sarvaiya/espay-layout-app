// ChatDashboardSaga
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    GET_CHATONLINEUSER_DASHBOARD,
    GET_CHATOFFLINEUSER_DASHBOARD,
    GET_CHATACTIVEUSER_DASHBOARD,
    GET_CHATBLOCKEDUSER_DASHBOARD,
} from '../../actions/ActionTypes';

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
} from '../../actions/CMS/ChatDashboardAction';

// import {
//     swaggerGetAPI,
// } from 'Helpers/helpers';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from "../../controllers/Constants";
import { userAccessToken } from '../../selector';

//Function for Get chat online user Data API
function* getChatOnlineUserDashboardAPI() {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };
        const response = yield call(swaggerGetAPI, Method.GetOnlineUserCount, {}, headers);
        yield put(getChatOnlineUserDashboardSuccess(response));
    } catch (error) {
        yield put(getChatOnlineUserDashboardFailure(error));
    }
}

//Function for Get chat offline user Data API
function* getChatOfflineUserDashboardAPI() {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };
        const response = yield call(swaggerGetAPI, Method.GetOfflineUserCount, {}, headers);
        yield put(getChatOfflineUserDashboardSuccess(response));
    } catch (error) {
        yield put(getChatOfflineUserDashboardFailure(error));
    }
}

//Function for Get chat active user Data API
function* getChatActiveUserDashboardAPI() {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };
        const response = yield call(swaggerGetAPI, Method.GetActiveUserCount, {}, headers);
        yield put(getChatActiveUserDashboardSuccess(response));
    } catch (error) {
        yield put(getChatActiveUserDashboardFailure(error));
    }
}

//Function for Get chat Block user Data API
function* getChatBlockedUserDashboardAPI() {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };
        const response = yield call(swaggerGetAPI, Method.GetBlockedUserCount, {}, headers);
        yield put(getChatBlockedUserDashboardSuccess(response));
    } catch (error) {
        yield put(getChatBlockedUserDashboardFailure(error));
    }
}

//Get chat online user Dashboard
export function* getChatOnlineUserDashboard() {
    yield takeLatest(GET_CHATONLINEUSER_DASHBOARD, getChatOnlineUserDashboardAPI);
}

//Get chat offline user Dashboard
export function* getChatOfflineUserDashboard() {
    yield takeLatest(GET_CHATOFFLINEUSER_DASHBOARD, getChatOfflineUserDashboardAPI);
}

//Get chat Active user Dashboard
export function* getChatActiveUserDashboard() {
    yield takeLatest(GET_CHATACTIVEUSER_DASHBOARD, getChatActiveUserDashboardAPI);
}

//Get chat blocked user Dashboard
export function* getChatBlockedUserDashboard() {
    yield takeLatest(GET_CHATBLOCKEDUSER_DASHBOARD, getChatBlockedUserDashboardAPI);
}

function* ChatDashboardSaga() {
    yield all([
        fork(getChatOnlineUserDashboard),
        fork(getChatOfflineUserDashboard),
        fork(getChatActiveUserDashboard),
        fork(getChatBlockedUserDashboard)
    ]);
}

//chat Dashboard Saga
export default ChatDashboardSaga;