
/**
 *   Developer : Parth Andhariya
 *   Date : 25-03-2019
 *   Component: Limit Configuration Saga
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "Helpers/helpers";
import AppConfig from "Constants/AppConfig";
import {
    GET_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION,
    GET_LIMIT_CONFIGURATION_BY_ID,
    CHANGE_LIMIT_CONFIGURATION,
} from "Actions/types";
import {
    ListLimitConfigurationSuccess,
    ListLimitConfigurationFailure,
    addLimitsConfigurationSuccess,
    addLimitsConfigurationFailure,
    getLimitConfigurationByIdSuccess,
    getLimitConfigurationByIdFailure,
    UpdateLimitsConfigurationSuccess,
    UpdateLimitsConfigurationFailure,
    ChangeLimitsConfigurationSuccess,
    ChangeLimitsConfigurationFailure
} from "Actions/LimitConfiguration";

//Get charge configuration Api Call
function* getLimitConfigurationAPI(payload) {
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/ListMasterLimitConfiguration?";
    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(ListLimitConfigurationSuccess(response));
        } else {
            yield put(ListLimitConfigurationFailure(response));
        }
    } catch (error) {
        yield put(ListLimitConfigurationFailure(error));
    }
}
//calling list api 
function* ListLimitConfiguration() {
    yield takeEvery(GET_LIMIT_CONFIGURATION, getLimitConfigurationAPI);
}
//add Change Configuration
function* addLimitsConfigurationAPI({ payload }) {
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(
        swaggerPostAPI,
        "api/WalletControlPanel/AddMasterLimitConfiguration",
        payload,
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(addLimitsConfigurationSuccess(response));
        } else {
            yield put(addLimitsConfigurationFailure(response));
        }
    } catch (error) {
        yield put(addLimitsConfigurationFailure(error));
    }
}
//calling add api 
function* addLimitsConfiguration() {
    yield takeEvery(ADD_LIMIT_CONFIGURATION, addLimitsConfigurationAPI);
}
//get ById change Configuration
function* getLimitConfigurationByIdAPI({ payload }) {
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(
        swaggerGetAPI,
        "api/WalletControlPanel/GetMasterLimitConfiguration/" + payload.Id,
        {},
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(getLimitConfigurationByIdSuccess(response));
        } else {
            yield put(getLimitConfigurationByIdFailure(response));
        }
    } catch (error) {
        yield put(getLimitConfigurationByIdFailure(error));
    }
}
//calling get ById api 
function* getLimitConfigurationById() {
    yield takeEvery(
        GET_LIMIT_CONFIGURATION_BY_ID,
        getLimitConfigurationByIdAPI
    );
}
//update changeconfiguration
function* UpdateLimitsConfigurationAPI({ payload }) {
    var request = payload;
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/UpdateMasterLimitConfiguration";
    const response = yield call(
        swaggerPostAPI,
        URL,
        request,
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(UpdateLimitsConfigurationSuccess(response));
        } else {
            yield put(UpdateLimitsConfigurationFailure(response));
        }
    } catch (error) {
        yield put(UpdateLimitsConfigurationFailure(error));
    }
}
//call update api 
function* UpdateLimitsConfiguration() {
    yield takeEvery(
        UPDATE_LIMIT_CONFIGURATION,
        UpdateLimitsConfigurationAPI
    );
}
//delete Limit Configuration 
function* ChangeLimitsConfigurationAPI({ payload }) {
    try {
        var headers = { Authorization: AppConfig.authorizationToken };
        var URL = "api/WalletControlPanel/ChangeMasterLimitConfigStatus";
        const response = yield call(
            swaggerPostAPI,
            URL,
            payload,
            headers
        );
        if (response.ReturnCode === 0) {
            yield put(ChangeLimitsConfigurationSuccess(response));
        } else {
            yield put(ChangeLimitsConfigurationFailure(response));
        }
    } catch (error) {
        yield put(ChangeLimitsConfigurationFailure(error));
    }
}
//call Delete api 
function* ChangeLimitsConfiguration() {
    yield takeEvery(
        CHANGE_LIMIT_CONFIGURATION,
        ChangeLimitsConfigurationAPI
    );
}
export default function* rootSaga() {
    yield all([
        fork(ListLimitConfiguration),
        fork(addLimitsConfiguration),
        fork(UpdateLimitsConfiguration),
        fork(getLimitConfigurationById),
        fork(ChangeLimitsConfiguration),
    ]);
}
