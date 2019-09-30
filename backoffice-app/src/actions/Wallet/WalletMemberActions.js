import {
    // Get Wallet Member List
    GET_WALLET_MEMBER_LIST,
    GET_WALLET_MEMBER_LIST_SUCCESS,
    GET_WALLET_MEMBER_LIST_FAILURE,

    // Clear Wallet Member Data
    CLEAR_WALLET_MEMBER_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Wallet Member List
export function getWalletMemberList(payload = {}) {
    return action(GET_WALLET_MEMBER_LIST, { payload })
}

// Redux action for Get Wallet Member List Success
export function getWalletMemberListSuccess(data) {
    return action(GET_WALLET_MEMBER_LIST_SUCCESS, { data })
}

// Redux action for Get Wallet Member List Failure
export function getWalletMemberListFailure() {
    return action(GET_WALLET_MEMBER_LIST_FAILURE)
}

// Redux action for Clear Wallet Member Data
export function clearWalletMemberData() {
    return action(CLEAR_WALLET_MEMBER_DATA)
}