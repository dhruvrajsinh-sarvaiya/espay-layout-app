import {
    BUY_SELL_TRADE,
} from '../../actions/ActionTypes'

import { put, call, select, takeLatest } from 'redux-saga/effects';
import { onBuySellTradeSuccess, onBuySellTradeFailure } from '../../actions/Trade/BuySellTradeActions';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI } from '../../api/helper';

export default function* buySellTradeSaga() {

    //For Buy Sell Trades with Limit, Market, Stop Limit and Spot Orders
    yield takeLatest(BUY_SELL_TRADE, buySellTrade);
}

function* buySellTrade({ payload }) {
    try {

        //From API
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //TrnMode :  PHP : 21, Android : 31
        let request = {
            CurrencyPairID: payload.CurrencyPairID,
            DebitWalletID: payload.DebitWalletID,
            CreditWalletID: payload.CreditWalletID,
            FeePer: payload.FeePer,
            Fee: payload.Fee,
            TrnMode: 21,
            Price: payload.Price,
            Amount: payload.Amount,
            Total: payload.Total,
            OrderType: payload.OrderType,
            OrderSide: payload.OrderSide,
            StopPrice: payload.StopPrice,
        };

        let methodName;
        if (payload.IsMargin !== undefined && payload.IsMargin == 0) {
            methodName = Method.CreateTransactionOrderBG;
        } else if (payload.IsMargin !== undefined && payload.IsMargin == 1) {
            methodName = Method.CreateTransactionOrderMargin;
        }
        const response = yield call(swaggerPostAPI, methodName + '/' + payload.pair, request, headers);
        // const response = { "response": { "TrnID": "a76554c0-5462-43f4-9d03-4ca15c432fec" }, "ReturnCode": 0, "ReturnMsg": "Order Created", "ErrorCode": 4566, "statusCode": 200 };

        yield put(onBuySellTradeSuccess(response))
    } catch (error) {
        yield put(onBuySellTradeFailure());
    }
}