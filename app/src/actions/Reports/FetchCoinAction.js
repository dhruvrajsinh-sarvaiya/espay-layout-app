import { action } from '../GlobalActions';
import {
    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // Get Wallet Address
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,
    DropdownChange
} from '../ActionTypes';

// Redux actions for Coin Selection
export function fetchCoin() {
    return action(FETCH_BALANCE)
}
// Redux actions for Coin Selection Success
export function fetchCoinSuccess(data) {
    return action(FETCH_BALANCE_SUCCESS, { data })
}
// Redux actions for Coin Selection Failure
export function fetchCoinFailure() {
    return action(FETCH_BALANCE_FAILURE)
}

// Redux actions for get Wallets
export function getWallets(walletsRequest) {
    return action(GET_AD_WALLETS, { walletsRequest })
}
// Redux actions for get Wallets Success
export function fetchUserLedgerListSuccess(data) {
    return action(GET_AD_WALLETS_SUCCESS, { data })
}
// Redux actions for get Wallets Failure
export function fetchUserLedgerListFailure() {
    return action(GET_AD_WALLETS_FAILURE)
}

//on Dropdown coin or address selection
export function OnDropdownChange() {
    return action(DropdownChange)
}
