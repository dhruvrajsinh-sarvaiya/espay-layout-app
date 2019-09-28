import { LOGIN_HISTORY_LIST } from "../../actions/ActionTypes";
import { call, select, put, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import {
    loginHistoryListSuccess,
    loginHistoryListFailure
} from '../../actions/Reports/LoginHistoryAction';
import { swaggerGetAPI, queryBuilder } from '../../api/helper';

//Function for Login History List API
function* loginHistoryListAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        //request 
        var Request = Method.GetLoginHistory + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
        let obj = {}
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }
        // Create Request into QueryBuilder
        let newRequest = Request + queryBuilder(obj)

        // To call login history data api
        const response = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set login history data success response to reducer
        yield put(loginHistoryListSuccess(response));
    } catch (error) {

        // To set login history data failure response to reducer
        yield put(loginHistoryListFailure(error));
    }
}

function* LoginHistorySaga() {
    // Call get Login History Data
    yield takeLatest(LOGIN_HISTORY_LIST, loginHistoryListAPI);
}

export default LoginHistorySaga
