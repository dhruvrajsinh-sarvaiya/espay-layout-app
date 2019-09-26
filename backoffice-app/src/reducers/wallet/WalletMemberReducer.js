import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Wallet Member List
    GET_WALLET_MEMBER_LIST,
    GET_WALLET_MEMBER_LIST_SUCCESS,
    GET_WALLET_MEMBER_LIST_FAILURE,

    // Clear Wallet Member Data
    CLEAR_WALLET_MEMBER_DATA
} from "../../actions/ActionTypes";

// Initial State for Wallet Member
const INITIAL_STATE = {
    // for Wallet Member List
    WalletMemberList: null,
    WalletMemberLoading: false,
    WalletMemberError: false,
}

export default function WalletMemberReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Wallet Member List method data
        case GET_WALLET_MEMBER_LIST:
            return Object.assign({}, state, {
                WalletMemberList: null,
                WalletMemberLoading: true
            })
        // Set Wallet Member List success data
        case GET_WALLET_MEMBER_LIST_SUCCESS:
            return Object.assign({}, state, {
                WalletMemberList: action.data,
                WalletMemberLoading: false,
            })
        // Set Wallet Member List failure data
        case GET_WALLET_MEMBER_LIST_FAILURE:
            return Object.assign({}, state, {
                WalletMemberList: null,
                WalletMemberLoading: false,
                WalletMemberError: true
            })

        // Clear Wallet Member method data
        case CLEAR_WALLET_MEMBER_DATA:
            return Object.assign({}, state, {
                WalletMemberList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}