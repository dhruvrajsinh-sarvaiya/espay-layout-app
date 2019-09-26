import { put, takeEvery, select, call } from 'redux-saga/effects';
import { GET_TRADING_SUMMARY_LPWISE_LIST } from '../../actions/ActionTypes';
import { getTradingSummaryLPWiseListSuccess, getTradingSummaryLPWiseListFailure } from '../../actions/Trading/TradeRoutingAction';
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
import { swaggerPostAPI } from '../../api/helper';

export default function* TradeRoutingSaga() {
    //call api's
    yield takeEvery(GET_TRADING_SUMMARY_LPWISE_LIST, getTradeSummaryLPWiseList);
}

function* getTradeSummaryLPWiseList({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let request = {}

        if (payload.hasOwnProperty("MemberID") && payload.MemberID !== "") {
            request = {
                ...request, MemberID: payload.MemberID,
            }
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            request = {
                ...request, ToDate: payload.ToDate,
            }
        }
        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            request = {
                ...request, FromDate: payload.FromDate,
            }
        }
        if (payload.hasOwnProperty("TrnNo") && payload.TrnNo !== "") {
            request = {
                ...request, TrnNo: payload.TrnNo,
            }
        }
        if (payload.hasOwnProperty("Status") && payload.Status !== "") {
            request = {
                ...request, Status: payload.Status,
            }
        }
        if (payload.hasOwnProperty("SMSCode") && payload.SMSCode !== "") {
            request = {
                ...request, SMSCode: payload.SMSCode,
            }
        }
        if (payload.hasOwnProperty("Trade") && payload.Trade !== "") {
            request = {
                ...request, Trade: payload.Trade,
            }
        }
        if (payload.hasOwnProperty("Pair") && payload.Pair !== "") {
            request = {
                ...request, Pair: payload.Pair,
            }
        }
        if (payload.hasOwnProperty("MarketType") && payload.MarketType !== "") {
            request = {
                ...request, MarketType: payload.MarketType,
            }
        }
        if (payload.hasOwnProperty("LPType") && payload.LPType !== "") {
            request = {
                ...request, LPType: payload.LPType,
            }
        }
        if (payload.hasOwnProperty("PageNo") && payload.PageNo !== "") {
            request = {
                ...request, PageNo: payload.PageNo,
            }
        }
        if (payload.hasOwnProperty("PageSize") && payload.PageSize !== "") {
            request = {
                ...request, PageSize: payload.PageSize,
            }
        }
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin !== "") {
            request = {
                ...request, IsMargin: payload.IsMargin,
            }
        }

        // To call trading summary lp wise api
        const data = yield call(swaggerPostAPI, Method.TradingSummaryLPWise, request, headers);

        // To set trading summary lp wise success response to reducer
        yield put(getTradingSummaryLPWiseListSuccess(data));
    } catch (error) {

        // To set trading summary lp wise failure response to reducer
        yield put(getTradingSummaryLPWiseListFailure(error));
    }
}