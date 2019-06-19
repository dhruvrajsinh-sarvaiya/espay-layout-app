/**
 * Auther : Kevin Ladani
 * Created : 19/12/2018
 * UpdatedBy : Salim Deraiya 24/12/2018
 * Social Profile Actions
 */

import {
    //Get Leader Config
    GET_LEADER_CONFIG,
    GET_LEADER_CONFIG_SUCCESS,
    GET_LEADER_CONFIG_FAILURE,

    //Edit Leader Config
    EDIT_LEADER_CONFIG,
    EDIT_LEADER_CONFIG_SUCCESS,
    EDIT_LEADER_CONFIG_FAILURE,

    //Get Follower Config
    GET_FOLLOWER_CONFIG,
    GET_FOLLOWER_CONFIG_SUCCESS,
    GET_FOLLOWER_CONFIG_FAILURE,

    //Edit Follower Config
    EDIT_FOLLOWER_CONFIG,
    EDIT_FOLLOWER_CONFIG_SUCCESS,
    EDIT_FOLLOWER_CONFIG_FAILURE,

    //Get Social Profile Subscription
    GET_SOCIAL_PROFILE_SUBSCRIPTION,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE,

    //Social Profile Subscribe
    SOCIAL_PROFILE_SUBSCRIBE,
    SOCIAL_PROFILE_SUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_SUBSCRIBE_FAILURE,

    //Social Profile UnSubscribe
    SOCIAL_PROFILE_UNSUBSCRIBE,
    SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE,

    //Get Leader List
    GET_LEADER_LIST,
    GET_LEADER_LIST_SUCCESS,
    GET_LEADER_LIST_FAILURE,

    //Get Follower List
    GET_FOLLOWER_LIST,
    GET_FOLLOWER_LIST_SUCCESS,
    GET_FOLLOWER_LIST_FAILURE,

    //Get Leader Follow By ID
    GET_LEADER_FOLLOW_BY_ID,
    GET_LEADER_FOLLOW_BY_ID_SUCCESS,
    GET_LEADER_FOLLOW_BY_ID_FAILURE,

    //Unfollow Leader
    UNFOLLOW_LEADER,
    UNFOLLOW_LEADER_SUCCESS,
    UNFOLLOW_LEADER_FAILURE,

    //Add Watchlist Group
    ADD_WATCHLIST_GROUP,
    ADD_WATCHLIST_GROUP_SUCCESS,
    ADD_WATCHLIST_GROUP_FAILURE,

    //Add Watchlist
    ADD_WATCHLIST,
    ADD_WATCHLIST_SUCCESS,
    ADD_WATCHLIST_FAILURE,

    //Remove Watchlist
    REMOVE_WATCHLIST,
    REMOVE_WATCHLIST_SUCCESS,
    REMOVE_WATCHLIST_FAILURE,

    //Get Watchlist
    GET_WATCHLIST,
    GET_WATCHLIST_SUCCESS,
    GET_WATCHLIST_FAILURE,
    
    //Get Leader watchlist
    GET_LEADER_WATCH_LIST,
    GET_LEADER_WATCH_LIST_SUCCESS,
    GET_LEADER_WATCH_LIST_FAILURE,
} from '../types';

/**
 * Redux Action To Get Leader Configuration
 */
export const getLeaderConfig = (data) => ({
    type: GET_LEADER_CONFIG,
    payload: data
});

/**
 * Redux Action Get LeaderConfig Success
 */
export const getLeaderConfigSuccess = (data) => ({
    type: GET_LEADER_CONFIG_SUCCESS,
    payload: data
});

/**
 * Redux Action Get LeaderConfig Failure
 */
