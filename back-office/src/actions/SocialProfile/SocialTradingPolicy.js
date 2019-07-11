/**
 * Auther : Kevin Ladani
 * Created : 19/12/2018
 * UpdatedBy : Salim Deraiya 22/12/2018
 * Social Trading Policy Actions
 */

import {
    //Leader Trading Policy
    GET_LEADER_TRADING_POLICY,
    GET_LEADER_TRADING_POLICY_SUCCESS,
    GET_LEADER_TRADING_POLICY_FAILURE,
    EDIT_LEADER_TRADING_POLICY,
    EDIT_LEADER_TRADING_POLICY_SUCCESS,
    EDIT_LEADER_TRADING_POLICY_FAILURE,

    //Edit Follower Trading Policy
    GET_FOLLOWER_TRADING_POLICY,
    GET_FOLLOWER_TRADING_POLICY_SUCCESS,
    GET_FOLLOWER_TRADING_POLICY_FAILURE,
    EDIT_FOLLOWER_TRADING_POLICY,
    EDIT_FOLLOWER_TRADING_POLICY_SUCCESS,
    EDIT_FOLLOWER_TRADING_POLICY_FAILURE,
} from '../types';


/**
 * Redux Action To Get Leader Trading Policy
 */
export const getLeaderTradingPolicy = () => ({
    type: GET_LEADER_TRADING_POLICY
});

/**
 * Redux Action Get Leader Trading Policy Success
 */
export const getLeaderTradingPolicySuccess = (data) => ({
    type: GET_LEADER_TRADING_POLICY_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Leader Trading Policy Failure
 */
export const getLeaderTradingPolicyFailure = (error) => ({
    type: GET_LEADER_TRADING_POLICY_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Leader Trading Policy
 */
export const editLeaderTradingPolicy = (data) => ({
    type: EDIT_LEADER_TRADING_POLICY,
    payload: data
});

/**
 * Redux Action Edit Leader Trading Policy Success
 */
export const editLeaderTradingPolicySuccess = (data) => ({
    type: EDIT_LEADER_TRADING_POLICY_SUCCESS,
    payload: data
});

/**
 * Redux Action Edit Leader Trading Policy Failure
 */
export const editLeaderTradingPolicyFailure = (error) => ({
    type: EDIT_LEADER_TRADING_POLICY_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Follower Trading Policy
 */
export const getFollowerTradingPolicy = () => ({
    type: GET_FOLLOWER_TRADING_POLICY
});

/**
 * Redux Action Get Follower Trading Policy Success
 */
export const getFollowerTradingPolicySuccess = (data) => ({
    type: GET_FOLLOWER_TRADING_POLICY_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Follower Trading Policy Failure
 */
export const getFollowerTradingPolicyFailure = (error) => ({
    type: GET_FOLLOWER_TRADING_POLICY_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Follower Trading Policy
 */
export const editFollowerTradingPolicy = (data) => ({
    type: EDIT_FOLLOWER_TRADING_POLICY,
    payload: data
});

/**
 * Redux Action Edit Follower Trading Policy Success
 */
export const editFollowerTradingPolicySuccess = (data) => ({
    type: EDIT_FOLLOWER_TRADING_POLICY_SUCCESS,
    payload: data
});

/**
 * Redux Action Edit Follower Trading Policy Failure
 */
export const editFollowerTradingPolicyFailure = (error) => ({
    type: EDIT_FOLLOWER_TRADING_POLICY_FAILURE,
    payload: error
});