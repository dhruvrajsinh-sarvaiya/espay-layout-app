// sagas For Transaction Charge Actions By Tejas Date : 5/10/2018

// for call axios call or API Call
import api from 'Api';

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import { GET_TRANSACTION_CHARGE } from 'Actions/types';

// action sfor set data or response
import { getTransactionChargeSuccess, getTransactionChargeFailure } from 'Actions/TransactionCharge';

// Sagas Function for get Transaction Charge Report data by :Tejas Date : 5/10/2018
function* getTransactionCharge() {
    yield takeEvery(GET_TRANSACTION_CHARGE, getTransactionChargeData)
}

// Function for set response to data and Call Function for Api Call
function* getTransactionChargeData({payload}) {
    const { Pair } = payload;
    try {
        const response = yield call(getTransactionChargeRequest,Pair)

        // set response if its available else set error message
        if (response && response != null && response != undefined) {
            yield put(getTransactionChargeSuccess(response))
        } else {
            yield put(getTransactionChargeFailure(error))
        }
    } catch (error) {
        yield put(getTransactionChargeFailure(error))
    }
}

// function for Call api and set response 
const getTransactionChargeRequest = async (transactionChargeRequest) =>
    await api.get('TransactionCharge.js')
        .then(response => response)
        .catch(error => error)


// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getTransactionCharge),
    ]);
}