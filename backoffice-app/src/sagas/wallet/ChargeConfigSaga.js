import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_CHARGE_CONFIG_LIST, DELETE_CHARGE_CONFIG_DATA, ADD_CHARGECONFIGURATION, UPDATE_CHARGECONFIGURATION, GET_CHARGE_CONFIG_DETAIL, ADD_CHARGECONFIGURATION_DETAIL, UPDATE_CHARGECONFIGURATION_DETAIL } from '../../actions/ActionTypes';
import { getChargeConfigListSuccess, getChargeConfigListFailure, deleteChargeConfigDataSuccess, deleteChargeConfigDataFailure, addChargesConfigurationSuccess, addChargesConfigurationFailure, UpdateChargesConfigurationSuccess, getChargeConfigDetailSuccess, getChargeConfigDetailFailure, addChargesConfigurationDetailSuccess, addChargesConfigurationDetailFailure, UpdateChargesConfigurationDetailSuccess, UpdateChargesConfigurationDetailFail } from '../../actions/Wallet/ChargeConfigActions';

export default function* ChargeConfigSaga() {
    // Get charge Config  List
    yield takeEvery(GET_CHARGE_CONFIG_LIST, getChargeConfigList);
    // Delete charge Config Data
    yield takeEvery(DELETE_CHARGE_CONFIG_DATA, deleteChargeConfigList);
    // add charge Config Data
    yield takeEvery(ADD_CHARGECONFIGURATION, addChargesConfigurationAPI);
    // update charge Config Data
    yield takeEvery(UPDATE_CHARGECONFIGURATION, updateChargeConfigurationAPI);
    // Get charge Config  detail
    yield takeEvery(GET_CHARGE_CONFIG_DETAIL, getChargeConfigurationListDetailsApi);
    // add charge Config  detail
    yield takeEvery(ADD_CHARGECONFIGURATION_DETAIL, addChargeConfigurationDetailApi);
    // update charge Config  detail
    yield takeEvery(UPDATE_CHARGECONFIGURATION_DETAIL, updateChargeConfigurationDetailApi);
}

// Generator for Get Leverage Configuration List
function* getChargeConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Charge Config List Data Api
        const data = yield call(swaggerGetAPI, Method.ListChargeConfiguration, {}, headers);

        // To set Get Charge Config List success response to reducer
        yield put(getChargeConfigListSuccess(data));
    } catch (error) {
        // To set Get Charge Config List failure response to reducer
        yield put(getChargeConfigListFailure());
    }
}

// Generator for Delete Charge Configuration List
function* deleteChargeConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let obj = {}
        if (payload.SlabType !== undefined && payload.SlabType !== '') {
            obj = {
                ...obj,
                SlabType: payload.SlabType
            }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: payload.Status
            }
        }

        if (payload.Remarks !== undefined && payload.Remarks !== '') {
            obj = {
                ...obj,
                Remarks: payload.Remarks
            }
        }

        // To call Get Charge Config List Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateChargeConfiguration + '/' + payload.MasterId, obj, headers);

        // To set Delete Charge Config List success response to reducer
        yield put(deleteChargeConfigDataSuccess(data));
    } catch (error) {
        // To set Delete Charge Config List failure response to reducer
        yield put(deleteChargeConfigDataFailure());
    }
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

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Get AddChargeConfiguration Api
    const response = yield call(
        swaggerPostAPI,
        Method.AddChargeConfiguration,
        reqObj,
        headers
    );
    try {
        // To set add Charge Config List success response to reducer
        yield put(addChargesConfigurationSuccess(response));
    } catch (error) {
        // To set add Charge Config List failure response to reducers
        yield put(addChargesConfigurationFailure(error));
    }
}

//update changeconfiguration
function* updateChargeConfigurationAPI({ payload }) {

    var request = payload;

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    let reqObj = {
        Remarks: payload.Remarks,
        Status: payload.Status,
        SlabType: payload.SlabType
    };

    var URL = Method.UpdateChargeConfiguration + "/" + request.Id;

    // To call Get UpdateChargeConfiguration Api
    const response = yield call(
        swaggerPostAPI,
        URL,
        reqObj,
        headers
    );
    try {

        // To set update Charge Config List success response to reducer
        yield put(UpdateChargesConfigurationSuccess(response));
    } catch (error) {
        // To set update Charge Config List failure response to reducers
        yield put(UpdateChargesConfigurationFail(error));
    }
}

