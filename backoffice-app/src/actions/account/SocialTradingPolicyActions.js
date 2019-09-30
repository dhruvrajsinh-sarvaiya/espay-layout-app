import { action } from "../GlobalActions";
import {
    GET_LEADER_TRADING_POLICY,
    GET_LEADER_TRADING_POLICY_SUCCESS,
    GET_LEADER_TRADING_POLICY_FAILURE,
    GET_FOLLOWER_TRADING_POLICY,
    GET_FOLLOWER_TRADING_POLICY_SUCCESS,
    GET_FOLLOWER_TRADING_POLICY_FAILURE,
    EDIT_FOLLOWER_TRADING_POLICY,
    EDIT_FOLLOWER_TRADING_POLICY_SUCCESS,
    EDIT_FOLLOWER_TRADING_POLICY_FAILURE,
    EDIT_LEADER_TRADING_POLICY,
    EDIT_LEADER_TRADING_POLICY_SUCCESS,
    EDIT_LEADER_TRADING_POLICY_FAILURE,
    CLEAR_LEDGER_FOLLOWER_DATA
} from "../ActionTypes";

// Action for Leader Trading Policy
export function getLeaderTradingPolicy() {
    // for loading
    return action(GET_LEADER_TRADING_POLICY)
}
export function getLeaderTradingPolicySuccess(data) {
    // for success call
    return action(GET_LEADER_TRADING_POLICY_SUCCESS, { data })
}
export function getLeaderTradingPolicyFailure() {
    // for failure call
    return action(GET_LEADER_TRADING_POLICY_FAILURE)
}

// Action for Edit Leader Trading Policy
export function editLeaderTradingPolicy(payload) {
    // for loading
    return action(EDIT_LEADER_TRADING_POLICY, { payload })
}
export function editLeaderTradingPolicySuccess(data) {
    // for success call
    return action(EDIT_LEADER_TRADING_POLICY_SUCCESS, { data })
}
export function editLeaderTradingPolicyFailure() {
    // for failure call
    return action(EDIT_LEADER_TRADING_POLICY_FAILURE)
}

// Action for Follower Trading Policy
export function getFollowerTradingPolicy() {
    // for loading
    return action(GET_FOLLOWER_TRADING_POLICY)
}
export function getFollowerTradingPolicySuccess(data) {
    // for success call
    return action(GET_FOLLOWER_TRADING_POLICY_SUCCESS, { data })
}
export function getFollowerTradingPolicyFailure() {
    // for failure call
    return action(GET_FOLLOWER_TRADING_POLICY_FAILURE)
}

// Action for Edit Follower Trading Policy
export function editFollowerTradingPolicy(payload) {
    // for loading
    return action(EDIT_FOLLOWER_TRADING_POLICY, { payload })
}
export function editFollowerTradingPolicySuccess(data) {
    // for success call
    return action(EDIT_FOLLOWER_TRADING_POLICY_SUCCESS, { data })
}
export function editFollowerTradingPolicyFailure() {
    // for failure call
    return action(EDIT_FOLLOWER_TRADING_POLICY_FAILURE)
}

// Clear Ledger and Follower Trading Data
export function clearLedgerFollowerData() {
    // for clear call
    return action(CLEAR_LEDGER_FOLLOWER_DATA)
}