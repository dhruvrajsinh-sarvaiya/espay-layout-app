import {
    // Get Leader Config
    GET_LEADER_CONFIG,
    GET_LEADER_CONFIG_SUCCESS,
    GET_LEADER_CONFIG_FAILURE,

    // Get Social Profile Subscription
    GET_SOCIAL_PROFILE_SUBSCRIPTION,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE,

    // Social Profile Subscribe
    SOCIAL_PROFILE_SUBSCRIBE,
    SOCIAL_PROFILE_SUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_SUBSCRIBE_FAILURE,

    // Social Profile Unsubscribe
    SOCIAL_PROFILE_UNSUBSCRIBE,
    SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE,

    // Add Leader Config
    ADD_LEADER_CONFIG,
    ADD_LEADER_CONFIG_SUCCESS,
    ADD_LEADER_CONFIG_FAILURE,

    // Clear Leader Config
    CLEAR_LEADER_CONFIG,

    // Get Leader Follow By Id
    GET_LEADER_FOLLOW_BY_ID,
    GET_LEADER_FOLLOW_BY_ID_SUCCESS,
    GET_LEADER_FOLLOW_BY_ID_FAILURE,

    // Edit Follower Config
    EDIT_FOLLOWER_CONFIG,
    EDIT_FOLLOWER_CONFIG_SUCCESS,
    EDIT_FOLLOWER_CONFIG_FAILURE,

    // Get Leader List
    GET_LEADER_LIST,
    GET_LEADER_LIST_SUCCESS,
    GET_LEADER_LIST_FAILURE,

    // Unfollow Leader
    UNFOLLOW_LEADER,
    UNFOLLOW_LEADER_SUCCESS,
    UNFOLLOW_LEADER_FAILURE,

    // Clear Leader
    CLEAR_LEADER,

    // Clear Follower Config Data
    CLEAR_FOLLOWER_CONFIG_DATA,

    // Get Follower List
    GET_FOLLOWER_LIST,
    GET_FOLLOWER_LIST_SUCCESS,
    GET_FOLLOWER_LIST_FAILURE,

    // Get Group List
    GET_GROUP_LIST,
    GET_GROUP_LIST_SUCCESS,
    GET_GROUP_LIST_FAILURE,

    // Add New Watch List
    ADD_NEW_WATCH_LIST,
    ADD_NEW_WATCH_LIST_SUCCESS,
    ADD_NEW_WATCH_LIST_FAILURE,

    // Add To Watch List
    ADD_TO_WATCH_LIST,
    ADD_TO_WATCH_LIST_SUCCESS,
    ADD_TO_WATCH_LIST_FAILURE,

    // Remove From Watch List
    REMOVE_FROM_WATCH_LIST,
    REMOVE_FROM_WATCH_LIST_SUCCESS,
    REMOVE_FROM_WATCH_LIST_FAILURE,

    // Get Leader Watch List
    GET_LEADER_WATCH_LIST,
    GET_LEADER_WATCH_LIST_SUCCESS,
    GET_LEADER_WATCH_LIST_FAILURE,

    // Get Social Profile Top Gainer List
    GET_SOCIAL_PROFILE_TOP_GAINER_LIST,
    GET_SOCIAL_PROFILE_TOP_GAINER_LIST_SUCCESS,
    GET_SOCIAL_PROFILE_TOP_GAINER_LIST_FAILURE,

    // Get Social Profile Top Loser List
    GET_SOCIAL_PROFILE_TOP_LOSER_LIST,
    GET_SOCIAL_PROFILE_TOP_LOSER_LIST_SUCCESS,
    GET_SOCIAL_PROFILE_TOP_LOSER_LIST_FAILURE,

    // Get Social Profile Top Leader List
    GET_SOCIAL_PROFILE_TOP_LEADER_LIST,
    GET_SOCIAL_PROFILE_TOP_LEADER_LIST_SUCCESS,
    GET_SOCIAL_PROFILE_TOP_LEADER_LIST_FAILURE,

    // Get Leader Portfolio List
    GET_LEADER_PORTFOLIO_LIST,
    GET_LEADER_PORTFOLIO_LIST_SUCCESS,
    GET_LEADER_PORTFOLIO_LIST_FAILURE,

    // Get Historical Perform Chart
    GET_HISTORICAL_PERFORM_CHART,
    GET_HISTORICAL_PERFORM_CHART_SUCCESS,
    GET_HISTORICAL_PERFORM_CHART_FAILURE,
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux action to Get Group List
export function getGroupList() {
    return action(GET_GROUP_LIST)
}
// Redux action to Get Group List Success
export function getGroupListSuccess(data) {
    return action(GET_GROUP_LIST_SUCCESS, { data })
}
// Redux action to Get Group List Failure
export function getGroupListFailure() {
    return action(GET_GROUP_LIST_FAILURE)
}

// Redux action to Add New Watchlist
export function addNewWatchList(payload) {
    return action(ADD_NEW_WATCH_LIST, { payload })
}
// Redux action to Add New Watchlist Success
export function addNewWatchListSuccess(data) {
    return action(ADD_NEW_WATCH_LIST_SUCCESS, { data })
}
// Redux action to Add New Watchlist Failure
export function addNewWatchListFailure() {
    return action(ADD_NEW_WATCH_LIST_FAILURE)
}

// Redux action to Add to Watchlist
export function addToWatchList(payload) {
    return action(ADD_TO_WATCH_LIST, { payload })
}
// Redux action to Add to Watchlist Success
export function addToWatchListSuccess(data) {
    return action(ADD_TO_WATCH_LIST_SUCCESS, { data })
}
// Redux action to Add to Watchlist Failure
export function addToWatchListFailure() {
    return action(ADD_TO_WATCH_LIST_FAILURE)
}

// Redux action to Remove From Watchlist
export function removeFromWatchList(payload) {
    return action(REMOVE_FROM_WATCH_LIST, { payload })
}
// Redux action to Remove From Watchlist Success
export function removeFromWatchListSuccess(data) {
    return action(REMOVE_FROM_WATCH_LIST_SUCCESS, { data })
}
// Redux action to Remove From Watchlist Failure
export function removeFromWatchListFailure() {
    return action(REMOVE_FROM_WATCH_LIST_FAILURE)
}


// Redux action to Get Social Profile Subscription
export function getSocialProfileSubscription() {
    return action(GET_SOCIAL_PROFILE_SUBSCRIPTION)
}
// Redux action to Get Social Profile Subscription Success
export function getSocialProfileSubscriptionSuccess(data) {
    return action(GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS, { data })
}
// Redux action to Get Social Profile Subscription Failure
export function getSocialProfileSubscriptionFailure() {
    return action(GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE)
}

// Redux action to Get Social Profile Subscribe
export function getSocialProfileSubscribe(payload) {
    return action(SOCIAL_PROFILE_SUBSCRIBE, { payload })
}
// Redux action to Get Social Profile Subscribe Success
export function getSocialProfileSubscribeSuccess(data) {
    return action(SOCIAL_PROFILE_SUBSCRIBE_SUCCESS, { data })
}
// Redux action to Get Social Profile Subscribe Failure
export function getSocialProfileSubscribeFailure() {
    return action(SOCIAL_PROFILE_SUBSCRIBE_FAILURE)
}

// Redux action to Get Social Profile Unsubscribe
export function getSocialProfileUnSubscribe(payload) {
    return action(SOCIAL_PROFILE_UNSUBSCRIBE, { payload })
}
// Redux action to Get Social Profile Unsubscribe Success
export function getSocialProfileUnSubscribeSuccess(data) {
    return action(SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS, { data })
}
// Redux action to Get Social Profile Unsubscribe Failure
export function getSocialProfileUnSubscribeFailure() {
    return action(SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE)
}

// Redux action to Add Leader Config
export function addLeaderConfig(payload) {
    return action(ADD_LEADER_CONFIG, { payload })
}
// Redux action to Add Leader Config Success
export function addLeaderConfigSuccess(data) {
    return action(ADD_LEADER_CONFIG_SUCCESS, { data })
}
// Redux action to Add Leader Config Failure
export function addLeaderConfigFailure() {
    return action(ADD_LEADER_CONFIG_FAILURE)
}

// Redux action to clear LeaderConfig
export function clearLeaderConfig() {
    return action(CLEAR_LEADER_CONFIG)
}

// Redux action to Get Leader Follow By Id
export function getLeaderFollowById(payload) {
    return action(GET_LEADER_FOLLOW_BY_ID, { payload })
}
// Redux action to Get Leader Follow By Id Success
export function getLeaderFollowByIdSuccess(data) {
    return action(GET_LEADER_FOLLOW_BY_ID_SUCCESS, { data })
}
// Redux action to Get Leader Follow By Id Failure
export function getLeaderFollowByIdFailure() {
    return action(GET_LEADER_FOLLOW_BY_ID_FAILURE)
}

// Redux action to Edit Follower Config
export function editFollowerConfig(payload) {
    return action(EDIT_FOLLOWER_CONFIG, { payload })
}
// Redux action to Edit Follower Config Success
export function editFollowerConfigSuccess(data) {
    return action(EDIT_FOLLOWER_CONFIG_SUCCESS, { data })
}
// Redux action to Edit Follower Config Failure
export function editFollowerConfigFailure() {
    return action(EDIT_FOLLOWER_CONFIG_FAILURE)
}

// Redux action to Get Leader List
export function getLeaderList(payload) {
    return action(GET_LEADER_LIST, { payload })
}
// Redux action to Get Leader List Success
export function getLeaderListSuccess(data) {
    return action(GET_LEADER_LIST_SUCCESS, { data })
}
// Redux action to Get Leader List Failure
export function getLeaderListFailure() {
    return action(GET_LEADER_LIST_FAILURE)
}

// Redux action to Unfollow Leader
export function unFollowLeader(payload) {
    return action(UNFOLLOW_LEADER, { payload })
}
// Redux action to Unfollow Leader Success
export function unFollowLeaderSuccess(data) {
    return action(UNFOLLOW_LEADER_SUCCESS, { data })
}
// Redux action to Unfollow Leader Failure
export function unFollowLeaderFailure() {
    return action(UNFOLLOW_LEADER_FAILURE)
}

// Redux action to Get Leader Config
export function getLeaderConfig(data) {
    return action(GET_LEADER_CONFIG, { data })
}
// Redux action to Get Leader Config Success
export function getLeaderConfigSuccess(data) {
    return action(GET_LEADER_CONFIG_SUCCESS, { data })
}
// Redux action to Get Leader Config Failure
export function getLeaderConfigFailure() {
    return action(GET_LEADER_CONFIG_FAILURE)
}

// Redux action to Clear Leader
export function clearLeader() {
    return action(CLEAR_LEADER)
}

// Redux action to Clear Follower Config
export function clearFollowerConfig() {
    return action(CLEAR_FOLLOWER_CONFIG_DATA)
}

// Redux Action To Get Follower List
export function getFollowerList(payload) {
    return action(GET_FOLLOWER_LIST, { payload })
}

// Redux Action Get Follower List Success
export function getFollowerListSuccess(data) {
    return action(GET_FOLLOWER_LIST_SUCCESS, { data })
}

// Redux Action Get Follower List Failure
export function getFollowerListFailure() {
    return action(GET_FOLLOWER_LIST_FAILURE)
}

// Redux Action To Get Leader Watchlist
export function getLeaderWatchlist(payload) {
    return action(GET_LEADER_WATCH_LIST, { payload })
}

// Redux Action Get Leader Watchlist Success
export function getLeaderWatchlistSuccess(data) {
    return action(GET_LEADER_WATCH_LIST_SUCCESS, { data })
}

//Action Get Leader Watchlist Failure
export function getLeaderWatchlistFailure() {
    return action(GET_LEADER_WATCH_LIST_FAILURE)
}

// Redux Action for Top Gainer List
export function getSocialProfileTopGainerList(payload) {
    return action(GET_SOCIAL_PROFILE_TOP_GAINER_LIST, { payload })
}

// Redux Action for Top Gainer List Success
export function getSocialProfileTopGainerListSuccess(data) {
    return action(GET_SOCIAL_PROFILE_TOP_GAINER_LIST_SUCCESS, { data })
}

// Redux Action for Top Gainer List Failure
export function getSocialProfileTopGainerListFailure() {
    return action(GET_SOCIAL_PROFILE_TOP_GAINER_LIST_FAILURE)
}

// Redux Action for Top Loser List
export function getSocialProfileTopLoserList(payload) {
    return action(GET_SOCIAL_PROFILE_TOP_LOSER_LIST, { payload })
}

// Redux Action for Top Loser List Success
export function getSocialProfileTopLoserListSuccess(data) {
    return action(GET_SOCIAL_PROFILE_TOP_LOSER_LIST_SUCCESS, { data })
}

// Redux Action for Top Loser List Failure
export function getSocialProfileTopLoserListFailure() {
    return action(GET_SOCIAL_PROFILE_TOP_LOSER_LIST_FAILURE)
}

// Redux Action for Top Leader List
export function getSocialProfileTopLeaderList() {
    return action(GET_SOCIAL_PROFILE_TOP_LEADER_LIST)
}

// Redux Action for Top Leader List Success
export function getSocialProfileTopLeaderListSuccess(data) {
    return action(GET_SOCIAL_PROFILE_TOP_LEADER_LIST_SUCCESS, { data })
}

// Redux Action for Top Leader List Failure
export function getSocialProfileTopLeaderListFailure() {
    return action(GET_SOCIAL_PROFILE_TOP_LEADER_LIST_FAILURE)
}

//  Redux Action To Get Leader Portfolio List
export function getLeaderPortfolioList(data) {
    return action(GET_LEADER_PORTFOLIO_LIST, { data })
}

//Redux Action To Get Leader Portfolio List Success
export function getLeaderPortfolioListSuccess(data) {
    return action(GET_LEADER_PORTFOLIO_LIST_SUCCESS, { data })
}

//Redux Action To Get Leader Portfolio List Failure
export function getLeaderPortfolioListFailure() {
    return action(GET_LEADER_PORTFOLIO_LIST_FAILURE)
}

// Redux Action for Historical Performance Chart
export function getHistoricalPerformChart(payload) {
    return action(GET_HISTORICAL_PERFORM_CHART, { payload })
}

// Redux Action for Historical Performance Chart Success
export function getHistoricalPerformChartSuccess(data) {
    return action(GET_HISTORICAL_PERFORM_CHART_SUCCESS, { data })
}

// Redux Action for Historical Performance Chart Failure
export function getHistoricalPerformChartFailure() {
    return action(GET_HISTORICAL_PERFORM_CHART_FAILURE)
}