// Generator for Get Leverage Configuration List
function* getChargeConfigurationListDetailsApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Charge Config List Data Api
        const data = yield call(swaggerGetAPI, Method.ListChargeConfigurationDetail + queryBuilder(payload), {}, headers);

        // To set Get Charge Config List success response to reducer
        yield put(getChargeConfigDetailSuccess(data));
    } catch (error) {

        // To set Get Charge Config List failure response to reducer
        yield put(getChargeConfigDetailFailure(error));
    }
}

//method for add record to api
function* addChargeConfigurationDetailApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var url = Method.AddChargeConfigurationDeatil;
        // To call addChargeConfigurationDetail Api
        var response = yield call(swaggerPostAPI, url, payload, headers);

        // To set add Charge Config List detail success response to reducer
        yield put(addChargesConfigurationDetailSuccess(response));
    } catch (error) {

        // To set add Charge Config List detail failure response to reducer
        yield put(addChargesConfigurationDetailFailure(error));
    }
}

//method to update record to api
function* updateChargeConfigurationDetailApi({ payload }) {
    var url =
        Method.UpdateChargeConfigurationDetail + "/" +
        payload.ChargeConfigDetailId;
    try {
        let request = {}
        if (payload.ChargeConfigurationMasterID !== undefined && payload.ChargeConfigurationMasterID !== '') {
            request = {
                ...request,
                ChargeConfigurationMasterID: payload.ChargeConfigurationMasterID
            }
        }

        if (payload.ChargeDistributionBasedOn !== undefined && payload.ChargeDistributionBasedOn !== '') {
            request = {
                ...request,
                ChargeDistributionBasedOn: payload.ChargeDistributionBasedOn
            }
        }

        if (payload.ChargeType !== undefined && payload.ChargeType !== '') {
            request = {
                ...request,
                ChargeType: payload.ChargeType
            }
        }

        if (payload.ChargeValue !== undefined && payload.ChargeValue !== '') {
            request = {
                ...request,
                ChargeValue: payload.ChargeValue
            }
        }

        if (payload.ChargeValueType !== undefined && payload.ChargeValueType !== '') {
            request = {
                ...request,
                ChargeValueType: payload.ChargeValueType
            }
        }

        if (payload.DeductionWalletTypeId !== undefined && payload.DeductionWalletTypeId !== '') {
            request = {
                ...request,
                DeductionWalletTypeId: payload.DeductionWalletTypeId
            }
        }

        if (payload.MakerCharge !== undefined && payload.MakerCharge !== '') {
            request = {
                ...request,
                MakerCharge: payload.MakerCharge
            }
        }

        if (payload.MaxAmount !== undefined && payload.MaxAmount !== '') {
            request = {
                ...request,
                MaxAmount: payload.MaxAmount
            }
        }

        if (payload.MinAmount !== undefined && payload.MinAmount !== '') {
            request = {
                ...request,
                MinAmount: payload.MinAmount
            }
        }

        if (payload.Remarks !== undefined && payload.Remarks !== '') {
            request = {
                ...request,
                Remarks: payload.Remarks
            }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            request = {
                ...request,
                Status: payload.Status
            }
        }

        if (payload.StrChargeDistributionBasedOn !== undefined && payload.StrChargeDistributionBasedOn !== '') {
            request = {
                ...request,
                StrChargeDistributionBasedOn: payload.StrChargeDistributionBasedOn
            }
        }

        if (payload.StrChargeType !== undefined && payload.StrChargeType !== '') {
            request = {
                ...request,
                StrChargeType: payload.StrChargeType
            }
        }

        if (payload.StrChargeValueType !== undefined && payload.StrChargeValueType !== '') {
            request = {
                ...request,
                StrChargeValueType: payload.StrChargeValueType
            }
        }

        if (payload.StrStatus !== undefined && payload.StrStatus !== '') {
            request = {
                ...request,
                StrStatus: payload.StrStatus
            }
        }

        if (payload.TakerCharge !== undefined && payload.TakerCharge !== '') {
            request = {
                ...request,
                TakerCharge: payload.TakerCharge
            }
        }

        if (payload.WalletTypeName !== undefined && payload.WalletTypeName !== '') {
            request = {
                ...request,
                WalletTypeName: payload.WalletTypeName
            }
        }

        // To call updateChargeConfigurationDetail Api
        var response = yield call(swaggerPostAPI, url, request);

        // To set update Charge Config List detail success response to reducer
        yield put(UpdateChargesConfigurationDetailSuccess(response));
    } catch (error) {

        // To set update Charge Config List detail failure response to reducer
        yield put(UpdateChargesConfigurationDetailFail(error));
    }
}


