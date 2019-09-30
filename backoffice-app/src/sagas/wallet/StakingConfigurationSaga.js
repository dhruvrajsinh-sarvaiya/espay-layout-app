import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, queryBuilder, } from "../../api/helper";
import {
    //list
    MASTERSTAKINGLIST,
    ADD_MASTER_STACKING_DATA,
    DELETEMASTERSTAKING,
    GET_STACKING_POLICY_LIST,
    ADD_STACKING_POLICY,
    DELETE_STACKING_POLICY,
    GETSTAKINGCONFIG
} from "../../actions/ActionTypes";

//Action methods..
import {
    getMasterStakingListSuccess,
    getMasterStakingListFail,
    addMasterStakingSuccess,
    addMasterStakingFail,
    deleteMasterStakingSuccess,
    deleteMasterStakingFail,
    getStakingPolicyListSuccess,
    getStakingPolicyListFail,
    addStakingPolicySuccess,
    addStakingPolicyFail,
    deleteStakingPolicySuccess,
    deleteStakingPolicyFail,
    getStckingByIdSuccess,
    getStckingByIdFail,
} from '../../actions/Wallet/StakingConfigurationAction';
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";
import { parseIntVal, parseFloatVal } from '../../controllers/CommonUtils';


// get master staking list request...
function* getMasterStakingListRequest(payload) {
    const request = payload.request;
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    var URL = Method.ListStakingPolicyMaster + '?'
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
        yield put(getMasterStakingListSuccess(response));
    } catch (error) {
        yield put(getMasterStakingListFail(error));
    }
}

// Generator for get master staking list request...
function* addMasterStakingRequest(payload) {

    const request = payload.request;
    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add/Edit Master Staking Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateStakingPolicy, request, headers);

        // To set Add Master Staking success response to reducer
        yield put(addMasterStakingSuccess(data));

    } catch (error) {
        // To set Add Master Staking failure response to reducer
        yield put(addMasterStakingFail(error));
    }
}

// Generator for delete master staking...
function* deleteMasterStakingRequest(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Delete Master Staking Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeStakingPolicyMasterStatus + '/' + payload.PolicyMasterId + '/9', payload, headers);

        // To set Delete Master Staking success response to reducer
        yield put(deleteMasterStakingSuccess(data));
    } catch (error) {
        // To set Delete Master Staking failure response to reducer
        yield put(deleteMasterStakingFail(error));
    }
}

// Generator for staking policies list
function* getStakingPolicyListRequest(payload) {
    try {
        const request = payload.request;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request url
        let swaggerUrl = Method.ListStakingPolicyDetail + '/' + request.PolicyMasterId

        let obj = {}
        if (request.StakingType !== undefined && request.StakingType !== '') {
            obj = {
                ...obj,
                StakingType: request.StakingType
            }
        }
        if (request.SlabType !== undefined && request.SlabType !== '') {
            obj = {
                ...obj,
                SlabType: request.SlabType
            }
        }
        if (request.Status !== undefined && request.Status !== '') {
            obj = {
                ...obj,
                Status: request.Status
            }
        }

        // create new request
        let newReq = swaggerUrl + queryBuilder(obj)

        // To call Get Staking Policies List Api
        const data = yield call(swaggerGetAPI, newReq, request, headers);

        // To set Get Staking Policies List success response to reducer
        yield put(getStakingPolicyListSuccess(data));
    } catch (error) {
        // To set Get Staking Policies List failure response to reducer
        yield put(getStakingPolicyListFail(error));
    }
}

// Generator for Add Staking Policy Data
function* addStakingPolicyRequest(payload) {
    try {
        const request = payload.request;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = ''
        // for edit
        if (request.PolicyDetailId !== 0)
            url = Method.UpdateStakingPolicyDetail + '/' + request.PolicyDetailId;
        // for add
        else
            url = Method.AddStakingPolicy;

        let obj = {}
        if (request.PolicyDetailId == 0)
            obj = { ...obj, StakingPolicyID: parseIntVal(request.StakingPolicyID)}
        let newRequest = {
            ...obj,
            DurationWeek: parseIntVal(request.DurationWeek),
            DurationMonth: parseIntVal(request.DurationMonth),
            AutoUnstakingEnable: parseIntVal(request.AutoUnstakingEnable),
            InterestType: request.PolicyDetailId !== 0 ? parseIntVal(request.InterestType) : 1,
            InterestValue: parseFloatVal(request.InterestValue),
            Amount: parseFloatVal(request.Amount),
            MinAmount: parseFloatVal(request.MinAmount),
            MaxAmount: parseFloatVal(request.MaxAmount),
            RenewUnstakingEnable: parseIntVal(request.RenewUnstakingEnable),
            RenewUnstakingPeriod: parseIntVal(request.RenewUnstakingPeriod),
            EnableStakingBeforeMaturity: parseIntVal(request.EnableStakingBeforeMaturity),
            EnableStakingBeforeMaturityCharge: parseFloatVal(request.EnableStakingBeforeMaturityCharge),
            MaturityCurrency: parseIntVal(request.MaturityCurrency),
            MakerCharges: parseFloatVal(request.MakerCharges),
            TakerCharges: parseFloatVal(request.TakerCharges),
            Status: parseIntVal(request.Status),
        }

        // To call Get Staking Policies List Api
        const data = yield call(swaggerPostAPI, url, newRequest, headers);

        // To set Add Staking Policy success response to reducer
        yield put(addStakingPolicySuccess(data));
    } catch (error) {
        // To set Add Staking Policy failure response to reducer
        yield put(addStakingPolicyFail(error));
    }
}

// Generator for Delete Staking Policy Data
function* deleteStakingPolicyRequest(payload) {
    try {
        let req = payload.id

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Delete Staking Policies List Api
        const data = yield call(swaggerPostAPI, Method.ChangeStakingPolicyDetailStatus + '/' + req.Id + '/9', req, headers);

        // To set Delete Staking Policy success response to reducer
        yield put(deleteStakingPolicySuccess(data));
    } catch (error) {
        // To set Delete Staking Policy failure response to reducer
        yield put(deleteStakingPolicyFail(error));
    }
}

function* getStckingByIdRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetStakingPolicyDetail/' + payload.id, payload, headers);
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
export function* addMasterStaking() {
    yield takeEvery(ADD_MASTER_STACKING_DATA, addMasterStakingRequest);
}
/* delete staking master */
export function* deleteMasterStaking() {
    yield takeEvery(DELETEMASTERSTAKING, deleteMasterStakingRequest);
}
/* GET staking list */
export function* getStakingPolicyList() {
    yield takeEvery(GET_STACKING_POLICY_LIST, getStakingPolicyListRequest);
}
/* add new staking request */
export function* addStakingPolicy() {
    yield takeEvery(ADD_STACKING_POLICY, addStakingPolicyRequest);
}
/* remove staking request */
export function* deleteStakingPolicy() {
    yield takeEvery(DELETE_STACKING_POLICY, deleteStakingPolicyRequest);
}
/* get staking by id */
export function* getStckingById() {
    yield takeEvery(GETSTAKINGCONFIG, getStckingByIdRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getMasterStakingList),
        fork(addMasterStaking),
        fork(deleteMasterStaking),
        fork(getStakingPolicyList),
        fork(addStakingPolicy),
        fork(deleteStakingPolicy),
        fork(getStckingById),
    ]);
}