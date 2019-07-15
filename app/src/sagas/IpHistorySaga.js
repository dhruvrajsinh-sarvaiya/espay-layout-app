import { call, put, takeLatest, select } from 'redux-saga/effects';
import { IP_HISTORY_LIST } from '../actions/ActionTypes';
import {
    ipHistoryListSuccess,
    ipHistoryListFailure
} from '../actions/Reports/IpHistoryAction';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, queryBuilder } from '../api/helper';

//Function for IP History List API
function* ipHistoryListAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create request
        var request = Method.GetIpHistory + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE;
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

        // Create Request into QueryBuilder
        let newRequest = request + queryBuilder(obj)

        // To call Ip History List api
        const response = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set Ip History list success response to reducer
        yield put(ipHistoryListSuccess(response));
    } catch (error) {
        // To set Ip History list failure response to reducer
        yield put(ipHistoryListFailure(error));
    }
}

function* IpHistorySaga() {
    // Call get Ip History Data
    yield takeLatest(IP_HISTORY_LIST, ipHistoryListAPI)
}

export default IpHistorySaga
//Sagas Effects..
