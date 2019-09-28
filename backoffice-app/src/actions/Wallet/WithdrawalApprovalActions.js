import {
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
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Withdrawal Approval List
export function getWithdrawalApprovalList(payload = {}) {
    return action(GET_WITHDRAWAL_APPROVAL_LIST, { payload })
}

// Redux action for Get Withdrawal Approval List Success
export function getWithdrawalApprovalListSuccess(data) {
    return action(GET_WITHDRAWAL_APPROVAL_LIST_SUCCESS, { data })
}

// Redux action for Get Withdrawal Approval List Failure
export function getWithdrawalApprovalListFailure() {
    return action(GET_WITHDRAWAL_APPROVAL_LIST_FAILURE)
}

// Redux action for Accept Reject Withdrawal Request
export function acceptRejectWithdrawalReq(payload = {}) {
    return action(ACCEPT_REJECT_WITHDRAWAL_REQ, { payload })
}

// Redux action for Accept Reject Withdrawal Request Success
export function acceptRejectWithdrawalReqSuccess(data) {
    return action(ACCEPT_REJECT_WITHDRAWAL_REQ_SUCCESS, { data })
}

// Redux action for Accept Reject Withdrawal Request Failure
export function acceptRejectWithdrawalReqFailure() {
    return action(ACCEPT_REJECT_WITHDRAWAL_REQ_FAILURE)
}

// Redux action for Clear Withdrawal Approval Data
export function clearWithdrawalApprovalData() {
    return action(CLEAR_WITHDRAWAL_APPROVAL_DATA)
}