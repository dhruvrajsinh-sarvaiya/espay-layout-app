/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : Margin Trading Wallet Management saga methods
*/
import { all, call, fork, take, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LIST_MARGIN_WALLETS,
    // CREATE_MARGIN_WALLETS,
    // ADD_LEVERAGE,
    // ADD_LEVERAGE_CONFIRMATION
} from 'Actions/types';
import {
    getMaringWalletListSuccess,
    getMaringWalletListFailure,
    // createMarginWalletSuccess,
    // createMarginWalletFailure,
    // addLeverageWithWalletSuccess,
    // addLeverageWithWalletFailure,
    // confirmAddLeverageSuccess,
    // confirmAddLeverageFailure
} from 'Actions/MarginTrading/MarginWallet';
const socketApiUrl = AppConfig.socketAPIUrl;
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();
//server request ...
function* getMaringWalletListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWalletControlPanel/ListMarginWallet/' + request.PageNo + "/" + request.PageSize + '?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("AccWalletId") && request.AccWalletId != "") {
        URL += '&AccWalletId=' + request.AccWalletId;
    }
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId !== "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("WalletId") && request.WalletId !== "") {
        URL += '&AccWalletId=' + request.WalletId;
    }
    if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType !== "") {
        URL += '&WalletUsageType=' + request.WalletUsageType;
    }
    const responseFromSocket = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getMaringWalletListSuccess(responseFromSocket));
            else
                yield put(getMaringWalletListFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getMaringWalletListFailure(error));
    }
}
//server request ...
// function* createMarginWalletRequest(payload) {
//     var headers = { 'Authorization': AppConfig.authorizationToken }
//     const responseFromSocket = yield call(swaggerPostAPI, 'api/MarginWallet/CreateMarginWallet/' + payload.WalletTypeId, payload.WalletTypeId, headers);
//     try {
//         // check response code
//         if (lgnErrCode.includes(responseFromSocket.statusCode)) {
//             //unauthorized or invalid token
//             redirectToLogin()
//         } else {
//             if (responseFromSocket.ReturnCode == 0)
//                 yield put(createMarginWalletSuccess(responseFromSocket));
//             else
//                 yield put(createMarginWalletFailure(responseFromSocket));
//         }
//     } catch (error) {
//         yield put(createMarginWalletFailure(error));
//     }
// }
// //server request ...
// function* addLeverageWithWalletRequest(payload) {
//     const request = payload.request;
//     var headers = { 'Authorization': AppConfig.authorizationToken }
//     const responseFromSocket = yield call(swaggerGetAPI, 'api/MarginWallet/GetMarginPreConfirmationData/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid, payload.WalletTypeId, headers);
//     try {
//         // check response code
//         if (lgnErrCode.includes(responseFromSocket.statusCode)) {
//             //unauthorized or invalid token
//             redirectToLogin()
//         } else {
//             if (responseFromSocket.ReturnCode == 0)
//                 yield put(addLeverageWithWalletSuccess(responseFromSocket));
//             else
//                 yield put(addLeverageWithWalletFailure(responseFromSocket));
//         }
//     } catch (error) {
//         yield put(addLeverageWithWalletFailure(error));
//     }
// }
// //server request ...
// function* confirmAddLeverageRequest(payload) {
//     const request = payload.request;
//     var headers = { 'Authorization': AppConfig.authorizationToken }
//     const responseFromSocket = yield call(swaggerPostAPI, 'api/MarginWallet/InsertMarginRequest/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid, payload.WalletTypeId, headers);
//     try {
//         // check response code
//         if (lgnErrCode.includes(responseFromSocket.statusCode)) {
//             //unauthorized or invalid token
//             redirectToLogin()
//         } else {
//             if (responseFromSocket.ReturnCode == 0)
//                 yield put(confirmAddLeverageSuccess(responseFromSocket));
//             else
//                 yield put(confirmAddLeverageFailure(responseFromSocket));
//         }
//     } catch (error) {
//         yield put(confirmAddLeverageFailure(error));
//     }
// }
// get a list of marging wallets...
function* getMaringWalletList() {
    yield takeEvery(LIST_MARGIN_WALLETS, getMaringWalletListRequest)
}
// create a margin wallet ...
// function* createMarginWallet() {
//     yield takeEvery(CREATE_MARGIN_WALLETS, createMarginWalletRequest)
// }
// /* add leverage with wallet */
// function* addLeverageWithWallet() {
//     yield takeEvery(ADD_LEVERAGE, addLeverageWithWalletRequest)
// }
// /* confirm add leverage wallet  */
// function* confirmAddLeverage() {
//     yield takeEvery(ADD_LEVERAGE_CONFIRMATION, confirmAddLeverageRequest)
// }

// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getMaringWalletList),
        // fork(createMarginWallet),
        // fork(addLeverageWithWallet),
        // fork(confirmAddLeverage),
    ]);
}
