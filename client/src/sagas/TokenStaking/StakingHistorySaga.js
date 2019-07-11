/* 
    Developer : Nishant Vadgama
    Date : 21-09-2018
    File comment : Token Staking saga methods list
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_STAKHISTORY,
    UNSTAKPRECONFIRMATION,
    UNSTAKREQUEST
} from 'Actions/types';
import {
    getStakHistorySuccess,
    getStakHistoryFailure,
    getUnstakingPreConfirmationSuccess,
    getUnstakingPreConfirmationFailure,
    postUnstakRequestSuccess,
    postUnstakRequestFailure
} from 'Actions/TokenStaking';
const lgnErrCode = loginErrCode();
/* get history request */
function* getStakHistoryData(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletOperations/GetStackingHistory/' + request.PageSize + "/" + request.Page + '?';
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    if (request.hasOwnProperty("Type") && request.Type != "") {
        URL += '&Type=' + request.Type;
    }
    if (request.hasOwnProperty("Slab") && request.Slab != "") {
        URL += '&Slab=' + request.Slab;
    }
    if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
        URL += '&StakingType=' + request.StakingType;
    }
    const responseFromSocket = yield call(swaggerGetAPI, URL, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getStakHistorySuccess(responseFromSocket));
            else
                yield put(getStakHistoryFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getStakHistoryFailure(error));
    }
}
/* get staking history */
function* getStakHistory() {
    yield takeEvery(GET_STAKHISTORY, getStakHistoryData)
}
/* get unstaking pre confirmation request */
function* getUnstakingPreConfirmationRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/GetPreUnStackingConfirmationData', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getUnstakingPreConfirmationSuccess(responseFromSocket));
            else
                yield put(getUnstakingPreConfirmationFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getUnstakingPreConfirmationFailure(error));
    }
}
/* get unstaking pre confirmation */
function* getUnstakingPreConfirmation() {
    yield takeEvery(UNSTAKPRECONFIRMATION, getUnstakingPreConfirmationRequest);
}
/* post unstaking server request  */
function* postUnstakRequestRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/UserUnstackingRequest', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(postUnstakRequestSuccess(responseFromSocket));
            else
                yield put(postUnstakRequestFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(postUnstakRequestFailure(error));
    }
}
/* post unstaking request */
function* postUnstakRequest() {
    yield takeEvery(UNSTAKREQUEST, postUnstakRequestRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getStakHistory),
        fork(getUnstakingPreConfirmation),
        fork(postUnstakRequest)
    ]);
}