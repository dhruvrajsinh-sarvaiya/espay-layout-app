
/**
 *   Developer : Vishva shah
 *   Date : 11-06-2019
 *   Component: Fee Configuration Saga
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "Helpers/helpers";
import AppConfig from "Constants/AppConfig";
import {
    GET_FEECONFIGURATION,
    ADD_FEECONFIGURATION,
    UPDATE_FEECONFIGURATION,
    GET_FEECONFIGURATION_BY_ID,
    GET_FEE_CONFIGURATION_LIST,
    ADD_FEE_CONFIGURATION_LIST,
    GET_FEE_CONFIGURATIONDETAIL_BYID,
    UPDATE_FEE_CONFIGURATION_LIST
} from "Actions/types";
import {
    ListFeeConfigurationSuccess,
    ListFeeConfigurationFailure,
    addFeeConfigurationSuccess,
    addFeeConfigurationFailure,
    getFeeConfigurationByIdSuccess,
    getFeeConfigurationByIdFailure,
    UpdateFeeConfigurationSuccess,
    UpdateFeeConfigurationFail,
    getFeeConfigurationListSuccess,
    getFeeConfigurationListFailure,
    addFeeConfigurationListSuccess,
    addFeeConfigurationListFailure,
    getFeeConfigurationDetailSuccess,
    getFeeConfigurationDetailFailure,
    updateFeeConfigurationListSuccess,
    updateFeeConfigurationListFailure
} from "Actions/Arbitrage/ArbitrageFeeConfiguration";

//Get fee configuration Api Call
function* getFeeconfigurationAPIRequest(payload) {
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/ListChargeConfiguration?";
    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(ListFeeConfigurationSuccess(response));
        } else {
            yield put(ListFeeConfigurationFailure(response));
        }
    } catch (error) {
        yield put(ListFeeConfigurationFailure(error));
    }
}
//calling list api 
function* ListFeeConfiguration() {
    yield takeEvery(GET_FEECONFIGURATION, getFeeconfigurationAPIRequest);
}
//add master fee Configuration
function* addFeeConfigurationAPIRequest({ payload }) {
    let reqObj = {
        WalletTypeId: parseFloat(payload.WalletTypeId),
        TrnType: parseFloat(payload.TrnType),
        KYCComplaint: payload.KYCComplaint,
        SpecialChargeConfigurationID: payload.SpecialChargeConfigurationID,
        Remarks: payload.Remarks,
        Status: payload.Status,
        SlabType: payload.SlabType
    };
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(swaggerPostAPI,"api/WalletControlPanel/AddChargeConfiguration",reqObj,headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(addFeeConfigurationSuccess(response));
        } else {
            yield put(addFeeConfigurationFailure(response));
        }
    } catch (error) {
        yield put(addFeeConfigurationFailure(error));
    }
}
//calling add api 
function* addFeeConfiguration() {
    yield takeEvery(ADD_FEECONFIGURATION, addFeeConfigurationAPIRequest);
}
// get ById fee Configuration
function* getchargeconfigurationByIdAPI({ payload }) {
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(swaggerGetAPI,"api/WalletControlPanel/GetChargeConfiguration/" + payload.MasterId,{},headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(getFeeConfigurationByIdSuccess(response));
        } else {
            yield put(getFeeConfigurationByIdFailure(response));
        }
    } catch (error) {
        yield put(getFeeConfigurationByIdFailure(error));
    }
}
//calling get ById api 
function* getFeeConfigurationById() {
    yield takeEvery(GET_FEECONFIGURATION_BY_ID,getchargeconfigurationByIdAPI);
}
//update fee configuration
function* updateFeeConfigurationAPI({ payload }) {
    var request = payload;
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/UpdateChargeConfiguration/" + request.Id;
    delete request.Id;
    const response = yield call(swaggerPostAPI,URL,request,headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(UpdateFeeConfigurationSuccess(response));
        } else {
            yield put(UpdateFeeConfigurationFail(response));
        }
    } catch (error) {
        yield put(UpdateFeeConfigurationFail(error));
    }
}
//call update api 
function* UpdateFeeConfiguration() {
    yield takeEvery(UPDATE_FEECONFIGURATION,updateFeeConfigurationAPI);
}
//method for fatch records from api - fee configuration details - list
export function* getFeeConfigurationListDetails({ payload }) {
    var url = "api/WalletControlPanel/ListChargeConfigurationDetail?";
    try {
        if (payload.hasOwnProperty("MasterId") && payload.MasterId != "") {
            url += "&MasterId=" + payload.MasterId;
        }
        var response = yield call(swaggerGetAPI, url);
        if (response.ReturnCode === 0) {
            yield put(getFeeConfigurationListSuccess(response));
        } else {
            yield put(getFeeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(getFeeConfigurationListFailure(error));
    }
}
//method for call Fee Configuration list
export function* getFeeConfigurationList() {
    yield takeEvery(GET_FEE_CONFIGURATION_LIST,getFeeConfigurationListDetails);
}
// method for add record to api
function* addFeeConfigurationdetailAPIRequest({ payload }) {
    var url = "api/WalletControlPanel/AddChargeConfigurationDeatil";
    try {
        var response = yield call(swaggerPostAPI, url, payload);
        if (response.ReturnCode === 0) {
            yield put(addFeeConfigurationListSuccess(response));
        } else {
            yield put(addFeeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(addFeeConfigurationListFailure(error));
    }
}
//method for call add fee configuration details api
export function* addFeeConfigurationList() {
    yield takeEvery(ADD_FEE_CONFIGURATION_LIST, addFeeConfigurationdetailAPIRequest);
}
// method for get record ById
function* getFeeConfigurationByIdRecord({ payload }) {
    var url = "api/WalletControlPanel/GetChargeConfigurationDetail/" + payload;
    try {
        var response = yield call(swaggerGetAPI, url);
        if (response.ReturnCode === 0) {
            yield put(getFeeConfigurationDetailSuccess(response));
        } else {
            yield put(getFeeConfigurationDetailFailure(response));
        }
    } catch (error) {
        yield put(getFeeConfigurationDetailFailure(error));
    }
}
//method for call get record ById api
export function* getFeeConfigurationDetailById() {
    yield takeEvery(GET_FEE_CONFIGURATIONDETAIL_BYID,getFeeConfigurationByIdRecord);
}
//method to update record to api
function* updateFeeConfigurationRecord({ payload }) {
    var url ="api/WalletControlPanel/UpdateChargeConfigurationDetail/" + payload.ChargeConfigDetailId;
    try {
        var request = {
            ChargeConfigurationMasterID: payload.ChargeConfigurationMasterID,
            ChargeDistributionBasedOn: payload.ChargeDistributionBasedOn,
            ChargeType: payload.ChargeType,
            ChargeValue: payload.ChargeValue,
            ChargeValueType: payload.ChargeValueType,
            DeductionWalletTypeId: payload.DeductionWalletTypeId,
            MakerCharge: payload.MakerCharge,
            Status: payload.Status,
            StrChargeDistributionBasedOn: payload.StrChargeDistributionBasedOn,
            StrChargeType: payload.StrChargeType,
            StrChargeValueType: payload.StrChargeValueType,
            StrStatus: payload.StrStatus,
            TakerCharge: payload.TakerCharge,
            WalletTypeName: payload.WalletTypeName
        };
        var response = yield call(swaggerPostAPI, url, request);
        if (response.ReturnCode === 0) {
            yield put(updateFeeConfigurationListSuccess(response));
        } else {
            yield put(updateFeeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(updateFeeConfigurationListFailure(error));
    }
}
//method for call update api
export function* updateFeeConfigurationList() {
    yield takeEvery(UPDATE_FEE_CONFIGURATION_LIST,updateFeeConfigurationRecord);
}
export default function* rootSaga() {
    yield all([
        fork(ListFeeConfiguration),
        fork(addFeeConfiguration),
        fork(UpdateFeeConfiguration),
        fork(getFeeConfigurationById),
        fork(getFeeConfigurationList),
        fork(addFeeConfigurationList),
        fork(getFeeConfigurationDetailById),
        fork(updateFeeConfigurationList)
    ]);
}
