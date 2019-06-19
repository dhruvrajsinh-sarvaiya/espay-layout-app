/* 
    Developer : Nishant Vadgama
    Date : 24-11-2018
    File Comment : Wallet Dashboard super admin saga
*/
//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from 'Helpers/helpers';
//Action Types..
import {
    ORGDETAILS,
    USERDETAILS,
    TYPEDETAILS,
    ORGLIST,
    WALLETDETAILS,
    WALLETTYPES,
    ROLEDETAILS,
    USERGRAPH,
    OGRGRAPH,
    RECENTCHARGES,
    RECENTUSAGE,
    RECENTCOMMISION,
    WALLETTRNTYPES,
    TRNGRAPH,
    WALLETUSERDETAILS,
    WALLETTYPELIST,
    WALLETSUMMARY,
    CHANNELDETAILS
} from 'Actions/types';
//Action methods..
import {
    getOrganizationsDetailsSuccess,
    getOrganizationsDetailsFail,
    getUsersDetailsSuccess,
    getUsersDetailsFail,
    getUserTypesDetailsSuccess,
    getUserTypesDetailsFail,
    getOrgListSuccess,
    getOrgListFail,
    getWalletDetailsSuccess,
    getWalletDetailsFail,
    getWalletTypesSuccess,
    getWalletTypesFail,
    getRoleDetailsSuccess,
    getRoleDetailsFail,
    getUserGraphSuccess,
    getUserGraphFail,
    getOrganizationGraphSuccess,
    getOrganizationGraphFail,
    getRecentChargesSuccess,
    getRecentChargesFail,
    getRecentUsageSuccess,
    getRecentUsageFail,
    getRecentCommissionSuccess,
    getRecentCommissionFail,
    getWalletTrnTypesSuccess,
    getWalletTrnTypesFail,
    getTransactionGraphDataSuccess,
    getTransactionGraphDataFail,
    getWalletUserDetailsSuccess,
    getWalletUserDetailsFail,
    getWalletTypeListSuccess,
    getWalletTypeListFail,
    getWalletSummarySuccess,
    getWalletSummaryFail,
    getChannelDetailsSuccess,
    getChannelDetailsFail
} from 'Actions/Wallet';
// swagger url from app config
import AppConfig from 'Constants/AppConfig';

