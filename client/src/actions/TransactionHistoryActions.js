/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Actions
 */

 // import neccessary action types
import {
    TRANSACTION_HISTORY,
    TRANSACTION_HISTORY_SUCCESS,
    TRANSACTION_HISTORY_FAILURE,
    TRANSACTION_HISTORY_REFRESH,
} from './types';

/**
 * Use: used to handle transaction history action type
 * Input: Transaction History Request
 * Request contain start date, end date, order type,status
 */
export const transactionHistory = (transactionHistoryRequest) => ({
    type: TRANSACTION_HISTORY,
    payload:  transactionHistoryRequest
})

/**
 * Use: used to handle transaction history success action type
 * Input: Transaction History List or response from API or sagas
 */
export const transactionHistorySuccess = (list) => ({
    type: TRANSACTION_HISTORY_SUCCESS,
    payload: list.response
});

/**
 * Use: used to handle transaction history success action type
 * Input: Transaction History List Error  or response from API or sagas
 */
export const transactionHistoryFailure = (error) => ({
    type: TRANSACTION_HISTORY_FAILURE,
    payload: error
})

/**
 * Use: used to handle transaction history success action type
 * Input: Transaction History Request Error  or response from API or sagas
 * Request contain start date, end date, order type,status
 */
export const transactionHistoryRefresh = (transactionHistoryRequest) => ({
    type: TRANSACTION_HISTORY_REFRESH,
    payload: {transactionHistoryRequest}
})