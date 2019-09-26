import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    swaggerGetAPI,
    swaggerPostAPI
} from "../../api/helper";
import {
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    DESTROY_BLACKFUND
} from '../../actions/ActionTypes';
import {
    getListBlockUnblockUserAddressSuccess,
    getListBlockUnblockUserAddressFailure,
    getBlockUnblockUserAddressSuccess,
    getBlockUnblockUserAddressFailure,
    destroyBlackfundSuccess,
    destroyBlackfundFailure
} from '../../actions/Wallet/UserAddressAction';

import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';

//get User Address List  Api
function* getListBlockUnblockUserAddressApi({ payload }) {

    try {
        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.ListBlockUnblockUserAddress + '?';

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

        // To call user address list api
        const response = yield call(swaggerGetAPI, URL, request, headers);

        // To set  user address List success response to reducer
        yield put(getListBlockUnblockUserAddressSuccess(response));
    } catch (error) {
        // To set  user address List Failure response to reducer
        yield put(getListBlockUnblockUserAddressFailure(error));
    }
}

//get User Address List
export function* getListBlockUnblockUserAddress() {
    yield takeEvery(GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS, getListBlockUnblockUserAddressApi);
}

//get block unblock address from API
function* getBlockUnblockUserAddressApi({ payload }) {

    try {
        console.log(payload);

        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.BlockUnblockUserAddress;

        // To call block/unblock User Data Api
        const response = yield call(swaggerPostAPI, URL, request, headers);

        // To set block/unblock User success response to reducer
        yield put(getBlockUnblockUserAddressSuccess(response));
    } catch (error) {
        // To set block/unblock User Failure response to reducer
        yield put(getBlockUnblockUserAddressFailure(error));
    }
}

// get block unblock address 
export function* getBlockUnblockUserAddress() {
    yield takeEvery(GET_BLOCK_UNBLOCK_USER_ADDRESS, getBlockUnblockUserAddressApi);
}

//destroy black fund from API
function* destroyBlackFundApi({ payload }) {

    try {
        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.DestroyBlackFund;

        // To call destory User  Data Api
        const response = yield call(swaggerPostAPI, URL, request, headers);

        // To set destory User success response to reducer
        yield put(destroyBlackfundSuccess(response));
    } catch (error) {
        // To set destory User Failure response to reducer
        yield put(destroyBlackfundFailure(error));
    }
}

// destroy black fund 
export function* destroyBlackfunds() {
    yield takeEvery(DESTROY_BLACKFUND, destroyBlackFundApi);
}

// link to root saga middleware
export default function* rootSaga() {
    yield all([
        fork(getListBlockUnblockUserAddress),
        fork(getBlockUnblockUserAddress),
        fork(destroyBlackfunds),
    ]);
}
