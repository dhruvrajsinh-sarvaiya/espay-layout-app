// Action types for Social Profile Module
import {
    // Get Leader Config
    GET_LEADER_CONFIG,
    GET_LEADER_CONFIG_SUCCESS,
    GET_LEADER_CONFIG_FAILURE,

    // Get Social Profile Subscription
    GET_SOCIAL_PROFILE_SUBSCRIPTION,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS,
    GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Social Profile Subscribe
    SOCIAL_PROFILE_SUBSCRIBE,
    SOCIAL_PROFILE_SUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_SUBSCRIBE_FAILURE,

    // Social Profile Unsubscribe
    SOCIAL_PROFILE_UNSUBSCRIBE,
    SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS,
    SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE,

    // Add Leader Configuration
    ADD_LEADER_CONFIG,
    ADD_LEADER_CONFIG_SUCCESS,
    ADD_LEADER_CONFIG_FAILURE,

    // Clear Leader Configuration
    CLEAR_LEADER_CONFIG,

    // Get Leader Follow by Id
    GET_LEADER_FOLLOW_BY_ID,
    GET_LEADER_FOLLOW_BY_ID_SUCCESS,
    GET_LEADER_FOLLOW_BY_ID_FAILURE,

    // Edit Follower Configuration
    EDIT_FOLLOWER_CONFIG,
    EDIT_FOLLOWER_CONFIG_SUCCESS,
    EDIT_FOLLOWER_CONFIG_FAILURE,

    // Get Leadet List
    GET_LEADER_LIST,
    GET_LEADER_LIST_SUCCESS,
    GET_LEADER_LIST_FAILURE,

    // Unfollow Leader
    UNFOLLOW_LEADER,
    UNFOLLOW_LEADER_SUCCESS,
    UNFOLLOW_LEADER_FAILURE,

    // Clear Leader
    CLEAR_LEADER,

    // Get Follower List
    GET_FOLLOWER_LIST,
    GET_FOLLOWER_LIST_SUCCESS,
    GET_FOLLOWER_LIST_FAILURE,

    // Clear Follower Configuration Data
    CLEAR_FOLLOWER_CONFIG_DATA,

    // Get Group List
    GET_GROUP_LIST,
    GET_GROUP_LIST_SUCCESS,
    GET_GROUP_LIST_FAILURE,

    // Add New Watch List
    ADD_NEW_WATCH_LIST,
    ADD_NEW_WATCH_LIST_SUCCESS,
    ADD_NEW_WATCH_LIST_FAILURE,

    // Add to Watch List
    ADD_TO_WATCH_LIST,
    ADD_TO_WATCH_LIST_SUCCESS,
    ADD_TO_WATCH_LIST_FAILURE,

    // Remove from Watch List
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
} from "../actions/ActionTypes";

// Initial state for Social Profile
const initialState = {

    /* For Social Profile Subscription */
    SocialProfileSubscriptionData: null,
    SocialProfileSubscriptionLoading: false,
    SocialProfileSubscriptionError: false,

    /* For Social Profile Subscribe */
    SocialProfileSubscribeData: null,
    SocialProfileSubscribeLoading: false,
    SocialProfileSubscribeError: false,

    /* For Social Profile UnSubscribe */
    SocialProfileUnSubscribeData: null,
    SocialProfileUnSubscribeLoading: false,
    SocialProfileUnSubscribeError: false,

    /* For Add Leader Configuration */
    AddLeaderConfigData: null,
    AddLeaderConfigLoading: false,
    AddLeaderConfigError: false,

    // For Leader Follow By Id
    LeaderFollowByIdData: null,
    LeaderFollowByIdLoading: false,
    LeaderFollowByIdError: false,

    // For Edit Follower Configuration
    EditFollowerConfigData: null,
    EditFollowerConfigLoading: false,
    EditFollowerConfigError: false,

    // For Leader List
    getLeaderList: null,
    Loading: false,

    // For UnFollow Leader
    unfollowData: null,
    isUnFollow: false,

    // For get leader Configuration
    leaderConfigData: null,
    leaderConfigLoading: false,
    LeaderConfigError: false,

    // For followerlist
    getFollowerList: null,
    followerLoading: false,

    // For Group list
    groupListData: null,
    groupListLoading: false,
    groupListError: false,

    // For New Watch List
    addWatchListItemData: null,
    addWatchListItemLoading: false,
    addWatchListItemError: false,

    // For Add to watch list
    addToWatchList: null,
    addToWatchLoading: false,
    addToWatchError: false,

    // For removing watch from list
    removeFromWatchList: null,
    removeFromWatchLoading: false,
    removeFromWatchError: false,

    // For My Watcher List
    getLeaderWatchlist: null,
    leaderWatcherLoading: false,

    // Social Profile Top Gainer
    topGainerList: null,
    topGainerLoading: false,
    topGainerError: false,

    // Social Profile Top Loser
    topLoserList: null,
    topLoserLoading: false,
    topLoserError: false,

    // Social Profile Top Leader
    topLeaderList: null,
    topLeaderLoading: false,
    topLeaderError: false,

    // For Portfolio List
    portfolioListData: null,
    portfolioListLoading: false,

    // Historical Performance Chart
    historicalPerformData: null,
    historicalPerformLoading: false,
    historicalPerformError: false,
}

