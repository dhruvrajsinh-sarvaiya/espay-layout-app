import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_ARBI_CHARGE_CONFIG_LIST, ADD_ARBI_CHARGE_CONFIG_DATA, GET_ARBI_CHARGE_CONFIG_DETAIL_LIST, UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA, ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA, } from '../../actions/ActionTypes';
import { getArbitrageChargeConfigListSuccess, getArbitrageChargeConfigListFailure, addArbitrageChargeConfigDataSuccess, addArbitrageChargeConfigDataFailure, getArbiChargeConfigDetailListSuccess, getArbiChargeConfigDetailListFailure, updateArbiChargeConfigDetailSuccess, updateArbiChargeConfigDetailFailure, addArbiChargeConfigDetailSuccess, addArbiChargeConfigDetailFailure } from '../../actions/Arbitrage/ArbitrageChargeConfigActions';

export default function* ArbitrageChargeConfigSaga() {
    // To register Get Charge Config List method
    yield takeEvery(GET_ARBI_CHARGE_CONFIG_LIST, getChargeConfigList)
    // To register Add Charge Config Data method
    yield takeEvery(ADD_ARBI_CHARGE_CONFIG_DATA, addChargeConfigData)
    // To register Get Charge Config Detail List method
    yield takeEvery(GET_ARBI_CHARGE_CONFIG_DETAIL_LIST, getChargeConfigDetailList)
    // To register Update Charge Config Detail Data method
    yield takeEvery(UPDATE_ARBI_CHARGE_CONFIG_DETAIL_DATA, updateChargeConfigDetail)
    // To register Add Charge Config Detail Data method
    yield takeEvery(ADD_ARBI_CHARGE_CONFIG_DETAIL_DATA, addChargeConfigDetail)
}

// Generator for Get Charge Config
function* getChargeConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = {
                ...obj,
                PageNo: payload.PageNo
            }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }
        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }
        if (payload.MasterID !== undefined && payload.MasterID !== '') {
            obj = {
                ...obj,
                MasterID: payload.MasterID
            }
        }

        // Create New Request
        let newRequest = Method.ListChargeConfigurationMasterArbitrageUser + queryBuilder(obj)

        // To call Get Charge Config Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers)

        // To set Get Charge Config success response to reducer
        yield put(getArbitrageChargeConfigListSuccess(data))
    } catch (error) {
        // To set Get Charge Config failure response to reducer
        yield put(getArbitrageChargeConfigListFailure())
    }
}

// Generator for Add Charge Config
function* addChargeConfigData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Charge Config Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateChargeConfigurationMasterArbitrageUser, payload, headers)

        // To set Add Charge Config success response to reducer
        yield put(addArbitrageChargeConfigDataSuccess(data))
    } catch (error) {
        // To set Add Charge Config failure response to reducer
        yield put(addArbitrageChargeConfigDataFailure())
    }
}

// Generator for Get Charge Config Detail
function* getChargeConfigDetailList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = {
                ...obj,
                PageNo: payload.PageNo
            }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }
        if (payload.MasterId !== undefined && payload.MasterId !== '') {
            obj = {
                ...obj,
                MasterId: payload.MasterId
            }
        }

        // Create New Request
        let newRequest = Method.ListChargeConfigurationDetailArbitrageUser + queryBuilder(obj)

        // To call Get Charge Config Detail Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers)

        // To set Get Charge Config Detail success response to reducer
        yield put(getArbiChargeConfigDetailListSuccess(data))
    } catch (error) {
        // To set Get Charge Config Detail failure response to reducer
        yield put(getArbiChargeConfigDetailListFailure())
    }
}

// Generator for Update Charge Config Detail
function* updateChargeConfigDetail({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let req = Method.UpdateChargeConfigurationDetailArbitrageUser + '/' + payload.ChargeConfigDetailId

        // ChargeConfigurationDetailId is not include in request 
        delete payload['ChargeConfigDetailId']

        // To call Update Charge Config Data Api
        const data = yield call(swaggerPostAPI, req, payload, headers)

        // To set Update Charge Config Detail success response to reducer
        yield put(updateArbiChargeConfigDetailSuccess(data))
    } catch (error) {
        // To set Update Charge Config Detail failure response to reducer
        yield put(updateArbiChargeConfigDetailFailure())
    }
}

// Generator for Add Charge Config Detail
function* addChargeConfigDetail({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // ChargeConfigurationDetailId is not include in request 
        delete payload['ChargeConfigDetailId']
        
        // To call Add Charge Config Data Api
        const data = yield call(swaggerPostAPI, Method.AddChargeConfigurationDeatilArbitrageUser, payload, headers)

        // To set Add Charge Config Detail success response to reducer
        yield put(addArbiChargeConfigDetailSuccess(data))
    } catch (error) {
        // To set Add Charge Config Detail failure response to reducer
        yield put(addArbiChargeConfigDetailFailure())
    }
}