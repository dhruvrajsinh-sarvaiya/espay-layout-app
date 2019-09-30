// LiquidityAPIManagerSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
    GET_LIQUIDITY_API_MANAGER_LIST,
    ADD_LIQUIDITY_API_MANAGER_LIST,
    UPDATE_LIQUIDITY_API_MANAGER_LIST,
    GET_PROVIDERS_LIST,
    GET_LIMIT_DATA,
    GET_SERVICE_PROVIDER,
    GET_DAEMON_CONFIG,
    GET_SERVICE_CONFIG,
    GET_PROVIDER_TYPE,
    GET_TRANSACTION_TYPE,
} from '../../actions/ActionTypes';
import {
    GetLiquidityAPIManagerListSuccess,
    GetLiquidityAPIManagerListFailure,

    AddLiquidityAPIManagerDataSuccess,
    AddLiquidityAPIManagerDataFailure,

    EditLiquidityAPIManagerDataSuccess,
    EditLiquidityAPIManagerDataFailure,

    GetApiProviderListSuccess,
    GetApiProviderListFailure,

    GetLimitdataListSuccess,
    GetLimitdataListFailure,

    GetServiceProviderListSuccess,
    GetServiceProviderListFailure,

    GetDaemonConfigListSuccess,
    GetDaemonConfigListFailure,

    GetproviderConfigListSuccess,
    GetproviderConfigListFailure,

    GetProviderTypeListSuccess,
    GetProviderTypeListFailure,

    GetTransactionTypeListSuccess,
    GeTransactionTypeListFailure,
} from '../../actions/Trading/LiquidityAPIManagerAction';
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from '../../selector';

// Generator for fetching list of LiquidityAPIManager 
function* LiquidityAPIManagerFatchData() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all liquidity api manager list api
        const data = yield call(swaggerGetAPI, Method.GetAllLiquidityAPIManager, {}, headers);

        // To set all liquidity api manager list success response to reducer
        yield put(GetLiquidityAPIManagerListSuccess(data))
    } catch (e) {

        // To set all liquidity api manager list failure response to reducer
        yield put(GetLiquidityAPIManagerListFailure())
    }
}

// Generator for add New LiquidityAPIManager data
function* AddLiquidityAPIManager(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add liquidity api manager api
        const data = yield call(swaggerPostAPI, Method.AddLiquidityAPIManager, payload.data, headers)

        // To set add liquidity api manager success response to reducer
        yield put(AddLiquidityAPIManagerDataSuccess(data))
    } catch (e) {

        // To set add liquidity api manager failure response to reducer
        yield put(AddLiquidityAPIManagerDataFailure())
    }
}

// Generator for edit LiquidityAPIManager data
function* EditLiquidityAPIManager(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call edit iquidity api manager api
        const data = yield call(swaggerPostAPI, Method.UpdateLiquidityAPIManager, payload.data, headers)

        // To set edit iquidity api manager success response to reducer
        yield put(EditLiquidityAPIManagerDataSuccess(data))
    } catch (e) {

        // To set edit iquidity api manager failure response to reducer
        yield put(EditLiquidityAPIManagerDataFailure())
    }
}

// Generator for ApiProviderList
function* ApiProviderList() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all third party api
        const data = yield call(swaggerGetAPI, Method.GetAllThirdPartyAPI, {}, headers)

        // To set all third party success response to reducer
        yield put(GetApiProviderListSuccess(data))
    } catch (e) {

        // To set all third party failure response to reducer
        yield put(GetApiProviderListFailure())
    }
}

// Generator for LimitList
function* LimitList() {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all limit api
        const data = yield call(swaggerGetAPI, Method.GetAllLimitData, {}, headers)

        // To set all limit success response to reducer
        yield put(GetLimitdataListSuccess(data))
    } catch (e) {

        // To set all limit failure response to reducer
        yield put(GetLimitdataListFailure())
    }
}

// Generator for Serviceproviderlist
function* Serviceproviderlist() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call provider list api
        const data = yield call(swaggerGetAPI, Method.GetProviderList, {}, headers)

        // To set provider list success response to reducer
        yield put(GetServiceProviderListSuccess(data))
    } catch (e) {

        // To set provider list failure response to reducer
        yield put(GetServiceProviderListFailure())
    }
}

// Generator for DaemonConfigurationlist
function* DaemonConfigurationlist() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call demon config api
        const data = yield call(swaggerPostAPI, Method.ListDemonConfig, {}, headers)

        // To set demon config success response to reducer
        yield put(GetDaemonConfigListSuccess(data))
    } catch (e) {

        // To set demon config failure response to reducer
        yield put(GetDaemonConfigListFailure())
    }
}

// Generator for ProviderConfigurationlist
function* ProviderConfigurationlist() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call provider configuration list api
        const data = yield call(swaggerPostAPI, Method.ListProviderConfiguration, {}, headers)

        // To set provider configuration list success response to reducer
        yield put(GetproviderConfigListSuccess(data))
    } catch (e) {

        // To set provider configuration list failure response to reducer
        yield put(GetproviderConfigListFailure())
    }
}

// Generator for Providertypelist
function* Providertypelist() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call service provider type api
        const data = yield call(swaggerGetAPI, Method.GetServiceProviderType, {}, headers)

        // To set service provider type success response to reducer
        yield put(GetProviderTypeListSuccess(data))
    } catch (e) {

        // To set service provider type failure response to reducer
        yield put(GetProviderTypeListFailure())
    }
}
// Generator for Transactiontypelist
function* Transactiontypelist() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call all transaction type api
        const data = yield call(swaggerGetAPI, Method.GetAllTransactionType, {}, headers)

        // To set all transaction type success response to reducer
        yield put(GetTransactionTypeListSuccess(data))
    } catch (e) {

        // To set all transaction type failure response to reducer
        yield put(GeTransactionTypeListFailure())
    }
}

//call api's
function* LiquidityAPIManagerSaga() {
    // To register Get Liquidity Api Manager List method
    yield takeLatest(GET_LIQUIDITY_API_MANAGER_LIST, LiquidityAPIManagerFatchData)
    // To register Add Liquidity Api Manager List method
    yield takeLatest(ADD_LIQUIDITY_API_MANAGER_LIST, AddLiquidityAPIManager)
    // To register Update Liquidity Api Manager List method
    yield takeLatest(UPDATE_LIQUIDITY_API_MANAGER_LIST, EditLiquidityAPIManager)
    // To register Get Providers List method
    yield takeLatest(GET_PROVIDERS_LIST, ApiProviderList)
    // To register Get Limit Data method
    yield takeLatest(GET_LIMIT_DATA, LimitList)
    // To register Get Service Provider method
    yield takeLatest(GET_SERVICE_PROVIDER, Serviceproviderlist)
    // To register Get Daemon Configuration method
    yield takeLatest(GET_DAEMON_CONFIG, DaemonConfigurationlist)
    // To register Get Service Configuration method
    yield takeLatest(GET_SERVICE_CONFIG, ProviderConfigurationlist)
    // To register Get Provider Type method
    yield takeLatest(GET_PROVIDER_TYPE, Providertypelist)
    // To register Get Transaction Type method
    yield takeLatest(GET_TRANSACTION_TYPE, Transactiontypelist)
}

export default LiquidityAPIManagerSaga;
