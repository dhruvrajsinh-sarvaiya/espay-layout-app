// ArbitrageCoinConfigurationSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    GET_ARBITRAGE_COIN_CONFIGURATION_LIST,
    ADD_ARBITRAGE_COIN_CONFIGURATION_DATA,
    UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA,
} from '../../actions/ActionTypes';
import {
    getArbiCoinConfigurationListSuccess, getArbiCoinConfigurationListFailure,
    addArbiCoinConfigurationListDataSuccess, addArbiCoinConfigurationListDataFailure,
    updateArbiCoinConfigurationListDataSuccess, updateArbiCoinConfigurationListDataFailure,
} from '../../actions/Arbitrage/ArbitrageCoinConfigurationActions';

export default function* ArbitrageCoinConfigurationSaga() {
    // To register Get Arbitrage Coin Configuration List method
    yield takeEvery(GET_ARBITRAGE_COIN_CONFIGURATION_LIST, getArbitrageCoinConfigList)
    // To register Add Arbitrage Coin Configuration Data
    yield takeEvery(ADD_ARBITRAGE_COIN_CONFIGURATION_DATA, addArbitrageCoinConfigList)
    // To register Update Arbitrage Coin Configuration Data
    yield takeEvery(UPDATE_ARBITRAGE_COIN_CONFIGURATION_DATA, updateArbitrageCoinConfigList)
}

// Generator for Get Arbitrage Coin Configuration
function* getArbitrageCoinConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // for create request
        let url = Method.GetAllServiceConfigurationDataArbitrage + queryBuilder(payload)

        // To call Get Arbitrage Coin Config Data Api
        const data = yield call(swaggerGetAPI, url, {}, headers)

        // To set Get Arbitrage Coin Config success response to reducer
        yield put(getArbiCoinConfigurationListSuccess(data))
    } catch (error) {
        // To set Get Arbitrage Coin Config failure response to reducer
        yield put(getArbiCoinConfigurationListFailure())
    }
}

// Geenarator for Add Arbitrage Coin Configuration
function* addArbitrageCoinConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Arbitrage Coin Config Data Api
        const data = yield call(swaggerPostAPI, Method.AddServiceConfigurationArbitrage, payload, headers)

        // To set Add Arbitrage Coin Config success response to reducer
        yield put(addArbiCoinConfigurationListDataSuccess(data))
    } catch (error) {
        // To set Add Arbitrage Coin Config failure response to reducer
        yield put(addArbiCoinConfigurationListDataFailure())
    }
}

// Geenarator for Update Arbitrage Coin Configuration
function* updateArbitrageCoinConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Arbitrage Coin Config Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateServiceConfigurationArbitrage, payload, headers)

        // To set Update Arbitrage Coin Config success response to reducer
        yield put(updateArbiCoinConfigurationListDataSuccess(data))
    } catch (error) {
        // To set Update Arbitrage Coin Config failure response to reducer
        yield put(updateArbiCoinConfigurationListDataFailure())
    }
}