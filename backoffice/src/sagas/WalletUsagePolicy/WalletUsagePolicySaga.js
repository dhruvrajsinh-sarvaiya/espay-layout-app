import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
import { GET_WALLET_USAGE_POLICY, UPDATE_WALLET_USAGE_POLICY_STATUS, ADD_WALLET_USAGE_POLICY, UPDATE_WALLET_USAGE_POLICY, GET_WALLET_TYPE } from "Actions/types";
import {
    getWalletUsagePolicySuccess,
    getWalletUsagePolicyFailure,
    updateWalletUsagePolicyStatusSuccess,
    updateWalletUsagePolicyStatusFailure,
    addWalletUsagePolicySuccess,
    addWalletUsagePolicyFailure,
    onUpdateWalletUsagePolicySuccess,
    onUpdateWalletUsagePolicyFail,
    getWalletTypeSuccess,
    getWalletTypeFailure
} from "Actions/WalletUsagePolicy";
import AppConfig from 'Constants/AppConfig';

function* getWalletUsagePolicyAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListUsagePolicy', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletUsagePolicySuccess(response));
        } else {
            yield put(getWalletUsagePolicyFailure(response));
        }
    } catch (error) {
        yield put(getWalletUsagePolicyFailure(error));
    }
}
function* updateWalletUsagePolicyStatusAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/ChangeWalletUsagePolicyStatus/' + payload.id + "/" + payload.status, payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(updateWalletUsagePolicyStatusSuccess(response));
        } else {
            yield put(updateWalletUsagePolicyStatusFailure(response));
        }
    } catch (error) {
        yield put(updateWalletUsagePolicyStatusFailure(error));
    }
}
function* addWalletUsagePolicyAPI({ payload }) {
    let reqObj = {
        Id: parseFloat(payload.Id),
        WalletType: parseFloat(payload.WalletType),
        PolicyName: payload.PolicyName,
        AllowedIP: payload.AllowedIP,
        AllowedLocation: payload.AllowedLocation,
        AuthenticationType: parseFloat(payload.AuthenticationType),
        StartTime: parseFloat(payload.StartTime),
        EndTime: parseFloat(payload.EndTime),
        DailyTrnCount: parseFloat(payload.DailyTrnCount),
        DailyTrnAmount: parseFloat(payload.DailyTrnAmount),
        HourlyTrnCount: parseFloat(payload.HourlyTrnCount),
        HourlyTrnAmount: parseFloat(payload.HourlyTrnAmount),
        MonthlyTrnCount: parseFloat(payload.MonthlyTrnCount),
        MonthlyTrnAmount: parseFloat(payload.MonthlyTrnAmount),
        WeeklyTrnCount: parseFloat(payload.WeeklyTrnCount),
        WeeklyTrnAmount: parseFloat(payload.WeeklyTrnAmount),
        YearlyTrnCount: parseFloat(payload.YearlyTrnCount),
        YearlyTrnAmount: parseFloat(payload.YearlyTrnAmount),
        LifeTimeTrnCount: parseFloat(payload.LifeTimeTrnCount),
        LifeTimeTrnAmount: parseFloat(payload.LifeTimeTrnAmount),
        MinAmount: parseFloat(payload.MinAmount),
        MaxAmount: parseFloat(payload.MaxAmount),
        AuthorityType: parseFloat(payload.AuthorityType),
        AllowedUserType: parseFloat(payload.AllowedUserType),
        Status: parseFloat(payload.Status),
        DayNo: payload.DayNo,
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateWalletUsagePolicy', reqObj, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addWalletUsagePolicySuccess(response));
        } else {
            yield put(addWalletUsagePolicyFailure(response));
        }
    } catch (error) {
        yield put(addWalletUsagePolicyFailure(error));
    }
}
function* updateWalletUsagePolicyAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, '/api/WalletControlPanel/InsertUpdateWalletUsagePolicy', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(onUpdateWalletUsagePolicySuccess(response));
        } else {
            yield put(onUpdateWalletUsagePolicyFail(response));
        }
    } catch (error) {
        yield put(onUpdateWalletUsagePolicyFail(error));
    }
}
function* getWalletTypeAPI(payload) {
    if(payload.payload !== undefined)
    {
    const request = payload.payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListWalletTypeDetails?';
    if (request.hasOwnProperty("ServiceProviderId") && request.ServiceProviderId != "") {
        URL += "&ServiceProviderId=" + request.ServiceProviderId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletTypeSuccess(response.Types));
        } else {
            yield put(getWalletTypeFailure(response));
        }
    } catch (error) {
        yield put(getWalletTypeFailure(error));
    }
}
else{
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListWalletTypeDetails', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getWalletTypeSuccess(response.Types));
        } else {
            yield put(getWalletTypeFailure(response));
        }
    } catch (error) {
        yield put(getWalletTypeFailure(error));
    }
}
}
function* getWalletUsagePolicy() {
    yield takeEvery(GET_WALLET_USAGE_POLICY, getWalletUsagePolicyAPI);
}
function* updateWalletUsagePolicyStatus() {
    yield takeEvery(UPDATE_WALLET_USAGE_POLICY_STATUS, updateWalletUsagePolicyStatusAPI);
}
function* addWalletUsagePolicy() {
    yield takeEvery(ADD_WALLET_USAGE_POLICY, addWalletUsagePolicyAPI);
}
function* updateWalletUsagePolicy() {
    yield takeEvery(UPDATE_WALLET_USAGE_POLICY, updateWalletUsagePolicyAPI);
}
function* getWalletType() {
    yield takeEvery(GET_WALLET_TYPE, getWalletTypeAPI);
}
export default function* rootSaga() {
    yield all([
        fork(getWalletUsagePolicy),
        fork(updateWalletUsagePolicyStatus),
        fork(addWalletUsagePolicy),
        fork(updateWalletUsagePolicy),
        fork(getWalletType)
    ]);
}
