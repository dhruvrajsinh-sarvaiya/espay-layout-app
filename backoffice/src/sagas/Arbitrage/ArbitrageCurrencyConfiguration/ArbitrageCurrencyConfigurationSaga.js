
/**
 *   Developer : Parth Andhariya
 *   Date : 06-06-2019
 *   Component: Arbitrage Currency Configuration Saga
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "Helpers/helpers";
import AppConfig from "Constants/AppConfig";
import {
    GET_CHARGECONFIGURATION,
    ADD_CHARGECONFIGURATION,
    UPDATE_CHARGECONFIGURATION,
    GET_CHARGECONFIGURATION_BY_ID,
    GET_CHARGE_CONFIGURATION_LIST,
    ADD_CHARGE_CONFIGURATION_LIST,
    GET_CHARGE_CONFIGURATION_BYID,
    UPDATE_CHARGE_CONFIGURATION_LIST,
    GET_ARBITRAGE_CURRENCY
} from "Actions/types";
import {
    ListChargeConfigurationSuccess,
    ListChargeConfigurationFailure,
    addChargesConfigurationSuccess,
    addChargesConfigurationFailure,
    getChargeConfigurationByIdSuccess,
    getChargeConfigurationByIdFailure,
    UpdateChargesConfigurationSuccess,
    UpdateChargesConfigurationFail,
    getChargeConfigurationListSuccess,
    getChargeConfigurationListFailure,
    addChargeConfigurationListSuccess,
    addChargeConfigurationListFailure,
    getChargeConfigurationDetailSuccess,
    getChargeConfigurationDetailFailure,
    updateChargeConfigurationListSuccess,
    updateChargeConfigurationListFailure,
} from "Actions/ChargeConfigurationAction";
import { ListArbitrageCurrencySuccess, ListArbitrageCurrencyFailure, } from "Actions/Arbitrage/ArbitrageCurrencyConfiguration";
//Get charge configuration Api Call
function* getchargeconfigurationAPI(payload) {
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/ListChargeConfiguration?";
    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(ListChargeConfigurationSuccess(response));
        } else {
            yield put(ListChargeConfigurationFailure(response));
        }
    } catch (error) {
        yield put(ListChargeConfigurationFailure(error));
    }
}
//calling list api 
function* ListChargeConfiguration() {
    yield takeEvery(GET_CHARGECONFIGURATION, getchargeconfigurationAPI);
}
//add Change Configuration
function* addChargesConfigurationAPI({ payload }) {
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
    const response = yield call(
        swaggerPostAPI,
        "api/WalletControlPanel/AddChargeConfiguration",
        reqObj,
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(addChargesConfigurationSuccess(response));
        } else {
            yield put(addChargesConfigurationFailure(response));
        }
    } catch (error) {
        yield put(addChargesConfigurationFailure(error));
    }
}
//calling add api 
function* addChargesConfiguration() {
    yield takeEvery(ADD_CHARGECONFIGURATION, addChargesConfigurationAPI);
}
//get ById change Configuration
function* getchargeconfigurationByIdAPI({ payload }) {
    var headers = { Authorization: AppConfig.authorizationToken };
    const response = yield call(
        swaggerGetAPI,
        "api/WalletControlPanel/GetChargeConfiguration/" + payload.MasterId,
        {},
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(getChargeConfigurationByIdSuccess(response));
        } else {
            yield put(getChargeConfigurationByIdFailure(response));
        }
    } catch (error) {
        yield put(getChargeConfigurationByIdFailure(error));
    }
}
//calling get ById api 
function* getChargeConfigurationById() {
    yield takeEvery(
        GET_CHARGECONFIGURATION_BY_ID,
        getchargeconfigurationByIdAPI
    );
}
//update changeconfiguration
function* updateChargeConfigurationAPI({ payload }) {
    var request = payload;
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "api/WalletControlPanel/UpdateChargeConfiguration/" + request.Id;
    delete request.Id;
    const response = yield call(
        swaggerPostAPI,
        URL,
        request,
        headers
    );
    try {
        if (response.ReturnCode === 0) {
            yield put(UpdateChargesConfigurationSuccess(response));
        } else {
            yield put(UpdateChargesConfigurationFail(response));
        }
    } catch (error) {
        yield put(UpdateChargesConfigurationFail(error));
    }
}
//call update api 
function* UpdateChargesConfiguration() {
    yield takeEvery(
        UPDATE_CHARGECONFIGURATION,
        updateChargeConfigurationAPI
    );
}
//Charge configuration detail methods
//method for fatch records from api
export function* getChargeConfigurationListDetails({ payload }) {
    var url = "api/WalletControlPanel/ListChargeConfigurationDetail?";
    try {
        if (payload.hasOwnProperty("MasterId") && payload.MasterId != "") {
            url += "&MasterId=" + payload.MasterId;
        }
        var response = yield call(swaggerGetAPI, url);
        if (response.ReturnCode === 0) {
            yield put(getChargeConfigurationListSuccess(response));
        } else {
            yield put(getChargeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(getChargeConfigurationListFailure(error));
    }
}
//method for call Charge Configuration list
export function* getChargeConfigurationList() {
    yield takeEvery(
        GET_CHARGE_CONFIGURATION_LIST,
        getChargeConfigurationListDetails
    );
}
//method for add record to api
function* addChargeConfigurationRecord({ payload }) {
    var url = "api/WalletControlPanel/AddChargeConfigurationDeatil";
    try {
        var response = yield call(swaggerPostAPI, url, payload);
        if (response.ReturnCode === 0) {
            yield put(addChargeConfigurationListSuccess(response));
        } else {
            yield put(addChargeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(addChargeConfigurationListFailure(error));
    }
}
//method for call add record api
export function* addChargeConfigurationList() {
    yield takeEvery(ADD_CHARGE_CONFIGURATION_LIST, addChargeConfigurationRecord);
}
//method for get record ById
function* getChargeConfigurationByIdRecord({ payload }) {
    var url = "api/WalletControlPanel/GetChargeConfigurationDetail/" + payload;
    try {
        var response = yield call(swaggerGetAPI, url);
        if (response.ReturnCode === 0) {
            yield put(getChargeConfigurationDetailSuccess(response));
        } else {
            yield put(getChargeConfigurationDetailFailure(response));
        }
    } catch (error) {
        yield put(getChargeConfigurationDetailFailure(error));
    }
}
//method for call get record ById api
export function* getChargeConfigurationDetailById() {
    yield takeEvery(
        GET_CHARGE_CONFIGURATION_BYID,
        getChargeConfigurationByIdRecord
    );
}
//method to update record to api
function* updateChargeConfigurationRecord({ payload }) {
    var url =
        "api/WalletControlPanel/UpdateChargeConfigurationDetail/" +
        payload.ChargeConfigDetailId;
    try {
        var request = {
            ChargeConfigurationMasterID: payload.ChargeConfigurationMasterID,
            ChargeDistributionBasedOn: payload.ChargeDistributionBasedOn,
            ChargeType: payload.ChargeType,
            ChargeValue: payload.ChargeValue,
            ChargeValueType: payload.ChargeValueType,
            DeductionWalletTypeId: payload.DeductionWalletTypeId,
            MakerCharge: payload.MakerCharge,
            MaxAmount: payload.MaxAmount,
            MinAmount: payload.MinAmount,
            Remarks: payload.Remarks,
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
            yield put(updateChargeConfigurationListSuccess(response));
        } else {
            yield put(updateChargeConfigurationListFailure(response));
        }
    } catch (error) {
        yield put(updateChargeConfigurationListFailure(error));
    }
}
//method for call update api
export function* updateChargeConfigurationList() {
    yield takeEvery(
        UPDATE_CHARGE_CONFIGURATION_LIST,
        updateChargeConfigurationRecord
    );
}

//Get Arbitrage Currency list Api Call
function* ListArbitrageCurrencyAPI(payload) {
    var headers = { Authorization: AppConfig.authorizationToken };
    var URL = "/api/ArbitrageWallet/ListCurrency";
    const response = yield call(swaggerGetAPI, URL, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(ListArbitrageCurrencySuccess(response));
        } else {
            yield put(ListArbitrageCurrencyFailure(response));
        }
    } catch (error) {
        yield put(ListArbitrageCurrencyFailure(error));
    }
}
//calling Arbitrage Currency list api 
function* ListArbitrageCurrency() {
    yield takeEvery(GET_ARBITRAGE_CURRENCY, ListArbitrageCurrencyAPI);
}
export default function* rootSaga() {
    yield all([
        fork(ListChargeConfiguration),
        fork(addChargesConfiguration),
        fork(UpdateChargesConfiguration),
        fork(getChargeConfigurationById),
        fork(getChargeConfigurationList),
        fork(addChargeConfigurationList),
        fork(getChargeConfigurationDetailById),
        fork(updateChargeConfigurationList),
        fork(ListArbitrageCurrency)
    ]);
}
