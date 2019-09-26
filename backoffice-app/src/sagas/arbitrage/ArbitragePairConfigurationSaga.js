import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, queryBuilder, swaggerPostAPI } from "../../api/helper";
import { ARBITRAGE_PAIR_LIST_CONFIGURATION, ADD_ARBITRAGE_PAIR_CONFIGURATION, UPDATE_ARBITRAGE_PAIR_CONFIGURATION, } from "../../actions/ActionTypes";
import {
    getArbiPairConfigListSuccess, getArbiPairConfigListFailure,
    addArbiPairConfigFailure, addArbiPairConfigSuccess,
    updateArbiPairConfigSuccess, updateArbiPairConfigFailure
} from "../../actions/Arbitrage/ArbitragePairConfigurationActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

//getArbipairConfigListApi
function* getArbipairConfigListApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitrage Pair Config list Api
        const response = yield call(swaggerGetAPI, Method.GetAllPairConfigurationArbitrage + queryBuilder(payload), {}, headers);

        // To set Arbitrage Pair Config list success response to reducer
        yield put(getArbiPairConfigListSuccess(response));
    } catch (error) {

        // To set Arbitrage Pair Config list failure response to reducer
        yield put(getArbiPairConfigListFailure(error));
    }
}

//getAddArbiPairConfig
function* getAddArbiPairConfig({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitrage Pair Config add Api
        const response = yield call(swaggerPostAPI, Method.AddPairConfigurationArbitrage, payload, headers);

        // To set Arbitrage Pair Config add success response to reducer
        yield put(addArbiPairConfigSuccess(response));
    } catch (error) {

        // To set Arbitrage Pair Config add failure response to reducer
        yield put(addArbiPairConfigFailure(error));
    }
}

//getUpdateArbiPairConfig
function* getUpdateArbiPairConfig({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitrage Pair Config update Api
        const response = yield call(swaggerPostAPI, Method.UpdatePairConfigurationArbitrage, payload, headers);

        // To set Arbitrage Pair Config update success response to reducer
        yield put(updateArbiPairConfigSuccess(response));
    } catch (error) {

        // To set Arbitrage Pair Config update failure response to reducer
        yield put(updateArbiPairConfigFailure(error));
    }
}

//call Apis
export function* ArbitragePairConfigurationSaga() {
    // To register Arbitrage Pair List Configuration method
    yield takeEvery(ARBITRAGE_PAIR_LIST_CONFIGURATION, getArbipairConfigListApi);
    // To register Add Arbitrage Pair Configuration method
    yield takeEvery(ADD_ARBITRAGE_PAIR_CONFIGURATION, getAddArbiPairConfig);
    // To register Update Arbitrage Pair Configuration method
    yield takeEvery(UPDATE_ARBITRAGE_PAIR_CONFIGURATION, getUpdateArbiPairConfig);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ArbitragePairConfigurationSaga),
    ]);
}