export default function SocialProfileReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle social profile subscription method data
        case GET_SOCIAL_PROFILE_SUBSCRIPTION:
            return Object.assign({}, state, {
                SocialProfileSubscriptionData: null,
                SocialProfileSubscriptionLoading: true
            })
        // Set social profile subscription success data
        case GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS:
            return Object.assign({}, state, {
                SocialProfileSubscriptionData: action.data,
                SocialProfileSubscriptionLoading: false
            })
        // Set social profile subscription failure data
        case GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE:
            return Object.assign({}, state, {
                SocialProfileSubscriptionData: null,
                SocialProfileSubscriptionLoading: false,
                SocialProfileSubscriptionError: true
            })

        // Handle social profile subscribe method data
        case SOCIAL_PROFILE_SUBSCRIBE:
            return Object.assign({}, state, {
                SocialProfileSubscribeData: null,
                SocialProfileSubscribeLoading: true
            })
        // Set social profile subscribe success data
        case SOCIAL_PROFILE_SUBSCRIBE_SUCCESS:
            return Object.assign({}, state, {
                SocialProfileSubscribeData: action.data,
                SocialProfileSubscribeLoading: false
            })
        // Set social profile subscribe failure data
        case SOCIAL_PROFILE_SUBSCRIBE_FAILURE:
            return Object.assign({}, state, {
                SocialProfileSubscribeData: null,
                SocialProfileSubscribeLoading: false,
                SocialProfileSubscribeError: true
            })

        // Handle social profile unsubscribe method data
        case SOCIAL_PROFILE_UNSUBSCRIBE:
            return Object.assign({}, state, {
                SocialProfileUnSubscribeData: null,
                SocialProfileUnSubscribeLoading: true
            })
        // Set social profile unsubscribe success data
        case SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS:
            return Object.assign({}, state, {
                SocialProfileUnSubscribeData: action.data,
                SocialProfileUnSubscribeLoading: false
            })
        // Set social profile unsubscribe failure data
        case SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE:
            return Object.assign({}, state, {
                SocialProfileUnSubscribeData: null,
                SocialProfileUnSubscribeLoading: false,
                SocialProfileUnSubscribeError: true
            })

        // Handle add leader configuration method data
        case ADD_LEADER_CONFIG:
            return Object.assign({}, state, {
                AddLeaderConfigData: null,
                AddLeaderConfigLoading: true
            })
        // Set add leader configuration success data
        case ADD_LEADER_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                AddLeaderConfigData: action.data,
                AddLeaderConfigLoading: false
            })
        // Set add leader configuration failure data
        case ADD_LEADER_CONFIG_FAILURE:
            return Object.assign({}, state, {
                AddLeaderConfigData: null,
                AddLeaderConfigLoading: false,
                AddLeaderConfigError: true
            })

        // Clear leader configuration data
        case CLEAR_LEADER_CONFIG:
            return Object.assign({}, state, {
                AddLeaderConfigData: null,
                AddLeaderConfigLoading: false,
            })

        // Handle get leader follow by id method data
        case GET_LEADER_FOLLOW_BY_ID:
            return Object.assign({}, state, {
                LeaderFollowByIdData: null,
                LeaderFollowByIdLoading: true
            })
        // Set get leader follow by id success data
        case GET_LEADER_FOLLOW_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                LeaderFollowByIdData: action.data,
                LeaderFollowByIdLoading: false
            })
        // Set get leader follow by id failure data
        case GET_LEADER_FOLLOW_BY_ID_FAILURE:
            return Object.assign({}, state, {
                LeaderFollowByIdData: null,
                LeaderFollowByIdLoading: false,
                LeaderFollowByIdError: true
            })

        // Handle edit follower configuration method data
        case EDIT_FOLLOWER_CONFIG:
            return Object.assign({}, state, {
                EditFollowerConfigData: null,
                EditFollowerConfigLoading: true
            })
        // Set edit follower configuration success data
        case EDIT_FOLLOWER_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                EditFollowerConfigData: action.data,
                EditFollowerConfigLoading: false
            })
        // Set edit follower configuration failure data
        case EDIT_FOLLOWER_CONFIG_FAILURE:
            return Object.assign({}, state, {
                EditFollowerConfigData: null,
                EditFollowerConfigLoading: false,
                EditFollowerConfigError: true
            })

        // Handle get leader list method data
        case GET_LEADER_LIST:
            return Object.assign({}, state, {
                Loading: true,
                getLeaderList: null,
            })
        // Set leader list success data
        case GET_LEADER_LIST_SUCCESS:
            return Object.assign({}, state, {
                Loading: false,
                getLeaderList: action.data
            })
        // Set leader list failure data
        case GET_LEADER_LIST_FAILURE:
            return Object.assign({}, state, {
                Loading: false,

            })

        // Handle unfollow leader method data
        case UNFOLLOW_LEADER:
            return Object.assign({}, state, {
                isUnFollow: true,
                unfollowData: null,
            })
        // Set unfollow leader success data
        case UNFOLLOW_LEADER_SUCCESS:
            return Object.assign({}, state, {
                isUnFollow: false,
                unfollowData: action.data
            })
        // Set unfollow leader failure data
        case UNFOLLOW_LEADER_FAILURE:
            return Object.assign({}, state, {
                isUnFollow: false,
                unfollowData: null,
            })

        // Handle leader configuration method data
        case GET_LEADER_CONFIG:
            return Object.assign({}, state, {
                leaderConfigData: null,
                leaderConfigLoading: true
            })
        // Set leader configuration success data
        case GET_LEADER_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                leaderConfigData: action.data,
                leaderConfigLoading: false
            })
        // Set leader configuration failure data
        case GET_LEADER_CONFIG_FAILURE:
            return Object.assign({}, state, {
                leaderConfigData: null,
                leaderConfigLoading: false,
                LeaderConfigError: true
            })

    }

    switch (action.type) {
        // Handle group list method data
        case GET_GROUP_LIST:
            return Object.assign({}, state, {
                groupListData: null,
                groupListLoading: true
            })
        // Set group list success data
        case GET_GROUP_LIST_SUCCESS:
            return Object.assign({}, state, {
                groupListData: action.data,
                groupListLoading: false
            })
        // Set group list failure data
        case GET_GROUP_LIST_FAILURE:
            return Object.assign({}, state, {
                groupListData: null,
                groupListLoading: false,
                groupListError: true
            })

        // Handle add new watch list method data
        case ADD_NEW_WATCH_LIST:
            return Object.assign({}, state, {
                addWatchListItemData: null,
                addWatchListItemLoading: true
            })
        // Set add new watch list success data
        case ADD_NEW_WATCH_LIST_SUCCESS:
            return Object.assign({}, state, {
                addWatchListItemData: action.data,
                addWatchListItemLoading: false
            })
        // Set add new watch list failure data
        case ADD_NEW_WATCH_LIST_FAILURE:
            return Object.assign({}, state, {
                addWatchListItemData: null,
                addWatchListItemLoading: false,
                addWatchListItemError: true
            })

        // Handle add to watch list method data
        case ADD_TO_WATCH_LIST:
            return Object.assign({}, state, {
                addToWatchList: null,
                addToWatchLoading: true
            })
        // Set add to watch list success data
        case ADD_TO_WATCH_LIST_SUCCESS:
            return Object.assign({}, state, {
                addToWatchList: action.data,
                addToWatchLoading: false
            })
        // Set add to watch list failure data
        case ADD_TO_WATCH_LIST_FAILURE:
            return Object.assign({}, state, {
                addToWatchList: null,
                addToWatchLoading: false,
                addToWatchError: true
            })

        // Handle remove from watch list method data
        case REMOVE_FROM_WATCH_LIST:
            return Object.assign({}, state, {
                removeFromWatchList: null,
                removeFromWatchLoading: true
            })
        // Set remove from watch list success data
        case REMOVE_FROM_WATCH_LIST_SUCCESS:
            return Object.assign({}, state, {
                removeFromWatchList: action.data,
                removeFromWatchLoading: false
            })
        // Set remove from watch list failure data
        case REMOVE_FROM_WATCH_LIST_FAILURE:
            return Object.assign({}, state, {
                removeFromWatchList: null,
                removeFromWatchLoading: false,
                removeFromWatchError: true
            })

        // Clear Leader Data
        case CLEAR_LEADER:
            return Object.assign({}, state, {
                unfollowData: null,
                addWatchListItemData: null,
                addToWatchList: null,
                removeFromWatchList: null,
                SocialProfileUnSubscribeData: null,
                SocialProfileSubscribeData: null,
            })
        //clear follower configuration data
        case CLEAR_FOLLOWER_CONFIG_DATA:
            return Object.assign({}, state, {
                EditFollowerConfigData: null
            })

        // Handle follwer list method data
        case GET_FOLLOWER_LIST:
            return Object.assign({}, state, {
                followerLoading: true,
                getFollowerList: null,
            })
        // Set follwer list success data
        case GET_FOLLOWER_LIST_SUCCESS:
            return Object.assign({}, state, {
                followerLoading: false,
                getFollowerList: action.data
            })
        // Set follwer list failure data
        case GET_FOLLOWER_LIST_FAILURE:
            return Object.assign({}, state, {
                followerLoading: false,
            })

        // Handle my watch list method data
        case GET_LEADER_WATCH_LIST:
            return Object.assign({}, state, {
                leaderWatcherLoading: true,
                getLeaderWatchlist: null,
            })
        // Set my watch list success data
        case GET_LEADER_WATCH_LIST_SUCCESS:
            return Object.assign({}, state, {
                leaderWatcherLoading: false,
                getLeaderWatchlist: action.data
            })
        // Set my watch list failure data
        case GET_LEADER_WATCH_LIST_FAILURE:
            return Object.assign({}, state, {
                leaderWatcherLoading: false,
            })

        // Handle Social Profile Top Gainer method data
        case GET_SOCIAL_PROFILE_TOP_GAINER_LIST:
            return Object.assign({}, state, {
                topGainerList: null,
                topGainerLoading: true
            })
        // Set Social Profile Top Gainer success data
        case GET_SOCIAL_PROFILE_TOP_GAINER_LIST_SUCCESS:
            return Object.assign({}, state, {
                topGainerList: action.data,
                topGainerLoading: false
            })
        // Set Social Profile Top Gainer failure data
        case GET_SOCIAL_PROFILE_TOP_GAINER_LIST_FAILURE:
            return Object.assign({}, state, {
                topGainerList: null,
                topGainerLoading: false,
                topGainerError: true
            })

        // Handle Social Profile Top Loser method data
        case GET_SOCIAL_PROFILE_TOP_LOSER_LIST:
            return Object.assign({}, state, {
                topLoserList: null,
                topLoserLoading: true
            })
        // Set Social Profile Top Loser success data
        case GET_SOCIAL_PROFILE_TOP_LOSER_LIST_SUCCESS:
            return Object.assign({}, state, {
                topLoserList: action.data,
                topLoserLoading: false
            })
        // Set Social Profile Top Loser failure data
        case GET_SOCIAL_PROFILE_TOP_LOSER_LIST_FAILURE:
            return Object.assign({}, state, {
                topLoserList: null,
                topLoserLoading: false,
                topLoserError: true
            })

        // Handle Social Profile Top Leader method data
        case GET_SOCIAL_PROFILE_TOP_LEADER_LIST:
            return Object.assign({}, state, {
                topLeaderList: null,
                topLeaderLoading: true
            })
        // Set Social Profile Top Leader success data
        case GET_SOCIAL_PROFILE_TOP_LEADER_LIST_SUCCESS:
            return Object.assign({}, state, {
                topLeaderList: action.data,
                topLeaderLoading: false
            })
        // Set Social Profile Top Leader failure data
        case GET_SOCIAL_PROFILE_TOP_LEADER_LIST_FAILURE:
            return Object.assign({}, state, {
                topLeaderList: null,
                topLeaderLoading: false,
                topLeaderError: true
            })

    }

    switch (action.type) {
        // Habdle Historical Performance Chart method data
        case GET_HISTORICAL_PERFORM_CHART:
            return Object.assign({}, state, {
                historicalPerformData: null,
                historicalPerformLoading: true
            })
        // Set Historical Performance Chart success data
        case GET_HISTORICAL_PERFORM_CHART_SUCCESS:
            return Object.assign({}, state, {
                historicalPerformData: action.data,
                historicalPerformLoading: false
            })
        // Set Historical Performance Chart failure data
        case GET_HISTORICAL_PERFORM_CHART_FAILURE:
            return Object.assign({}, state, {
                historicalPerformData: null,
                historicalPerformLoading: false,
                historicalPerformError: true
            })

        // Handle Port Folio  List method data
        case GET_LEADER_PORTFOLIO_LIST:
            return Object.assign({}, state, {
                portfolioListLoading: true,
                portfolioListData: null,
            })
        // Set Port Folio  List success data
        case GET_LEADER_PORTFOLIO_LIST_SUCCESS:
            return Object.assign({}, state, {
                portfolioListLoading: false,
                portfolioListData: action.data
            })
        // Set Port Folio  List failure data
        case GET_LEADER_PORTFOLIO_LIST_FAILURE:
            return Object.assign({}, state, {
                portfolioListLoading: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}