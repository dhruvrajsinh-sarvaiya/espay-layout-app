import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    API_KEY_CONFIG_DASHBOARD_COUNT, GET_API_REQUEST_STATISTICS_COUNT,
    GET_FREQUENT_USE_API, MOST_ACTIVE_IP_ADDRESS
} from '../../actions/ActionTypes';
import {
    getApiKeyDasboardCountSuccess, getApiKeyDasboardCountFailure,
    getApiRequestStatisticsCountSuccess, getApiRequestStatisticsCountFailure,
    getFrequentlyUseApiSuccess, getFrequentlyUseApiFailure,
    getMostActiveIpAddressSuccess, getMostActiveIpAddressFailure
} from '../../actions/ApiKeyConfiguration/ApiKeyDashboradActions';

export default function* ApiKeyDashboardSaga() {
    // To register Get Api Key Dasboard Count method
    yield takeEvery(API_KEY_CONFIG_DASHBOARD_COUNT, getApiKeyDashboardCount)
    // To register Get Api Request Statistics Count method
    yield takeEvery(GET_API_REQUEST_STATISTICS_COUNT, getStatisticsCount)
    // To register Get Frequent Use Api method
    yield takeEvery(GET_FREQUENT_USE_API, getFrequentlyUsedApi)
    // To register Most Active Ip Address method
    yield takeEvery(MOST_ACTIVE_IP_ADDRESS, getMostActiveIp)
}

// Generator for Get Api Key Dasboard Count
function* getApiKeyDashboardCount() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Api Key Dasboard Count Data Api
        const data = yield call(swaggerGetAPI, Method.APIPlanConfigurationCount, {}, headers)

        // To set Get Api Key Dasboard Count success response to reducer
        yield put(getApiKeyDasboardCountSuccess(data))
    } catch (error) {
        // To set Get Api Key Dasboard Count failure response to reducer
        yield put(getApiKeyDasboardCountFailure())
    }
}

// Generator for Get statistics count
function* getStatisticsCount() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Astatistics count Data Api
        const data = yield call(swaggerGetAPI, Method.GetAPIRequestStatisticsCount, {}, headers)

        // To set Get statistics count success response to reducer
        yield put(getApiRequestStatisticsCountSuccess(data))
    } catch (error) {
        // To set Get statistics count failure response to reducer
        yield put(getApiRequestStatisticsCountFailure())
    }
}

// Generator for Get frequently use api
function* getFrequentlyUsedApi() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get frequently use api Data 
        const data = yield call(swaggerGetAPI, Method.GetFrequentUseAPI, {}, headers)

        // To set Get frequently use api success response to reducer
        yield put(getFrequentlyUseApiSuccess(data))
    } catch (error) {
        // To set Get frequently use api failure response to reducer
        yield put(getFrequentlyUseApiFailure())
    }
}

// Generator for Get most active ip address
function* getMostActiveIp() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get most active ip address Data 
        const data = yield call(swaggerGetAPI, Method.MostActiveIPAddress, {}, headers)

        // To set Get most active ip address success response to reducer
        yield put(getMostActiveIpAddressSuccess(data))
    } catch (error) {
        // To set Get fmost active ip address failure response to reducer
        yield put(getMostActiveIpAddressFailure())
    }
}