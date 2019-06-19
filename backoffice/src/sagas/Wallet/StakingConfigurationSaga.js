/* 
    Developer : Nishant Vadgama
    Date : 28-12-2018
    File Comment : Staking configuration saga methods
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import {
    //list
    MASTERSTAKINGLIST,
    INSERTUPDATESTAKINGMASTER,
    DELETEMASTERSTAKING,
    STAKINGLIST,
    ADDSTAKINGCONFIG,
    DELETESTAKINGCONFIG,
    GETSTAKINGCONFIG
} from "Actions/types";
//Action methods..
import {
    getMasterStakingListSuccess,
    getMasterStakingListFail,
    insertUpdateWalletMasterSuccess,
    insertUpdateWalletMasterFail,
    deleteMasterStakingSuccess,
    deleteMasterStakingFail,
    getStakingConfigListSuccess,
    getStakingConfigListFail,
    addStakingConfigSuccess,
    addStakingConfigFail,
    deleteStakingConfigSuccess,
    deleteStakingConfigFail,
    getStckingByIdSuccess,
    getStckingByIdFail
} from 'Actions/Wallet';
import AppConfig from 'Constants/AppConfig';

// get master staking list request...
function* getMasterStakingListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListStakingPolicyMaster?';
    if (request.hasOwnProperty("WalletTypeID") && request.WalletTypeID != "") {
        URL += '&WalletTypeID=' + request.WalletTypeID;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("SlabType") && request.SlabType != "") {
        URL += '&SlabType=' + request.SlabType;
    }
    if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
        URL += '&StakingType=' + request.StakingType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getMasterStakingListSuccess(response.Data));
        } else {
            yield put(getMasterStakingListFail(response));
        }
    } catch (error) {
        yield put(getMasterStakingListFail(error));
    }
}
// get master staking list request...
function* insertUpdateWalletMasterRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/InsertUpdateStakingPolicy', request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(insertUpdateWalletMasterSuccess(response));
        } else {
            yield put(insertUpdateWalletMasterFail(response));
        }
    } catch (error) {
        yield put(insertUpdateWalletMasterFail(error));
    }
}
//delete master staking...
function* deleteMasterStakingRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ChangeStakingPolicyMasterStatus/' + payload.PolicyMasterId + '/9', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(deleteMasterStakingSuccess(response));
        } else {
            yield put(deleteMasterStakingFail(response));
        }
    } catch (error) {
        yield put(deleteMasterStakingFail(error));
    }
}
// get sting list request
function* getStakingConfigListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListStackingPolicyDetail/' + request.PolicyMasterId + '?';
    if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
        URL += '&StakingType=' + request.StakingType;
    }
    if (request.hasOwnProperty("SlabType") && request.SlabType != "") {
        URL += '&SlabType=' + request.SlabType;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getStakingConfigListSuccess(response.Details));
        } else {
            yield put(getStakingConfigListFail(response));
        }
    } catch (error) {
        yield put(getStakingConfigListFail(error));
    }
}
function* addStakingConfigRequest(payload) {
    const request = {
        "StakingPolicyID": parseInt(payload.request.MasterPolicyId),
        "DurationWeek": parseInt(payload.request.DurationWeek),
        "DurationMonth": parseInt(payload.request.DurationMonth),
        "AutoUnstakingEnable": parseInt(payload.request.AutoUnstakingEnable),
        "InterestType": parseInt(payload.request.InterestType),
        "InterestValue": parseFloat(payload.request.InterestValue),
        "Amount": parseFloat(payload.request.Amount),
        "MinAmount": parseFloat(payload.request.MinAmount),
        "MaxAmount": parseFloat(payload.request.MaxAmount),
        "RenewUnstakingEnable": parseInt(payload.request.RenewUnstakingEnable),
        "RenewUnstakingPeriod": parseInt(payload.request.RenewUnstakingPeriod),
        "EnableStakingBeforeMaturity": parseInt(payload.request.EnableStakingBeforeMaturity),
        "EnableStakingBeforeMaturityCharge": parseFloat(payload.request.EnableStakingBeforeMaturityCharge),
        "MaturityCurrency": parseInt(payload.request.MaturityCurrency),
        "MakerCharges": parseFloat(payload.request.MakerCharges),
        "TakerCharges": parseFloat(payload.request.TakerCharges),
        "Status": parseInt(payload.request.Status)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "";
    if (payload.request.PolicyDetailID !== 0) { // for edit
        URL = 'api/WalletControlPanel/UpdateStakingPolicyDetail/' + payload.request.PolicyDetailID;
    } else { //Ffor add
        URL = 'api/WalletControlPanel/AddStakingPolicy';
    }
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(addStakingConfigSuccess(response));
        } else {
            yield put(addStakingConfigFail(response));
        }
    } catch (error) {
        yield put(addStakingConfigFail(error));
    }
}
function* deleteStakingConfigRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ChangeStakingPolicyDetailStatus/' + payload.id + '/9', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(deleteStakingConfigSuccess(response));
        } else {
            yield put(deleteStakingConfigFail(response));
        }
    } catch (error) {
        yield put(deleteStakingConfigFail(error));
    }
}
function* getStckingByIdRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetStackingPolicyDetail/' + payload.id, payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getStckingByIdSuccess(response));
        } else {
            yield put(getStckingByIdFail(response));
        }
    } catch (error) {
        yield put(getStckingByIdFail(error));
    }
}
/* GET master staking list */
export function* getMasterStakingList() {
    yield takeEvery(MASTERSTAKINGLIST, getMasterStakingListRequest);
}
/* Insert update staking master */
export function* insertUpdateWalletMaster() {
    yield takeEvery(INSERTUPDATESTAKINGMASTER, insertUpdateWalletMasterRequest);
}
/* delete staking master */
export function* deleteMasterStaking() {
    yield takeEvery(DELETEMASTERSTAKING, deleteMasterStakingRequest);
}
/* GET staking list */
export function* getStakingConfigList() {
    yield takeEvery(STAKINGLIST, getStakingConfigListRequest);
}
/* add new staking request */
export function* addStakingConfig() {
    yield takeEvery(ADDSTAKINGCONFIG, addStakingConfigRequest);
}
/* remove staking request */
export function* deleteStakingConfig() {
    yield takeEvery(DELETESTAKINGCONFIG, deleteStakingConfigRequest);
}
/* get staking by id */
export function* getStckingById() {
    yield takeEvery(GETSTAKINGCONFIG, getStckingByIdRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getMasterStakingList),
        fork(insertUpdateWalletMaster),
        fork(deleteMasterStaking),
        fork(getStakingConfigList),
        fork(addStakingConfig),
        fork(deleteStakingConfig),
        fork(getStckingById),
    ]);
}