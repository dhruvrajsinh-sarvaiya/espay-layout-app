import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_LEVERAGE_CONFIG_LIST, DELETE_LEVERAGE_CONFIG_DATA, ADD_LEVERAGE_CONFIG_DATA } from '../../actions/ActionTypes';
import { getLeverageConfigListSuccess, getLeverageConfigListFailure, deleteLeverageConfigDataSuccess, deleteLeverageConfigDataFailure, addLeverageConfigDataSuccess, addLeverageConfigDataFailure } from '../../actions/Margin/LeverageConfigActions';

export default function* LeverageConfigSaga() {
    // Get Leverage Request List
    yield takeEvery(GET_LEVERAGE_CONFIG_LIST, getLeverageConfigList);
    // Delete Leverage Config Data
    yield takeEvery(DELETE_LEVERAGE_CONFIG_DATA, deleteLeverageConfigData);
    // Add/Edit Leverage Config Data
    yield takeEvery(ADD_LEVERAGE_CONFIG_DATA, addLeverageConfigData);
}

// Generator for Add/Edit Leverage Configuration List
function* addLeverageConfigData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Leverage Config List Data Api
        const data = yield call(swaggerPostAPI, Method.InserUpdateLeverage, payload, headers);

        // To set Add/Edit Leverage Config success response to reducer
        yield put(addLeverageConfigDataSuccess(data));
    } catch (error) {
        // To set Add/Edit Leverage Config failure response to reducer
        yield put(addLeverageConfigDataFailure());
    }
}

// Generator for Delete Leverage Configuration List
function* deleteLeverageConfigData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Leverage Config List Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeLeverageStatus + '/' + payload.Id + '/9', payload, headers);

        // To set Delete Leverage Config success response to reducer
        yield put(deleteLeverageConfigDataSuccess(data));
    } catch (error) {
        // To set Delete Leverage Config failure response to reducer
        yield put(deleteLeverageConfigDataFailure());
    }
}

// Generator for Get Leverage Configuration List
function* getLeverageConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let obj = {}
        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: payload.Status
            }
        }

        // Create New Request
        let request = Method.ListLeverage + queryBuilder(obj)

        // To call Get Leverage Config List Data Api
        const data = yield call(swaggerGetAPI, request, obj, headers);

        // To set Get Leverage Config List success response to reducer
        yield put(getLeverageConfigListSuccess(data));
    } catch (error) {
        // To set Get Leverage Config List failure response to reducer
        yield put(getLeverageConfigListFailure());
    }
}