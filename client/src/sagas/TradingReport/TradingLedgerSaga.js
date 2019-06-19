/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Sagas
 */
// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// import actions methods for handle response
import {
    tradingledgerSuccess,
    tradingledgerFailure,
} from 'Actions/TradingReport';

// for call api with params
import api from 'Api';

// import action types which is neccessary
import {
    TRADING_LEDGER,
    TRADING_LEDGER_REFRESH
} from 'Actions/types';

// call api for getting tradingledger with params
// Input (transaction request)
const getTradingledgerRequest = async (tradingledgerRequest) =>
    await api.get('tradingledger.js')
        .then(response => response)
        .catch(error => error);

// function for call api function and check/ handle response and call necessary methods of actions
// Input (transaction request) which is passed from component
function* tradingledgerAPI({ payload }) {
    // take neccessary params from transaction history request 
    //const { pair } = payload.tradingledgerRequest;

    try {
        // call transaction history list api function with params
        const response = yield call(getTradingledgerRequest, payload.tradingledgerRequest);
        // const data = response.data[pair];
        const data = response.data;

        // check response status and histopry length
        if (response.status === 200 && data.length > 0) {
            // call success method of action
            yield put(tradingledgerSuccess(data));
        } else {
            // call failed method of action
            yield put(tradingledgerFailure(data.message));
        }
    } catch (error) {
        // call failed method of action
        yield put(tradingledgerFailure(error));
    }
}

/**
 * trading ledger List...
 */
export function* tradingledger() {
    // call trading ledger action type and sagas api function
    yield takeEvery(TRADING_LEDGER, tradingledgerAPI);
}

/**
 * trading ledger List on refresh or apply Buttom...
 */
export function* tradingledgerRefresh() {
    // call tradingledger action type and sagas api function
    yield takeEvery(TRADING_LEDGER_REFRESH, tradingledgerAPI);
}

/**
 * trading ledger Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(tradingledger),
        fork(tradingledgerRefresh)
    ]);
}