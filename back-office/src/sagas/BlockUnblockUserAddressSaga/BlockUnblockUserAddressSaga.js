/* 
    Developer : Parth Andhariya
    Date : 24-05-2019
    File Comment : Block Unblock User Address Saga
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
    swaggerPostAPI
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    // list 
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    //block/unblock
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    //destroy black fund
    DESTROY_BLACKFUND
} from "Actions/types";
import {
    getListBlockUnblockUserAddressSuccess,
    getListBlockUnblockUserAddressFailure,
    getBlockUnblockUserAddressSuccess,
    getBlockUnblockUserAddressFailure,
    destroyBlackfundSuccess,
    destroyBlackfundFailure
} from "Actions/BlockUnblockUserAddressAction";

//get bolck unblock address list from API
function* getListBlockUnblockUserAddressApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/ListBlockUnblockUserAddress?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("UserId") && request.UserId != "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("Address") && request.Address != "") {
        URL += '&Address=' + request.Address;
    }
    if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
        URL += '&FromDate=' + request.FromDate;
    }
    if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
        URL += '&ToDate=' + request.ToDate;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(getListBlockUnblockUserAddressSuccess(response));
        } else {
            yield put(getListBlockUnblockUserAddressFailure(response));
        }
    } catch (error) {
        yield put(getListBlockUnblockUserAddressFailure(error));
    }
}
/* get bolck unblock address list */
export function* getListBlockUnblockUserAddress() {
    yield takeEvery(GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS, getListBlockUnblockUserAddressApi);
}

//get bolck unblock address from API
function* getBlockUnblockUserAddressApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/BlockUnblockUserAddress';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(getBlockUnblockUserAddressSuccess(response));
        } else {
            yield put(getBlockUnblockUserAddressFailure(response));
        }
    } catch (error) {
        yield put(getBlockUnblockUserAddressFailure(error));
    }
}
/* get bolck unblock address */
export function* getBlockUnblockUserAddress() {
    yield takeEvery(GET_BLOCK_UNBLOCK_USER_ADDRESS, getBlockUnblockUserAddressApi);
}
//destroy black fund from API
function* destroyBlackFundApi(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/DestroyBlackFund';
    const response = yield call(swaggerPostAPI, URL, request, headers);
    try {
        // check response code
        if (response.ReturnCode == 0) {
            yield put(destroyBlackfundSuccess(response));
        } else {
            yield put(destroyBlackfundFailure(response));
        }
    } catch (error) {
        yield put(destroyBlackfundFailure(error));
    }
}
/* destroy black fund */
export function* destroyBlackfunds() {
    yield takeEvery(DESTROY_BLACKFUND, destroyBlackFundApi);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getListBlockUnblockUserAddress),
        fork(getBlockUnblockUserAddress),
        fork(destroyBlackfunds),
    ]);
}
