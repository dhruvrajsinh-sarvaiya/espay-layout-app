/**
 * Auther : Kevin Ladani
 * Created : 19/12/2018
 * UpdatedBy : Salim Deraiya 24/12/2018
 * Social Profile Reducers
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

    //Get Leader List
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

} from 'Actions/types';

/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    getLeaderList: [],
    getFollowerList: [],
    getleaderData: [],
    unfollowData: [],
    getfollowerData: [],
    leaderData: [],
    followerData: [],
    subscriptionData: [],
    watchlst: [],
    watchGrpData: [],
    watchData: [],
    getLeaderWatchlist: [],
    subscribeData: {}
}

//Check Action for Complain...
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Get Leader Profile Configuration..
        //Edit Leader Profile Configuration..
        case GET_LEADER_CONFIG:
        case EDIT_LEADER_CONFIG:
            return { ...state, loading: true, leaderData: '' };

        case GET_LEADER_CONFIG_SUCCESS:
        case EDIT_LEADER_CONFIG_FAILURE:
        case EDIT_LEADER_CONFIG_SUCCESS:
        case GET_LEADER_CONFIG_FAILURE:
            return { ...state, loading: false, leaderData: action.payload };

        //Get Follower Profile Configuration..
        case GET_FOLLOWER_CONFIG:
            return { ...state, loading: true, followerData: '' };

        case GET_FOLLOWER_CONFIG_SUCCESS:
        case GET_FOLLOWER_CONFIG_FAILURE:
            return { ...state, loading: false, followerData: action.payload };

        //Edit Follower Profile Configuration..
        case EDIT_FOLLOWER_CONFIG:
            return { ...state, loading: true, followerData: '' };

        case EDIT_FOLLOWER_CONFIG_SUCCESS:
        case EDIT_FOLLOWER_CONFIG_FAILURE:
            return { ...state, loading: false, followerData: action.payload };

        //Get Social Profile Subscription...
        case GET_SOCIAL_PROFILE_SUBSCRIPTION:
            return { ...state, loading: true, subscribeData: '', subscriptionData: '' };

        case GET_SOCIAL_PROFILE_SUBSCRIPTION_SUCCESS:
        case GET_SOCIAL_PROFILE_SUBSCRIPTION_FAILURE:
            return { ...state, loading: false, subscriptionData: action.payload };

        //Social Profile Subscribe...
        case SOCIAL_PROFILE_SUBSCRIBE:
            return { ...state, loading: true };

        case SOCIAL_PROFILE_SUBSCRIBE_SUCCESS:
        case SOCIAL_PROFILE_SUBSCRIBE_FAILURE:
            return { ...state, loading: false, subscribeData: action.payload };

        //Social Profile UnSubscribe...
        case SOCIAL_PROFILE_UNSUBSCRIBE:
            return { ...state, loading: true };

        case SOCIAL_PROFILE_UNSUBSCRIBE_SUCCESS:
        case SOCIAL_PROFILE_UNSUBSCRIBE_FAILURE:
            return { ...state, loading: false, subscribeData: action.payload };

        //Get Leader List...
        case GET_LEADER_LIST:
            return { ...state, loading: true, getLeaderList: [], response: [] };

        case GET_LEADER_LIST_SUCCESS:
        case GET_LEADER_LIST_FAILURE:
            return { ...state, loading: false, getLeaderList: action.payload };

        //Get Follower List...
        case GET_FOLLOWER_LIST:
            return { ...state, loading: true, getFollowerList: [] };

        case GET_FOLLOWER_LIST_SUCCESS:
        case GET_FOLLOWER_LIST_FAILURE:
            return { ...state, loading: false, getFollowerList: action.payload };

        //Get Leader Follow By ID...
        case GET_LEADER_FOLLOW_BY_ID:
            return { ...state, loading: true, followerData: [] };

        case GET_LEADER_FOLLOW_BY_ID_SUCCESS:
        case GET_LEADER_FOLLOW_BY_ID_FAILURE:
            return { ...state, loading: false, followerData: action.payload };

        //Unfollow Leader...
        case UNFOLLOW_LEADER:
            return { ...state, loading: true, response: [] };

        case UNFOLLOW_LEADER_SUCCESS:
        case UNFOLLOW_LEADER_FAILURE:
            return { ...state, loading: false, response: action.payload };

        //Add Watchlist Group...
        case ADD_WATCHLIST_GROUP:
            return { ...state, loading: true, response: [] };

        case ADD_WATCHLIST_GROUP_SUCCESS:
        case ADD_WATCHLIST_GROUP_FAILURE:
            return { ...state, loading: false, response: action.payload };

        //Add Watchlist...
        case ADD_WATCHLIST:
            return { ...state, loading: true, response: [] };

        case ADD_WATCHLIST_SUCCESS:
        case ADD_WATCHLIST_FAILURE:
            return { ...state, loading: false, response: action.payload };

        //Remove Watchlist...
        case REMOVE_WATCHLIST:
            return { ...state, loading: true, response: [] };

        case REMOVE_WATCHLIST_SUCCESS:
        case REMOVE_WATCHLIST_FAILURE:
            return { ...state, loading: false, response: action.payload };

        //Get Watchlist...
        case GET_WATCHLIST:
            return { ...state, loading: true, watchlst: [], response: [] };

        case GET_WATCHLIST_SUCCESS:
        case GET_WATCHLIST_FAILURE:
            return { ...state, loading: false, watchlst: action.payload };

        //Get Leader watchlist...
        case GET_LEADER_WATCH_LIST:
            return { ...state, loading: true, getLeaderWatchlist: [], response: [] };

        case GET_LEADER_WATCH_LIST_SUCCESS:
        case GET_LEADER_WATCH_LIST_FAILURE:
            return { ...state, loading: false, getLeaderWatchlist: action.payload };

        default:
            return { ...state };
    }
}