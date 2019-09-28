import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TRADE_SUMMARY_LIST, GET_TRADE_SETTLED_LIST } from '../../actions/ActionTypes';
import { getTradeSummaryListSuccess, getTradeSummaryListFailure, getTradingSettledListSuccess, getTradingSettledListFailure } from '../../actions/Trading/TradingSummaryActions';
import { swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* tradingSummarySaga() {

    //For get trading summary
    yield takeEvery(GET_TRADE_SUMMARY_LIST, getTradeSummaryList);

    //For get trading settled history
    yield takeEvery(GET_TRADE_SETTLED_LIST, getTradeSettledList);
}

function* getTradeSummaryList({ payload }) {
    try {
        //to get tokenID of currently logged in user. 
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let request = {}

        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            request = {
                ...request,
                FromDate: payload.FromDate,
            }
        }
        if (payload.hasOwnProperty("MemberID") && payload.MemberID !== "") {
            request = {
                ...request,
                MemberID: payload.MemberID,
            }
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            request = {
                ...request,
                ToDate: payload.ToDate,
            }
        }
        if (payload.hasOwnProperty("TrnNo") && payload.TrnNo !== "") {
            request = {
                ...request,
                TrnNo: payload.TrnNo,
            }
        }
        if (payload.hasOwnProperty("Status") && payload.Status !== "") {
            request = {
                ...request,
                Status: payload.Status,
            }
        }
        if (payload.hasOwnProperty("SMSCode") && payload.SMSCode !== "") {
            request = {
                ...request,
                SMSCode: payload.SMSCode,
            }
        }
        if (payload.hasOwnProperty("MarketType") && payload.MarketType !== "") {
            request = {
                ...request,
                MarketType: payload.MarketType,
            }
        }
        if (payload.hasOwnProperty("LPType") && payload.LPType !== "") {
            request = {
                ...request,
                LPType: payload.LPType,
            }
        }
        if (payload.hasOwnProperty("PageNo") && payload.PageNo !== "") {
            request = {
                ...request,
                PageNo: payload.PageNo,
            }
        }
        if (payload.hasOwnProperty("PageSize") && payload.PageSize !== "") {
            request = {
                ...request,
                PageSize: payload.PageSize,
            }
        }
        if (payload.hasOwnProperty("Trade") && payload.Trade !== "") {
            request = {
                ...request,
                Trade: payload.Trade,
            }
        }
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin !== "") {
            request = {
                ...request,
                IsMargin: payload.IsMargin,
            }
        }
        if (payload.hasOwnProperty("Pair") && payload.Pair !== "") {
            request = {
                ...request,
                Pair: payload.Pair,
            }
        }

        // To call trade summary list api
        const data = yield call(swaggerPostAPI, Method.TradingSummary, request, headers);

        // To set trade summary list success response to reducer
        yield put(getTradeSummaryListSuccess(data));
    } catch (error) {

        // To set trade summary list failure response to reducer
        yield put(getTradeSummaryListFailure());
    }
}

function* getTradeSettledList({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let request = {}

        if (payload.hasOwnProperty("MemberID") && payload.MemberID !== "") {
            request = {
                ...request,
                MemberID: payload.MemberID,
            }
        }
        if (payload.hasOwnProperty("Pair") && payload.Pair !== "") {
            request = {
                ...request,
                PairName: payload.Pair,
            }
        }
        if (payload.hasOwnProperty("MarketType") && payload.MarketType !== "") {
            request = {
                ...request,
                OrderType: payload.MarketType,
            }
        }
        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            request = {
                ...request,
                FromDate: payload.FromDate,
            }
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            request = {
                ...request,
                ToDate: payload.ToDate,
            }
        }
        if (payload.hasOwnProperty("TrnNo") && payload.TrnNo !== "") {
            request = {
                ...request,
                TrnNo: payload.TrnNo,
            }
        }
        if (payload.hasOwnProperty("PageNo") && payload.PageNo !== "") {
            request = {
                ...request,
                PageNo: payload.PageNo,
            }
        }
        if (payload.hasOwnProperty("PageSize") && payload.PageSize !== "") {
            request = {
                ...request,
                PageSize: payload.PageSize,
            }
        }
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin !== "") {
            request = {
                ...request,
                IsMargin: payload.IsMargin,
            }
        }
        if (payload.hasOwnProperty("TrnType") && payload.TrnType !== "") {
            request = {
                ...request,
                TrnType: payload.TrnType,
            }
        }
        if (payload.hasOwnProperty("Trade") && payload.Trade !== "") {
            request = {
                ...request,
                TrnType: payload.Trade,
            }
        }

        // To call trade settled history api
        const data = yield call(swaggerPostAPI, Method.TradeSettledHistoryBO, request, headers);

        // To set trade settled history success response to reducer
        yield put(getTradingSettledListSuccess(data));
    } catch (error) {

        // To set trade settled history failure response to reducer
        yield put(getTradingSettledListFailure());
    }
}