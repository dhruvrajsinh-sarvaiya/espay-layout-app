import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from "../../api/helper";
import { ARBITRAGE_LP_CHARGE_CONFIG_LIST, ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE, ARBITRAGE_LP_CHARGE_CONFIG_DETAIL, ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE } from "../../actions/ActionTypes";
import { getLpChargeConfigListSuccess, getLpChargeConfigListFailure, addEditDeleteLpChargeConfigSuccess, addEditDeleteLpChargeConfigFailure, getLpChargeConfigDetailListSuccess, getLpChargeConfigDetailListFailure, addEditDeleteLpChargeConfigDetailSuccess, addEditDeleteLpChargeConfigDetailFailure } from "../../actions/Arbitrage/ArbitrageLpChargeConfigActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

//getLpChargeConfigListApi
function* getLpChargeConfigListApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Lp Charge Config list Api
        const response = yield call(swaggerGetAPI, Method.ListArbitrageChargeConfigurationMasterLP + queryBuilder(payload), {}, headers);

        // To set Lp Charge Config list success response to reducer
        yield put(getLpChargeConfigListSuccess(response));
    } catch (error) {

        // To set Lp Charge Config list failure response to reducer
        yield put(getLpChargeConfigListFailure(error));
    }
}

//addEditDeleteLpChargeConfigApi
function* addEditDeleteLpChargeConfigApi({ payload }) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add Lp Charge Config  Api
        const response = yield call(swaggerPostAPI, Method.InsertUpdateArbitrageChargeConfigurationMasterLP, payload, headers);

        // To set add Lp Charge Configt success response to reducer
        yield put(addEditDeleteLpChargeConfigSuccess(response));
    } catch (error) {

        // To set add top history list failure response to reducer
        yield put(addEditDeleteLpChargeConfigFailure(error));
    }
}

//getLpChargeConfigList detail Api
function* getLpChargeConfigListDetailApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call top history list Api
        const response = yield call(swaggerGetAPI, Method.ListArbitrageChargeConfigurationDetailLP + queryBuilder(payload), {}, headers);

        // To set Lp Charge Config list success response to reducer
        yield put(getLpChargeConfigDetailListSuccess(response));
    } catch (error) {

        // To set Lp Charge Config list failure response to reducer
        yield put(getLpChargeConfigDetailListFailure(error));
    }
}

//addEditDeleteLpChargeConfigdetailApi
function* addEditDeleteLpChargeConfigDetailApi({ payload }) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add Lp Charge Config  Api
        const response = yield call(swaggerPostAPI, Method.InsertUpdateArbitrageChargeConfigurationDetailLP, payload, headers);

        // To set add Lp Charge Configt success response to reducer
        yield put(addEditDeleteLpChargeConfigDetailSuccess(response));
    } catch (error) {

        // To set add top history list failure response to reducer
        yield put(addEditDeleteLpChargeConfigDetailFailure(error));
    }
}

//call Apis
export function* ArbitrageLpChargeConfigSaga() {
    yield takeEvery(ARBITRAGE_LP_CHARGE_CONFIG_LIST, getLpChargeConfigListApi);
    yield takeEvery(ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE, addEditDeleteLpChargeConfigApi);
    yield takeEvery(ARBITRAGE_LP_CHARGE_CONFIG_DETAIL, getLpChargeConfigListDetailApi);
    yield takeEvery(ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE, addEditDeleteLpChargeConfigDetailApi);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ArbitrageLpChargeConfigSaga),
    ]);
}
