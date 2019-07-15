/* 
    Description : Coinlist Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { GET_COINLIST_REQUEST, ADD_COINLIST_REQUEST } from '../actions/ActionTypes';
import {
    getCoinlistRequestSuccess,
    getCoinlistRequestFailure,
    addCoinListRequestFailure,
    addCoinListRequestSuccess
} from '../actions/CMS/CoinListRequestAction';
import { Method } from '../controllers/Constants';
import { WebPageUrlGetApi, WebPageUrlPostAPI } from '../api/helper';
import { userAccessToken } from '../selector';

//Function for Get Faq Category List API
function* getCoinListRequestAPI() {

    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID.replace('Bearer', 'JWT') };

        // To call Coin List Request api
        const response = yield call(WebPageUrlGetApi, Method.CoinListRequest, {}, headers);
        
        // To set Coin List Request success response to reducer
        yield put(getCoinlistRequestSuccess(response));
    } catch (error) {
        // To set Coin List Request failure response to reducer
        yield put(getCoinlistRequestFailure(error));
    }
}

// Generator for Add Coin List Request
function* addCoinListRequstServer({ payload }) {
    const { request } = payload
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        // To call Add Coin List Request api
        const response = yield call(WebPageUrlPostAPI, Method.addCoinListFieldsData, request, headers);

        // To set Add Coin List Request success response to reducer
        yield put(addCoinListRequestSuccess(response));
    } catch (error) {
        // To set Add Coin List Request failure response to reducer
        yield put(addCoinListRequestFailure(error));
    }
}

//Get Coinlist
export function* getCoinlistRequest() {
    yield takeEvery(GET_COINLIST_REQUEST, getCoinListRequestAPI);
}

export function* addNewCoinListRequstForm() {
    yield takeEvery(ADD_COINLIST_REQUEST, addCoinListRequstServer);
}

// Coinlist Root Saga
export default function* rootSaga() {
    yield all([
        // To register getCoinlistRequest method
        fork(getCoinlistRequest),
        // To register addNewCoinListRequstForm method
        fork(addNewCoinListRequstForm)
    ]);
}