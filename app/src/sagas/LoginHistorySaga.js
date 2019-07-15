import { LOGIN_HISTORY_LIST } from "../actions/ActionTypes";
import { call, select, put, takeLatest } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import {
    loginHistoryListSuccess,
    loginHistoryListFailure,
    loginHistoryWidgetSuccess
} from '../actions/Reports/LoginHistoryAction';
import { swaggerGetAPI, queryBuilder } from '../api/helper';

//Function for Login History List API
function* loginHistoryListAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create requestUrl
        var request = Method.GetLoginHistory + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE;

        // Create request
        let obj = {}

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

        // Create request into QueryBuilder
        let newRequest = request + queryBuilder(obj)

        // To call Login History api
        const response = yield call(swaggerGetAPI, newRequest, {}, headers);

        // requested action is widget or not
        if (payload.isWidget === undefined)
            // To set login history list success response to reducer
            yield put(loginHistoryListSuccess(response));
        else
            // To set login history widget success response to reducer
            yield put(loginHistoryWidgetSuccess(response));
    } catch (error) {
        // To set login history list faillure response to reducer
        yield put(loginHistoryListFailure(error));
    }
}

function* LoginHistorySaga() {
    // Call get Login History Data
    yield takeLatest(LOGIN_HISTORY_LIST, loginHistoryListAPI);
}

export default LoginHistorySaga