//get organization details from API
function* getOrganizationsDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetOrgCount', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getOrganizationsDetailsSuccess(response));
        } else {
            yield put(getOrganizationsDetailsFail(response));
        }
    } catch (error) {
        yield put(getOrganizationsDetailsFail(error));
    }
}
//get user details from API
function* getUsersDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetUserCount', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getUsersDetailsSuccess(response));
        } else {
            yield put(getUsersDetailsFail(response));
        }
    } catch (error) {
        yield put(getUsersDetailsFail(error));
    }
}
//get user type details from API
function* getUserTypesDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetUserCountTypeWise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getUserTypesDetailsSuccess(response));
        } else {
            yield put(getUserTypesDetailsFail(response));
        }
    } catch (error) {
        yield put(getUserTypesDetailsFail(error));
    }
}
//get organization list from API
function* getOrgListAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListOrgDetails', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getOrgListSuccess(response));
        } else {
            yield put(getOrgListFail(response));
        }
    } catch (error) {
        yield put(getOrgListFail(error));
    }
}
//get wallet types from API
function* getWalletDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetWalletCountStatusWise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletDetailsSuccess(response));
        } else {
            yield put(getWalletDetailsFail(response));
        }
    } catch (error) {
        yield put(getWalletDetailsFail(error));
    }
}
//get wallet details from API
function* getWalletTypesAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetWalletCountTypeWise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletTypesSuccess(response));
        } else {
            yield put(getWalletTypesFail(response));
        }
    } catch (error) {
        yield put(getWalletTypesFail(error));
    }
}
//get role details from API
function* getRoleDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetWalletAuthUserCountRoleWise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getRoleDetailsSuccess(response));
        } else {
            yield put(getRoleDetailsFail(response));
        }
    } catch (error) {
        yield put(getRoleDetailsFail(error));
    }
}
//get user graph from API
function* getUserGraphAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetMonthwiseUserCount', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getUserGraphSuccess(response));
        } else {
            yield put(getUserGraphFail(response));
        }
    } catch (error) {
        yield put(getUserGraphFail(error));
    }
}
//get user graph from API
function* getOrganizationGraphAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetMonthwiseOrgCount', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getOrganizationGraphSuccess(response));
        } else {
            yield put(getOrganizationGraphFail(response));
        }
    } catch (error) {
        yield put(getOrganizationGraphFail(error));
    }
}
//get recent charges records from API
function* getRecentChargesAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListChargePolicyLastFive', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getRecentChargesSuccess(response));
        } else {
            yield put(getRecentChargesFail(response));
        }
    } catch (error) {
        yield put(getRecentChargesFail(error));
    }
}
//get recent usage records from API
function* getRecentUsageAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListUsagePolicyLastFive', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getRecentUsageSuccess(response));
        } else {
            yield put(getRecentUsageFail(response));
        }
    } catch (error) {
        yield put(getRecentUsageFail(error));
    }
}
//get recent commission records from API
function* getRecentCommissionAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListCommissionPolicyLastFive', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getRecentCommissionSuccess(response));
        } else {
            yield put(getRecentCommissionFail(response));
        }
    } catch (error) {
        yield put(getRecentCommissionFail(error));
    }
}
//get wallet transaction types from API
function* getWalletTrnTypesAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListWalletTrnType', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletTrnTypesSuccess(response.Data));
        } else {
            yield put(getWalletTrnTypesFail(response));
        }
    } catch (error) {
        yield put(getWalletTrnTypesFail(error));
    }
}
//get transaction type graph from API
function* getTransactionGraphDataAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetTranCountTypewise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getTransactionGraphDataSuccess(response));
        } else {
            yield put(getTransactionGraphDataFail(response));
        }
    } catch (error) {
        yield put(getTransactionGraphDataFail(error));
    }
}
//get wallet user details from API
function* getWalletUserDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListUserLastFive', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletUserDetailsSuccess(response));
        } else {
            yield put(getWalletUserDetailsFail(response));
        }
    } catch (error) {
        yield put(getWalletUserDetailsFail(error));
    }
}
//get wallet type list from API
function* getWalletTypeListAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetDetailTypeWise', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletTypeListSuccess(response));
        } else {
            yield put(getWalletTypeListFail(response));
        }
    } catch (error) {
        yield put(getWalletTypeListFail(error));
    }
}
//get wallet SUMMARY from API
function* getWalletSummaryAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetOrgAllDetail', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletSummarySuccess(response));
        } else {
            yield put(getWalletSummaryFail(response));
        }
    } catch (error) {
        yield put(getWalletSummaryFail(error));
    }
}
//get channel details from API
function* getChannelDetailsAPI(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListChannelwiseTransactionCount', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getChannelDetailsSuccess(response));
        } else {
            yield put(getChannelDetailsFail(response));
        }
    } catch (error) {
        yield put(getChannelDetailsFail(error));
    }
}
/* Create Sagas method for organization details */
export function* getOrganizationsDetails() {
    yield takeEvery(ORGDETAILS, getOrganizationsDetailsAPI);
}
/* Create Sagas method for user details */
export function* getUsersDetails() {
    yield takeEvery(USERDETAILS, getUsersDetailsAPI);
}
/* Create Sagas method for user type details */
export function* getUserTypesDetails() {
    yield takeEvery(TYPEDETAILS, getUserTypesDetailsAPI);
}
/* Create Sagas method for organization list */
export function* getOrgList() {
    yield takeEvery(ORGLIST, getOrgListAPI);
}
/* Create Sagas method for wallet details */
export function* getWalletDetails() {
    yield takeEvery(WALLETDETAILS, getWalletDetailsAPI);
}
/* Create Sagas method for wallet types */
export function* getWalletTypes() {
    yield takeEvery(WALLETTYPES, getWalletTypesAPI);
}
/* Create Sagas method for role details */
export function* getRoleDetails() {
    yield takeEvery(ROLEDETAILS, getRoleDetailsAPI);
}
/* Create Sagas method for user graph */
export function* getUserGraph() {
    yield takeEvery(USERGRAPH, getUserGraphAPI);
}
/* Create Sagas method for organization graph */
export function* getOrganizationGraph() {
    yield takeEvery(OGRGRAPH, getOrganizationGraphAPI);
}
/* Create Sagas method for recent charges records */
export function* getRecentCharges() {
    yield takeEvery(RECENTCHARGES, getRecentChargesAPI);
}
/* Create Sagas method for recent usage records */
export function* getRecentUsage() {
    yield takeEvery(RECENTUSAGE, getRecentUsageAPI);
}
/* Create Sagas method for recent commission records */
export function* getRecentCommission() {
    yield takeEvery(RECENTCOMMISION, getRecentCommissionAPI);
}
/* Create Sagas method for wallet transaction types */
export function* getWalletTrnTypes() {
    yield takeEvery(WALLETTRNTYPES, getWalletTrnTypesAPI);
}
/* Create Sagas method for transaction graph details */
export function* getTransactionGraphData() {
    yield takeEvery(TRNGRAPH, getTransactionGraphDataAPI);
}
/* Create Sagas method for wallet users details */
export function* getWalletUserDetails() {
    yield takeEvery(WALLETUSERDETAILS, getWalletUserDetailsAPI);
}
/* Create Sagas method for wallet type list */
export function* getWalletTypeList() {
    yield takeEvery(WALLETTYPELIST, getWalletTypeListAPI);
}
/* GET WALLET SUMMARY */
export function* getWalletSummary() {
    yield takeEvery(WALLETSUMMARY, getWalletSummaryAPI);
}
/* GET CHANNEL DETAILS */
export function* getChannelDetails() {
    yield takeEvery(CHANNELDETAILS, getChannelDetailsAPI);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getOrganizationsDetails),
        fork(getUsersDetails),
        fork(getUserTypesDetails),
        fork(getOrgList),
        fork(getWalletDetails),
        fork(getWalletTypes),
        fork(getRoleDetails),
        fork(getUserGraph),
        fork(getOrganizationGraph),
        fork(getRecentCharges),
        fork(getRecentUsage),
        fork(getRecentCommission),
        fork(getWalletTrnTypes),
        fork(getTransactionGraphData),
        fork(getWalletUserDetails),
        fork(getWalletTypeList),
        fork(getWalletSummary),
        fork(getChannelDetails),
    ]);
}