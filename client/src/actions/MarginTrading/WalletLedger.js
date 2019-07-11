/* 
    Developer : Vishva shah
    Date : 1-03-2019
    File Comment : margin wallets Ledger Action
*/
import {
    //list
    MARGIN_WALLET_LEDGER,
	MARGIN_WALLET_LEDGER_SUCCESS,
	MARGIN_WALLET_LEDGER_FAILURE,

} from '../types';

/* List maging wallets Ledger*/
export const getMarginWalletLedger = (request) => ({
    type: MARGIN_WALLET_LEDGER,
    request: request
});
export const getMarginWalletLedgerSuccess = (response) => ({
    type: MARGIN_WALLET_LEDGER_SUCCESS,
    payload: response
});
export const getMarginWalletLedgerFailure = (error) => ({
    type: MARGIN_WALLET_LEDGER_FAILURE,
    payload: error
});