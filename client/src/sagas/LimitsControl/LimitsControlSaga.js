/* 
    Developer : Nishant Vadgama
    Date : 25-09-2018
    File Comment : Limit Control saga method list
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import AppConfig from "Constants/AppConfig";
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
//import constant
import { GET_LC_WALLETS, GET_LIMITINFO, POST_LIMITINFO } from "Actions/types";
// import functions from action
import {
    getWalletsSuccess,
    getWalletsFailure,
    getLimitInfoSuccess,
    getLimitInfoFailure,
    postLimitInfoSuccess,
    postLimitInfoFailure
} from "Actions/LimitsControl";

/* GET WALLETS */
function* getWalletsSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/ListWallet', payload, headers);
    try {
        //redirect to login if token expired
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            redirectToLogin();
        } else {
            // check response code
            yield put(getWalletsSuccess(responseFromSocket));
        }
    } catch (error) {
        yield put(getWalletsFailure(error));
    }
}
function* getWallets() {
    yield takeEvery(GET_LC_WALLETS, getWalletsSocket);
}
/* GET LIMIT CONFIGURATION */
function* getLimitInfoSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOperations/GetWalletLimit/' + payload.walletId, payload, headers);
    try {
        //redirect to login if token expired
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            redirectToLogin();
        } else {
            yield put(getLimitInfoSuccess(responseFromSocket));
        }
    } catch (error) {
        yield put(getLimitInfoFailure(error));
    }
}
function* getLimitInfo() {
    yield takeEvery(GET_LIMITINFO, getLimitInfoSocket);
}
/* POST LIMIT CONFIGURATION */
function* postLimitInfoSocket(payload) {
    let reqObj = {
        AccWalletID: payload.request.AccWalletID,
        TrnType: parseFloat(payload.request.TrnType),
        LimitPerDay: parseFloat(payload.request.LimitPerDay),
        LimitPerHour: parseFloat(payload.request.LimitPerHour),
        LimitPerTransaction: parseFloat(payload.request.LimitPerTransaction),
        LifeTime: parseFloat(payload.request.LifeTime),
        StartTimeUnix: parseFloat(payload.request.StartTime),
        EndTimeUnix: parseFloat(payload.request.EndTime)
    };
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/SetWalletLimit/' + reqObj.AccWalletID, reqObj, headers);
    try {
        //redirect to login if token expired
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            redirectToLogin();
        } else {
            yield put(postLimitInfoSuccess(responseFromSocket));
        }
    } catch (error) {
        yield put(postLimitInfoFailure(error));
    }
}
function* postLimitInfo() {
    yield takeEvery(POST_LIMITINFO, postLimitInfoSocket);
}
export default function* rootSaga() {
    yield all([
        fork(getWallets),
        fork(getLimitInfo),
        fork(postLimitInfo)
    ]);
}
