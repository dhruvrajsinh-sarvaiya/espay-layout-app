import {
    // Get User Wallets List
    GET_USER_WALLETS_LIST,
    GET_USER_WALLETS_LIST_SUCCESS,
    GET_USER_WALLETS_LIST_FAILURE,

    // Clear User Wallets Data
    CLEAR_USER_WALLETS_DATA,

    // Get Auth User List
    GET_AUTH_USER_LIST,
    GET_AUTH_USER_LIST_SUCCESS,
    GET_AUTH_USER_LIST_FAILURE,

    // Get Wallet Ledger List
    GET_WALLET_LEDGER_LIST,
    GET_WALLET_LEDGER_LIST_SUCCESS,
    GET_WALLET_LEDGER_LIST_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get User Wallets List
export function getUserWalletsList(payload = {}) {
    return action(GET_USER_WALLETS_LIST, { payload })
}

// Redux action for Get User Wallets List Success
export function getUserWalletsListSuccess(data) {
    return action(GET_USER_WALLETS_LIST_SUCCESS, { data })
}

// Redux action for Get User Wallets List Failure
export function getUserWalletsListFailure() {
    return action(GET_USER_WALLETS_LIST_FAILURE)
}

// Redux action for Clear User Wallets Data
export function clearUserWalletsData() {
    return action(CLEAR_USER_WALLETS_DATA)
}

// Redux action for Get Auth User List
export function getAuthUserList(payload = {}) {
    return action(GET_AUTH_USER_LIST, { payload })
}

// Redux action for Get Auth User List Success
export function getAuthUserListSuccess(data) {
    return action(GET_AUTH_USER_LIST_SUCCESS, { data })
}

// Redux action for Get Auth User List Failure
export function getAuthUserListFailure() {
    return action(GET_AUTH_USER_LIST_FAILURE)
}

// Redux action for Get Wallet Ledger List
export function getWalletLedgerList(payload = {}) {
    return action(GET_WALLET_LEDGER_LIST, { payload })
}

// Redux action for Get Wallet Ledger List Success
export function getWalletLedgerListSuccess(data) {
    return action(GET_WALLET_LEDGER_LIST_SUCCESS, { data })
}

// Redux action for Get Wallet Ledger List Failure
export function getWalletLedgerListFailure() {
    return action(GET_WALLET_LEDGER_LIST_FAILURE)
}