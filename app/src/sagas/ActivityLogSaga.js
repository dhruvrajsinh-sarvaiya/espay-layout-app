import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { GET_ACTIVITY_LOG_LIST, GET_MODULE_TYPE } from '../actions/ActionTypes';
import { userAccessToken } from '../selector';
import { Method } from '../controllers/Constants';
import { queryBuilder, swaggerGetAPI, swaggerPostAPI } from '../api/helper';
import {
    getActivityLogListSuccess,
    getActivityLogListFailure,
    getModuleTypeSuccess,
    getModuleTypeFailure,
} from '../actions/Reports/ActivityLogActions';

export default function* ActivityLogSaga() {
    // To register Activity Log List method 
    yield takeEvery(GET_ACTIVITY_LOG_LIST, getActivityLogList);
    // To register Module Type method 
    yield takeEvery(GET_MODULE_TYPE, getModuleTypeAPI);
}

// Generator for activity log
function* getActivityLogList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request from action parameter
        let obj = {
            PageIndex: payload.PageIndex,
            Page_Size: payload.Page_Size,
        }

        // FromDate is not undefine and empty
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }

        // ToDate is not undefine and empty
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        // Device is not undefine and empty
        if (payload.Device !== undefined && payload.Device !== '') {
            obj = {
                ...obj,
                Device: payload.Device
            }
        }

        // Mode is not undefine and empty
        if (payload.Mode !== undefined && payload.Mode !== '') {
            obj = {
                ...obj,
                Mode: payload.Mode
            }
        }

        // Location is not undefine and empty
        if (payload.Location !== undefined && payload.Location !== '') {
            obj = {
                ...obj,
                Location: payload.Location
            }
        }

        // create requestUrl
        let newRequest = Method.GetActivityLogHistoryByUserId + queryBuilder(obj)

        // To call activity log list api
        const data = yield call(swaggerPostAPI, newRequest, {}, headers);

        // To set activity log list success response to reducer
        yield put(getActivityLogListSuccess(data));

    } catch (error) {
        // To set activity log list failure response to reducer
        yield put(getActivityLogListFailure());
    }
}

//fetch module type
function* getModuleTypeAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call module type api
        const data = yield call(swaggerGetAPI, Method.GetAllModuleData, {}, headers);

        // To set module type success response to reducer
        yield put(getModuleTypeSuccess(data));
    } catch (error) {
        // To set module type failure response to reducer
        yield put(getModuleTypeFailure());
    }
}