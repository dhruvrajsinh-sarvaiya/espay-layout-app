import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TRADING_LEDGERS } from '../../actions/ActionTypes';
import { getTradingLedgersBOSuccess, getTradingLedgersBOFailure } from '../../actions/Trading/TradingLedgerActions';
import { swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* tradingLedgersBOSaga() {

    //For get trading ledgers
    yield takeEvery(GET_TRADING_LEDGERS, getTradingLedgers);
}

function* getTradingLedgers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let request = {}

        if (payload.hasOwnProperty("MemberID") && payload.MemberID !== "") {
            request = {
                ...request,
                MemberID: payload.MemberID,
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
        if (payload.hasOwnProperty("Status") && payload.Status !== "") {
            request = {
                ...request,
                Status: payload.Status,
            }
        }
        if (payload.hasOwnProperty("LPType") && payload.LPType !== "") {
            request = {
                ...request, LPType: payload.LPType,
            }
        }
        if (payload.hasOwnProperty("SMSCode") && payload.SMSCode !== "") {
            request = {
                ...request,
                SMSCode: payload.SMSCode,
            }
        }
        if (payload.hasOwnProperty("TrnNo") && payload.TrnNo !== "") {
            request = {
                ...request, TrnNo: payload.TrnNo,
            }
        }
        if (payload.hasOwnProperty("MarketType") && payload.MarketType !== "") {
            request = {
                ...request,
                MarketType: payload.MarketType,
            }
        }
        if (payload.hasOwnProperty("Trade") && payload.Trade !== "") {
            request = {
                ...request, Trade: payload.Trade,
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
        if (payload.hasOwnProperty("Pair") && payload.Pair !== "") {
            request = {
                ...request, Pair: payload.Pair,
            }
        }
        if (payload.hasOwnProperty("IsMargin") && payload.IsMargin !== "") {
            request = {
                ...request, IsMargin: payload.IsMargin,
            }
        }


        // To call Trading Summary Data Api
        const response = yield call(swaggerPostAPI, Method.TradingSummary, request, headers);

        // To set Trading Summary success response to reducer
        yield put(getTradingLedgersBOSuccess(response))
    } catch (e) {
        // To set Trading Summary failure response to reducer
        yield put(getTradingLedgersBOFailure())
    }
}