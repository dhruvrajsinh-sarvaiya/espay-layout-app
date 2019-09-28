import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
import {
    GET_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION,
    CHANGE_LIMIT_CONFIGURATION,
} from '../../actions/ActionTypes';
import {
    getLimitConfigListSuccess,
    getLimitConfigListFailure,
    addLimitsConfigurationSuccess,
    addLimitsConfigurationFailure,
    UpdateLimitsConfigurationSuccess,
    UpdateLimitsConfigurationFailure,
    ChangeLimitsConfigurationSuccess,
    ChangeLimitsConfigurationFailure
} from "../../actions/Wallet/LimitConfigActions";

//Get limit configuration Api Call
function* getLimitConfigurationAPI(payload) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Limit Configuration List Data Api
        const response = yield call(swaggerGetAPI, Method.ListMasterLimitConfiguration + '?', {}, headers);

        // To set Limit Configuration list success response to reducer
        yield put(getLimitConfigListSuccess(response));
    } catch (error) {

        // To set Limit Configuration list Failure response to reducer
        yield put(getLimitConfigListFailure(error));
    }
}

//calling list api 
function* getLimitConfigList() {
    // Get limit configuration List
    yield takeEvery(GET_LIMIT_CONFIGURATION, getLimitConfigurationAPI);
}

//add Limit Configuration
function* addLimitsConfigurationAPI({ payload }) {

    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add  Limit Configuration Data Api
        const response = yield call(swaggerPostAPI,
            Method.AddMasterLimitConfiguration,
            payload,
            headers
        );

        // To set Add Limit Configuration success response to reducer
        yield put(addLimitsConfigurationSuccess(response));
    } catch (error) {

        // To set Add Limit Configuration failure response to reducer
        yield put(addLimitsConfigurationFailure(error));
    }
}

//calling add api 
function* addLimitsConfiguration() {
    //Get add limit configuration Api 
    yield takeEvery(ADD_LIMIT_CONFIGURATION, addLimitsConfigurationAPI);
}

//update changeconfiguration
function* UpdateLimitsConfigurationAPI({ payload }) {
    try {
        var request = payload;
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        var URL = Method.UpdateMasterLimitConfiguration;

        // To call Update  Limit Configuration Data Api
        const response = yield call(
            swaggerPostAPI,
            URL,
            request,
            headers
        );

        // To set Update Limit Configuration success response to reducer
        yield put(UpdateLimitsConfigurationSuccess(response));
    } catch (error) {

        // To set Update Limit Configuration Failure response to reducer
        yield put(UpdateLimitsConfigurationFailure(error));
    }
}

//call update api 
function* UpdateLimitsConfiguration() {

    //Get update limit configuration Api 
    yield takeEvery(
        UPDATE_LIMIT_CONFIGURATION,
        UpdateLimitsConfigurationAPI
    );
}

//delete Limit Configuration 
function* ChangeLimitsConfigurationAPI({ payload }) {
    try {
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call delete Limit Configuration Data Api
        const response = yield call(
            swaggerPostAPI,
            Method.ChangeMasterLimitConfigStatus,
            payload,
            headers
        );

        // To set delete Limit Configuration Success response to reducer
        yield put(ChangeLimitsConfigurationSuccess(response));
    } catch (error) {

        // To set delete Limit Configuration Failure response to reducer
        yield put(ChangeLimitsConfigurationFailure(error));
    }
}

//call Delete api 
function* ChangeLimitsConfiguration() {

    // Get delete limit configuration api
    yield takeEvery(CHANGE_LIMIT_CONFIGURATION, ChangeLimitsConfigurationAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getLimitConfigList),
        fork(addLimitsConfiguration),
        fork(UpdateLimitsConfiguration),
        fork(ChangeLimitsConfiguration),
    ]);
}
