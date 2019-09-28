// UserCoinListRequestSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { WebPageUrlGetApi, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_USER_COIN_LIST_REQUEST, GET_COIN_LIST_REQ_DASHBOARD_COUNT } from '../../actions/ActionTypes';
import { getUserCoinListRequestDataSuccess, getUserCoinListRequestDataFailure, getCoinListReqCountSuccess, getCoinListReqCountFailure } from '../../actions/CMS/UserCoinListRequestActions';

export default function* UserCoinListRequestSaga() {
    // To register Get User Coin List Request List method
    yield takeEvery(GET_USER_COIN_LIST_REQUEST, getUserCoinListRequest)
    // To register Get User Coin List Request List method
    yield takeEvery(GET_COIN_LIST_REQ_DASHBOARD_COUNT, getCoinListReqCount)
}

// Generator for Get User Coin List Request
function* getUserCoinListRequest() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Get User Coin List Request Data Api
        const data = yield call(WebPageUrlGetApi, Method.coinRequestByUser, {}, headers)

        // To set Get User Coin List Request success response to reducer
        yield put(getUserCoinListRequestDataSuccess(data))
    } catch (error) {
        // To set Get User Coin List Request failure response to reducer
        yield put(getUserCoinListRequestDataFailure())
    }
}

// Generator for Get User Coin List Request
function* getCoinListReqCount() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Get User Coin List Request Data Api
        const data = yield call(WebPageUrlGetApi, Method.CoinListCount, {}, headers)

        // To set Get User Coin List Request success response to reducer
        yield put(getCoinListReqCountSuccess(data))
    } catch (error) {
        // To set Get User Coin List Request failure response to reducer
        yield put(getCoinListReqCountFailure())
    }
}