import { FETCH_ORDER_HISTORY } from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI } from "../../api/helper";
import { Method } from "../../controllers/Constants";
import { onOrderHistorySuccess, onOrderHistoryFailure } from "../../actions/Trade/OrderHistoryActions";
import { put, call, select, takeLatest } from 'redux-saga/effects';

export default function* orderHistorySaga() {
    //For Trade History / Order History
    yield takeLatest(FETCH_ORDER_HISTORY, fetchOrderHistory);
}

function* fetchOrderHistory({ payload }) {
    try {
        let params = {}

        //If pair name is not undefined then pass pair name
        if (payload.pairName) {
            params = { ...params, Pair: payload.pairName };
        }
    
        //If trade type is not undefined then pass trade type
        if (payload.trade) {
            params = { ...params, Trade: payload.trade };
        }
    
        //If fromDate and toDate is not undefined then pass range dates.
        if (payload.fromDate && payload.toDate) {
            params = { ...params, FromDate: payload.fromDate, ToDate: payload.toDate };
        }
    
        //If status is not undefined then pass status.
        if (payload.status) {
            params = { ...params, Status: payload.status };
        }
    
        //If market type is not undefined then pass market type
        if (payload.marketType) {
            params = { ...params, MarketType: payload.marketType };
        }
    
        //If IsMargin is not undefined then pass market type
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            params = { ...params, IsMargin: payload.IsMargin };
        }
    
        //Passing page number, If page is not passed in payload then use 1 page
        params = { ...params, Page: payload.page ? payload.page : 0 };
    
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const response = yield call(swaggerPostAPI, Method.GetTradeHistory, params, headers);
        yield put(onOrderHistorySuccess(response))
    } catch (error) {
        yield put(onOrderHistoryFailure());
    }
}