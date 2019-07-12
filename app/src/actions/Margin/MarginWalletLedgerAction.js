import {
    // Get Margin Wallet Ledger Data
    GET_MARGIN_WALLET_LEDGER_DATA,
    GET_MARGIN_WALLET_LEDGER_DATA_SUCCESS,
    GET_MARGIN_WALLET_LEDGER_DATA_FAILURE,

    // Get Margin Wallet Ledger Data Clear
    GET_MARGIN_WALLET_LEDGER_DATA_CLEAR,
} from '../ActionTypes'
import { action } from '../../actions/GlobalActions';

// Redux action to Get Margin Wallet Ledger
export function getMarginWalletLedgerData(data) {
    return action(GET_MARGIN_WALLET_LEDGER_DATA,{data})
}
// Redux action to Get Margin Wallet Ledger Success
export function getMarginWalletLedgerDataSuccess(data) {
    return action(GET_MARGIN_WALLET_LEDGER_DATA_SUCCESS, { data })
}
// Redux action to Get Margin Wallet Ledger Failure
export function getMarginWalletLedgerDataFailure() {
    return action(GET_MARGIN_WALLET_LEDGER_DATA_FAILURE)
}

// Clear Margin Wallet Ledger
export function getMarginWalletLedgerDataClear() {
    return action(GET_MARGIN_WALLET_LEDGER_DATA_CLEAR)
}