export const getLeaderConfigFailure = (error) => ({
    type: GET_LEADER_CONFIG_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Leader Configuration
 */
export const editLeaderConfig = (data) => ({
    type: EDIT_LEADER_CONFIG,
    payload: data
});

/**
 * Redux Action Edit LeaderConfig Success
 */
export const editLeaderConfigSuccess = (data) => ({
    type: EDIT_LEADER_CONFIG_SUCCESS,
    payload: data
});

/**
 * Redux Action Edit LeaderConfig Failure
 */
export const editLeaderConfigFailure = (error) => ({
    type: EDIT_LEADER_CONFIG_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Follower Configuration
 */
export const getFollowerConfig = (data) => ({
    type: GET_FOLLOWER_CONFIG,
    payload: data
});

/**
 * Redux Action Get FollowerConfig Success
 */
export const getFollowerConfigSuccess = (data) => ({
    type: GET_FOLLOWER_CONFIG_SUCCESS,
    payload: data
});

/**
 * Redux Action Get FollowerConfig Failure
 */
export const getFollowerConfigFailure = (error) => ({
    type: GET_FOLLOWER_CONFIG_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Follower Configuration
 */
export const editFollowerConfig = (data) => ({
    type: EDIT_FOLLOWER_CONFIG,
    payload: data
});

/**
 * Redux Action Edit FollowerConfig Success
 */
export const editFollowerConfigSuccess = (data) => ({
    type: EDIT_FOLLOWER_CONFIG_SUCCESS,
    payload: data
});

/**
 * Redux Action Edit FollowerConfig Failure
 */
export const editFollowerConfigFailure = (error) => ({
    type: EDIT_FOLLOWER_CONFIG_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Social Profile Subscription
 */
export const getSocialProfileSubscription = () => ({
    type: GET_SOCIAL_PROFILE_SUBSCRIPTION
});

/**
 * Redux Action Get Social Profile Subscription Success
 */
export const getSocialProfileSubscriptionSuccess = (data) => ({
    type: GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Social Profile Subscription Failure
 */
export const getSocialProfileSubscriptionFailure = (error) => ({
    type: GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Social Profile Subscribe
 */
export const getSocialProfileSubscribe = (data) => ({
    type: SOCIAL_PROFILE_SUBSCRIBE,
    payload : data
});

/**
 * Redux Action Get Social Profile Subscribe Success
 */
export const getSocialProfileSubscribeSuccess = (data) => ({
    type: SOCIAL_PROFILE_SUBSCRIBE_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Social Profile Subscribe Failure
 */
export const getSocialProfileSubscribeFailure = (error) => ({
    type: SOCIAL_PROFILE_SUBSCRIBE_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Social Profile UnSubscribe
 */
export const getSocialProfileUnSubscribe = (data) => ({
    type: SOCIAL_PROFILE_UNSUBSCRIBE,
    payload : data
});

/**
 * Redux Action Get Social Profile UnSubscribe Success
 */
export const getSocialProfileUnSubscribeSuccess = (data) => ({
    type: SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Social Profile UnSubscribe Failure
 */
export const getSocialProfileUnSubscribeFailure = (error) => ({
    type: SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Leader List
 */
export const getLeaderList = (data) => ({
    type: GET_LEADER_LIST,
    payload : data
});

/**
 * Redux Action Get Leader List Success
 */
export const getLeaderListSuccess = (data) => ({
    type: GET_LEADER_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Leader List Failure
 */
export const getLeaderListFailure = (error) => ({
    type: GET_LEADER_LIST_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Follower List
 */
export const getFollowerList = (data) => ({
    type: GET_FOLLOWER_LIST,
    payload : data
});

/**
 * Redux Action Get Follower List Success
 */
export const getFollowerListSuccess = (data) => ({
    type: GET_FOLLOWER_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Follower List Failure
 */
export const getFollowerListFailure = (error) => ({
    type: GET_FOLLOWER_LIST_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Leader Follow By ID
 */
export const getLeaderFollowById = (data) => ({
    type: GET_LEADER_FOLLOW_BY_ID,
    payload : data
});

/**
 * Redux Action Get Leader Follow By ID Success
 */
export const getLeaderFollowByIdSuccess = (data) => ({
    type: GET_LEADER_FOLLOW_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Leader Follow By ID Failure
 */
export const getLeaderFollowByIdFailure = (error) => ({
    type: GET_LEADER_FOLLOW_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Unfollow Leader
 */
export const unFollowLeader = (data) => ({
    type: UNFOLLOW_LEADER,
    payload : data
});

/**
 * Redux Action Unfollow Leader Success
 */
export const unFollowLeaderSuccess = (data) => ({
    type: UNFOLLOW_LEADER_SUCCESS,
    payload: data
});

/**
 * Redux Action Unfollow Leader Failure
 */
export const unFollowLeaderFailure = (error) => ({
    type: UNFOLLOW_LEADER_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Watchlist
 */
export const getWatchlist = () => ({
    type: GET_WATCHLIST
});

/**
 * Redux Action Get Watchlist Success
 */
export const getWatchlistSuccess = (data) => ({
    type: GET_WATCHLIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Watchlist Failure
 */
export const getWatchlistFailure = (error) => ({
    type: GET_WATCHLIST_FAILURE,
    payload: error
});

/**
 * Redux Action To Add Watchlist Group
 */
export const addWatchlistGroup = (data) => ({
    type: ADD_WATCHLIST_GROUP,
    payload: data
});

/**
 * Redux Action Add Watchlist Group Success
 */
export const addWatchlistGroupSuccess = (data) => ({
    type: ADD_WATCHLIST_GROUP_SUCCESS,
    payload: data
});

/**
 * Redux Action Add Watchlist Group Failure
 */
export const addWatchlistGroupFailure = (error) => ({
    type: ADD_WATCHLIST_GROUP_FAILURE,
    payload: error
});

/**
 * Redux Action To Add Watchlist
 */
export const addWatchlist = (data) => ({
    type: ADD_WATCHLIST,
    payload: data
});

/**
 * Redux Action Add Watchlist Success
 */
export const addWatchlistSuccess = (data) => ({
    type: ADD_WATCHLIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Add Watchlist Failure
 */
export const addWatchlistFailure = (error) => ({
    type: ADD_WATCHLIST_FAILURE,
    payload: error
});

/**
 * Redux Action To Remove Watchlist
 */
export const removeWatchlist = (data) => ({
    type: REMOVE_WATCHLIST,
    payload: data
});

/**
 * Redux Action Remove Watchlist Success
 */
export const removeWatchlistSuccess = (data) => ({
    type: REMOVE_WATCHLIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Remove Watchlist Failure
 */
export const removeWatchlistFailure = (error) => ({
    type: REMOVE_WATCHLIST_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Leader Watchlist
 */
export const getLeaderWatchlist = (data) => ({
    type: GET_LEADER_WATCH_LIST,
    payload: data
});

/**
 * Redux Action Get Leader Watchlist Success
 */
export const getLeaderWatchlistSuccess = (data) => ({
    type: GET_LEADER_WATCH_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Leader Watchlist Failure
 */
export const getLeaderWatchlistFailure = (error) => ({
    type: GET_LEADER_WATCH_LIST_FAILURE,
    payload: error
});