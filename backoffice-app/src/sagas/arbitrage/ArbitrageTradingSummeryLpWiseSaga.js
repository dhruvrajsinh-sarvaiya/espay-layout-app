// ArbitrageTradingSummeryLpWiseSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST } from '../../actions/ActionTypes';
import { getArbitrageTradingSummeryListSuccess, getArbitrageTradingSummeryListFailure } from '../../actions/Arbitrage/ArbitrageTradingSummeryLpWiseActions';

export default function* ArbitrageTradingSummeryLpWiseSaga() {
    // To register Get arbitrage trading summery lp wise List method
    yield takeEvery(GET_ARBITRAGE_TRADING_SUMMERY_LP_WISE_LIST, getArbitrageLpWiseList)
}

// Generator for Get arbitrage trading summery lp wise
function* getArbitrageLpWiseList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let obj = {}

        if (payload.MemberID !== undefined && payload.MemberID !== '') {
            obj = { ...obj, MemberID: payload.MemberID }
        }

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = { ...obj, FromDate: payload.FromDate }
        }

        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = { ...obj, ToDate: payload.ToDate }
        }

        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = { ...obj, PageNo: payload.PageNo }
        }

        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = { ...obj, PageSize: payload.PageSize }
        }

        if (payload.TrnNo !== undefined && payload.TrnNo !== '') {
            obj = { ...obj, TrnNo: payload.TrnNo }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = { ...obj, Status: payload.Status }
        }

        if (payload.SMSCode !== undefined && payload.SMSCode !== '') {
            obj = { ...obj, SMSCode: payload.SMSCode }
        }

        if (payload.Trade !== undefined && payload.Trade !== '') {
            obj = { ...obj, Trade: payload.Trade }
        }

        if (payload.Pair !== undefined && payload.Pair !== '') {
            obj = { ...obj, Pair: payload.Pair }
        }

        if (payload.MarketType !== undefined && payload.MarketType !== '') {
            obj = { ...obj, MarketType: payload.MarketType }
        }

        if (payload.LPType !== undefined && payload.LPType !== '') {
            obj = { ...obj, LPType: payload.LPType }
        }

        if (payload.IsMargin !== undefined && payload.IsMargin !== '') {
            obj = { ...obj, IsMargin: payload.IsMargin }
        }

        // To call Get arbitrage trading summery lp wise Data Api
        const data = yield call(swaggerPostAPI, Method.TradingSummaryLPWiseArbitrage, obj, headers)

        // To set Get arbitrage trading summery lp wise success response to reducer
        yield put(getArbitrageTradingSummeryListSuccess(data))
    } catch (error) {
        // To set Get arbitrage trading summery lp wise failure response to reducer
        yield put(getArbitrageTradingSummeryListFailure())
    }
}