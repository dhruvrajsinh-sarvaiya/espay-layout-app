import { call, put, takeLatest, select } from 'redux-saga/effects';
import { userAccessToken } from '../selector';
// import types for dispatch puropse
import { GET_ALL_BALANCE, GET_WALLETBALANCE, } from '../actions/ActionTypes';
// import functions from action
import {
    getAllBalanceSuccess,
    getAllBalanceFailure,
    getWalletsBalanceSuccess,
    getWalletsBalanceFailure
} from '../actions/Wallet/FundViewAction';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI } from '../api/helper';

// Generator for Balance Socket
function* getAllBalanceSocket() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call All Balance Socket Request api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetAvailbleBalTypeWise, {}, headers);

        // To set All Balance Socket success response to reducer
        yield put(getAllBalanceSuccess(responseFromSocket));
    } catch (error) {
        // To set All Balance Socket failure response to reducer
        yield put(getAllBalanceFailure(error));
    }
}

// Generator for Walllet Balance
function* getWalletsBalanceSocket(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        
        // To call Wallet Balance Socket Request api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetAllBalancesTypeWise + '/' + payload.WalletType, payload.walletBalanceRequest, headers);
        
        // To set Walllet Balance Socket success response to reducer
        yield put(getWalletsBalanceSuccess(responseFromSocket));
    } catch (error) {
        // To set Walllet Balance Socket failure response to reducer
        yield put(getWalletsBalanceFailure(error));
    }
}

export default function* FundViewSaga() {
    // To register getWalletsBalanceSocket method
    yield takeLatest(GET_WALLETBALANCE, getWalletsBalanceSocket)
    // To register getAllBalanceSocket method
    yield takeLatest(GET_ALL_BALANCE, getAllBalanceSocket)
}