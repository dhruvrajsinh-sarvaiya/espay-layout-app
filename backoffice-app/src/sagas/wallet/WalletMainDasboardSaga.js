//Sagas Effects..
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
//Action Types..
import {
    ORGDETAILS,
    USERDETAILS,
    TYPEDETAILS,
    ROLEDETAILS,
    WALLETTYPELIST,
    WALLETSUMMARY,
    WALLETSTATUSDETAILS,
    USERGRAPH,
    OGRGRAPH,
} from "../../actions/ActionTypes";
//Action methods..
import {
    getOrganizationsDetailsSuccess,
    getOrganizationsDetailsFail,
    getUsersDetailsSuccess,
    getUsersDetailsFail,
    getUserTypesDetailsSuccess,
    getUserTypesDetailsFail,
    getRoleDetailsSuccess,
    getRoleDetailsFail,
    getWalletTypeListSuccess,
    getWalletTypeListFail,
    getWalletSummarySuccess,
    getWalletSummaryFail,
    getWalletStatusDetailsSuccess,
    getWalletStatusDetailsFail,
    getUserGraphSuccess,
    getUserGraphFail,
    getOrganizationGraphSuccess,
    getOrganizationGraphFail,
} from '../../actions/Wallet/WalletMainDashboardAction';

import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";
import { swaggerGetAPI, } from "../../api/helper";

//get organization details from API
function* getOrganizationsDetailsAPI() {

    var swaggerUrl = Method.GetOrgCount;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getOrganizationsDetailsSuccess(response));
    } catch (error) {
        yield put(getOrganizationsDetailsFail(error));
    }
}

//get user details from API
function* getUsersDetailsAPI() {
    var swaggerUrl = Method.GetUserCount;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getUsersDetailsSuccess(response));
    } catch (error) {
        yield put(getUsersDetailsFail(error));
    }
}

//get user type details from API
function* getUserTypesDetailsAPI() {
    var swaggerUrl = Method.GetUserCountTypeWise;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getUserTypesDetailsSuccess(response));
    } catch (error) {
        yield put(getUserTypesDetailsFail(error));
    }
}

//get role details from API
function* getRoleDetailsAPI() {
    var swaggerUrl = Method.GetWalletAuthUserCountRoleWise;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getRoleDetailsSuccess(response));
    } catch (error) {
        yield put(getRoleDetailsFail(error));
    }
}

//get wallet type list from API
function* getWalletTypeListAPI() {
    var swaggerUrl = Method.GetDetailTypeWise;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getWalletTypeListSuccess(response));
    } catch (error) {
        yield put(getWalletTypeListFail(error));
    }
}

//get wallet SUMMARY from API
function* getWalletSummaryAPI() {
    var swaggerUrl = Method.GetOrgAllDetail;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getWalletSummarySuccess(response));
    } catch (error) {
        yield put(getWalletSummaryFail(error));
    }
}

//get wallet types from API
function* getWalletStatusAPI() {
    var swaggerUrl = Method.GetWalletCountStatusWise;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getWalletStatusDetailsSuccess(response));
    } catch (error) {
        yield put(getWalletStatusDetailsFail(error));
    }
}

//get user graph from API
function* getUserGraphAPI() {
    var swaggerUrl = Method.GetMonthwiseUserCount;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getUserGraphSuccess(response));
    } catch (error) {
        yield put(getUserGraphFail(error));
    }
}

//get user graph from API
function* getOrganizationGraphAPI() {
    var swaggerUrl = Method.GetMonthwiseOrgCount;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        yield put(getOrganizationGraphSuccess(response));
    } catch (error) {
        yield put(getOrganizationGraphFail(error));
    }
}

/* Create Sagas method for organization details */
export function* getOrganizationsDetails() {
    yield takeLatest(ORGDETAILS, getOrganizationsDetailsAPI);
}

/* Create Sagas method for user details */
export function* getUsersDetails() {
    yield takeLatest(USERDETAILS, getUsersDetailsAPI);
}

/* Create Sagas method for user type details */
export function* getUserTypesDetails() {
    yield takeLatest(TYPEDETAILS, getUserTypesDetailsAPI);
}

/* Create Sagas method for role details */
export function* getRoleDetails() {
    yield takeLatest(ROLEDETAILS, getRoleDetailsAPI);
}

/* Create Sagas method for wallet type list */
export function* getWalletTypeList() {
    yield takeLatest(WALLETTYPELIST, getWalletTypeListAPI);
}
/* GET WALLET SUMMARY */
export function* getWalletSummary() {
    yield takeLatest(WALLETSUMMARY, getWalletSummaryAPI);
}

/* Create Sagas method for wallet details */
export function* getWalletStatus() {
    yield takeLatest(WALLETSTATUSDETAILS, getWalletStatusAPI);
}

/* Create Sagas method for user graph */
export function* getUserGraph() {
    yield takeLatest(USERGRAPH, getUserGraphAPI);
}

/* Create Sagas method for organization graph */
export function* getOrganizationGraph() {
    yield takeLatest(OGRGRAPH, getOrganizationGraphAPI);
}



/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getOrganizationsDetails),
        fork(getUsersDetails),
        fork(getUserTypesDetails),
        fork(getRoleDetails),
        fork(getWalletTypeList),
        fork(getWalletSummary),
        fork(getWalletStatus),
        fork(getUserGraph),
        fork(getOrganizationGraph),
    ]);
}