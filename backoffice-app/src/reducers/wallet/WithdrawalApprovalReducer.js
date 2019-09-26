import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Withdrawal Approval List
    GET_WITHDRAWAL_APPROVAL_LIST,
    GET_WITHDRAWAL_APPROVAL_LIST_SUCCESS,
    GET_WITHDRAWAL_APPROVAL_LIST_FAILURE,

    // Clear Withdrawal Approval Data
    CLEAR_WITHDRAWAL_APPROVAL_DATA,

    // Accept Reject Withdrawal Request
    ACCEPT_REJECT_WITHDRAWAL_REQ,
    ACCEPT_REJECT_WITHDRAWAL_REQ_SUCCESS,
    ACCEPT_REJECT_WITHDRAWAL_REQ_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Withdrawal Approval
const INITIAL_STATE = {
    // Withdrawal Approval List
    WithdrawalApprovalList: null,
    WithdrawalApprovalLoading: false,
    WithdrawalApprovalError: false,

    // Accept Reject Withdrawal Request
    AcceptRejWithdrawReq: null,
    AcceptRejWithdrawReqLoading: false,
    AcceptRejWithdrawReqError: false,
}

export default function WithdrawalApprovalReducer(state, action) {

    // If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Withdrawal Approval List method data
        case GET_WITHDRAWAL_APPROVAL_LIST:
            return Object.assign({}, state, {
                WithdrawalApprovalList: null,
                WithdrawalApprovalLoading: true
            })
        // Set Withdrawal Approval List success data
        case GET_WITHDRAWAL_APPROVAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                WithdrawalApprovalList: action.data,
                WithdrawalApprovalLoading: false,
            })
        // Set Withdrawal Approval List failure data
        case GET_WITHDRAWAL_APPROVAL_LIST_FAILURE:
            return Object.assign({}, state, {
                WithdrawalApprovalList: null,
                WithdrawalApprovalLoading: false,
                WithdrawalApprovalError: true
            })

        // Handle Accept Reject Withdrawal Request method data
        case ACCEPT_REJECT_WITHDRAWAL_REQ:
            return Object.assign({}, state, {
                AcceptRejWithdrawReq: null,
                AcceptRejWithdrawReqLoading: true
            })
        // Set Accept Reject Withdrawal Request success data
        case ACCEPT_REJECT_WITHDRAWAL_REQ_SUCCESS:
            return Object.assign({}, state, {
                AcceptRejWithdrawReq: action.data,
                AcceptRejWithdrawReqLoading: false,
            })
        // Set Accept Reject Withdrawal Request failure data
        case ACCEPT_REJECT_WITHDRAWAL_REQ_FAILURE:
            return Object.assign({}, state, {
                AcceptRejWithdrawReq: null,
                AcceptRejWithdrawReqLoading: false,
                AcceptRejWithdrawReqError: true
            })

        // Handle Clear Withdrawal Approval method data
        case CLEAR_WITHDRAWAL_APPROVAL_DATA:
            return Object.assign({}, state, {
                WithdrawalApprovalList: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
