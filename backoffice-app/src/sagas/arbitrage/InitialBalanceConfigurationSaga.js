// InitialBalanceConfigurationSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_INITIAL_BALANCE_CONFIGURATION_LIST, ADD_INITIAL_BALANCE_CONFIGURATION } from '../../actions/ActionTypes';
import {
    getInitialBalanceConfigurationListSuccess, getInitialBalanceConfigurationListFailure,
    addInitialBalanceSuccess, addInitialBalanceFailure,
} from '../../actions/Arbitrage/InitialBalanceConfigurationActions';

export default function* InitialBalanceConfigurationSaga() {
    // To register Get Initial Balance Configuration List method
    yield takeEvery(GET_INITIAL_BALANCE_CONFIGURATION_LIST, getInitialBalanceConfigList)
    // to Add Initial Balance
    yield takeEvery(ADD_INITIAL_BALANCE_CONFIGURATION, addInitialBalance)
}

// Generator for Get Initial Balance Configuration
function* getInitialBalanceConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.ProviderBalanceTopupReport + queryBuilder(payload)

        // To call Get Initial Balance Configuration Data Api
        const data = yield call(swaggerGetAPI, url, {}, headers)

        // To set Get Initial Balance Configuration success response to reducer
        yield put(getInitialBalanceConfigurationListSuccess(data))
    } catch (error) {
        // To set Get Initial Balance Configuration failure response to reducer
        yield put(getInitialBalanceConfigurationListFailure())
    }
}

// Generator for Add Initial Balance
function* addInitialBalance({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Initial Balance Data Api
        const data = yield call(swaggerPostAPI, Method.ArbitrageProviderFundTransafer, payload, headers);

        // To set Add Initial Balance success response to reducer
        yield put(addInitialBalanceSuccess(data));
    } catch (error) {
        // To set Add Initial Balance failure response to reducer
        yield put(addInitialBalanceFailure());
    }
}