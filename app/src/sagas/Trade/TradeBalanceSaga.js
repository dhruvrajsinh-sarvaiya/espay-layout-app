import {
    GET_CURRENCY_BALANCE,
} from '../../actions/ActionTypes'

import { select, put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { getCurrencyBalanceSuccess, getCurrencyBalanceFailure } from '../../actions/Trade/TradeBalanceActions';
import { userAccessToken } from '../../selector';

export default function* tradeBalanceSaga() {

    // For Wallet Balance
    yield takeLatest(GET_CURRENCY_BALANCE, getCurrencyBalance)
}

function* getCurrencyBalance() {

    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const response = yield call(swaggerGetAPI, Method.ListWallet, {}, headers);
        yield put(getCurrencyBalanceSuccess(response))
    } catch (error) {
        yield put(getCurrencyBalanceFailure());
    }
}