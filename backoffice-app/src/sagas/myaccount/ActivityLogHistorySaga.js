//Sagas Effects..
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';

//Action Types..
import {
    ACTIVITY_LOG_LIST,
    GET_MODULE_TYPE,
} from "../../actions/ActionTypes";
//Action methods..
import {
    activityLogListSuccess,
    activityLogListFailure,
    getModuleTypeSuccess,
    getModuleTypeFailure,
} from "../../actions/account/ActivityLogHistoryAction"

//Get function form helper for Swagger API Call
import { swaggerGetAPI, queryBuilder, swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Methods';

//Function for Display Log List API
function* activityLogListAPI({ payload }) {
    try {
        let request = {}
        if (payload.PageIndex !== undefined && payload.PageIndex !== "") {
            request = {
                ...request,
                PageIndex: payload.PageIndex,
            }
        }
        if (payload.Page_Size !== undefined && payload.Page_Size !== "") {
            request = {
                ...request,
                Page_Size: payload.Page_Size,
            }
        }
        if (payload.FromDate !== undefined && payload.FromDate !== "") {
            request = {
                ...request,
                FromDate: payload.FromDate,
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== "") {
            request = {
                ...request,
                ToDate: payload.ToDate,
            }
        }
        if (payload.UserName !== undefined && payload.UserName !== "") {
            request = {
                ...request,
                UserName: payload.UserName,
            }
        }
        if (payload.IpAddress !== undefined && payload.IpAddress !== "") {
            request = {
                ...request,
                IPAddress: payload.IpAddress,
            }
        }
        if (payload.Action !== undefined && payload.Action !== "") {
            request = {
                ...request,
                Action: payload.Action,
            }
        }
        if (payload.Location !== undefined && payload.Location !== "") {
            request = {
                ...request,
                Location: payload.Location,
            }
        }
        if (payload.Mode !== undefined && payload.Mode !== "") {
            request = {
                ...request,
                Mode: payload.Mode,
            }
        }

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call activity log Api
        const response = yield call(swaggerPostAPI, Method.GetActivityLogHistoryAdmin + queryBuilder(request), {}, headers);

        // To set activity log  success response to reducer
        yield put(activityLogListSuccess(response));
    } catch (error) {

        // To set activity log  failure response to reducer
        yield put(activityLogListFailure(error));
    }
}

//Display Help & Support Dashbord Data
function* getModuleTypeAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call module type Api
        const response = yield call(swaggerGetAPI, Method.GetAllModuleData, {}, headers);

        // To set module type success response to reducer
        yield put(getModuleTypeSuccess(response));
    }
    catch (error) {
        // To set module type success response to reducer
        yield put(getModuleTypeFailure(error));
    }
}

/* Create Sagas method for activity Log List */
function* activityLogListSagas() {
    yield takeEvery(ACTIVITY_LOG_LIST, activityLogListAPI);
    yield takeEvery(GET_MODULE_TYPE, getModuleTypeAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(activityLogListSagas)
    ]);
}