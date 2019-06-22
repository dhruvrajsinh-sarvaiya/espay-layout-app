import {
    FETCHING_DEPOSIT_HISTORY_DATA,
    FETCH_DEPOSIT_HISTORY_SUCCESS,
    FETCH_DEPOSIT_HISTORY_FAILURE,
    GENERATE_NEW_ADDRESS,
    GENERATE_NEW_ADDRESS_SUCCESS,
    GENERATE_NEW_ADDRESS_FAILURE,
} from "../actions/ActionTypes";
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { Method } from "../controllers/Constants";
import { userAccessToken } from '../selector';
import { swaggerGetAPI, swaggerPostAPI } from "../api/helper";
import { isEmpty } from "../validations/CommonValidation";

// Fetch Deposit History Data
function* fetchDepositHistoryData(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create requestUrl
        var url = '';
        if (isEmpty(action.depositHistoryRequest.Coin))
            url = Method.DepositHistoy + '/' + action.depositHistoryRequest.FromDate + '/' + action.depositHistoryRequest.ToDate;
        else
            url = Method.DepositHistoy + '/' + action.depositHistoryRequest.FromDate + '/' + action.depositHistoryRequest.ToDate + '?Coin=' + action.depositHistoryRequest.Coin;

        // To call Deposit History Request api
        const data = yield call(swaggerGetAPI, url, action.depositHistoryRequest, headers);

        // To set Deposite History success response to reducer
        yield put({ type: FETCH_DEPOSIT_HISTORY_SUCCESS, data })
    } catch (error) {
        // To set Deposite History failure response to reducer
        yield put({ type: FETCH_DEPOSIT_HISTORY_FAILURE, e })
    }
}

// Generate New Address Deposit Data
function* FetchNewAddress(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call New Add Desposit api
        const data = yield call(swaggerPostAPI, Method.CreateWalletAddress + '/' + action.generateAddressRequest.Coin + '/' + action.generateAddressRequest.AccWalletID, action.generateAddressRequest, headers);
        
        // To set Generate New Address success response to reducer
        yield put({ type: GENERATE_NEW_ADDRESS_SUCCESS, data })
    } catch (error) {
        // To set Generate New Address failure response to reducer
        yield put({ type: GENERATE_NEW_ADDRESS_FAILURE, e })
    }
}

/* GET WALLETS */
function* DepositSaga() {

    // Call get Deposit History Data
    yield takeLatest(FETCHING_DEPOSIT_HISTORY_DATA, fetchDepositHistoryData)

    // Call get Generate New Address Data
    yield takeLatest(GENERATE_NEW_ADDRESS, FetchNewAddress)
}

export default DepositSaga
