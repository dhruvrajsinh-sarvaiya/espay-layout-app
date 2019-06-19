/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    FIle Comment : User wallets action method's saga implementation
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_ALL_WALLETS,
    GETWALLETAUTHUSERS,
    GETWALLETBYID,
    EXPORT_WALLETS
} from "Actions/types";
import {
    getAllWalletsSuccess,
    getAllWalletsFailure,
    getWalletsAuthUserListSuccess,
    getWalletsAuthUserListFailure,
    getWalletByIdSuccess,
    getWalletByIdFailure,
    exportWalletsSuccess,
    exportWalletsFailure
} from "Actions/Wallet";

// Used for call function for get Withdraw History
function* getAllWalletsRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListAllWallet/' + request.PageSize + "/" + request.Page + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("UserId") && request.UserId != "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("OrgId") && request.OrgId != "") {
        URL += '&OrgId=' + request.OrgId;
    }
    if (request.hasOwnProperty("WalletType") && request.WalletType != "") {
        URL += '&WalletType=' + request.WalletType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getAllWalletsSuccess(response));
        } else {
            yield put(getAllWalletsFailure(response));
        }
    } catch (error) {
        yield put(getAllWalletsFailure(error));
    }
}
// dispatch action for get WithdrawHistory
function* getAllWallets() {
    yield takeEvery(GET_ALL_WALLETS, getAllWalletsRequest);
}
// get wallet details by id request
function* getWalletByIdRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/GetWalletIdWise/' + request.walletId, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletByIdSuccess(response));
        } else {
            yield put(getWalletByIdFailure(response));
        }
    } catch (error) {
        yield put(getWalletByIdFailure(error));
    }
}
//get wallet details by ID
function* getWalletById() {
    yield takeEvery(GETWALLETBYID, getWalletByIdRequest);
}
// get atuh user list request
function* getWalletsAuthUserListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListWalletAuthorizeUser/' + request.walletId, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWalletsAuthUserListSuccess(response));
        } else {
            yield put(getWalletsAuthUserListFailure(response));
        }
    } catch (error) {
        yield put(getWalletsAuthUserListFailure(error));
    }
}
//get auth user list 
function* getWalletsAuthUserList() {
    yield takeEvery(GETWALLETAUTHUSERS, getWalletsAuthUserListRequest);
}
/* Export wallet request */
function* exportWalletsRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ExportWallet/' + request.FileName + '/' + request.Coin, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(exportWalletsSuccess(response));
        } else {
            yield put(exportWalletsFailure(response));
        }
    } catch (error) {
        yield put(exportWalletsFailure(error));
    }
}
/* Export wallets */
function* exportWallets() {
    yield takeEvery(EXPORT_WALLETS, exportWalletsRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getAllWallets),
        fork(getWalletById),
        fork(getWalletsAuthUserList),
        fork(exportWallets),
    ]);
}
