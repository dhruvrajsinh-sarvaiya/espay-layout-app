// sagas For Market Trade History Actions By Tejas Date : 14/9/2018

// effects for redux-saga
import { all, fork, put } from 'redux-saga/effects';

// action sfor set data or response
import {
    getMarketTradeHistoryFailure
} from 'Actions/Trade';

// Sagas Function for get Market Trade History list data by :Tejas Date : 14/9/2018
function* getMarketTradeHistory() {
    const error = [{ "error": "error" }];
    yield put(getMarketTradeHistoryFailure(error));
}

function* changeMarketTradeSocketConnection() {
    const error = [{ "error": "error" }];
    yield put(getMarketTradeHistoryFailure(error));
}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getMarketTradeHistory),
        fork(changeMarketTradeSocketConnection),
    ]);
}