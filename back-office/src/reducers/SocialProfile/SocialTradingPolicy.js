/**
 * Auther : Kevin Ladani
 * Created : 20/12/2018
 * UpdatedBy : Salim Deraiya 22/12/2018
 * Social Trading Policy Reducers
 */
import {
    //Leader Trading Policy
    GET_LEADER_TRADING_POLICY,
    GET_LEADER_TRADING_POLICY_SUCCESS,
    GET_LEADER_TRADING_POLICY_FAILURE,
    EDIT_LEADER_TRADING_POLICY,
    EDIT_LEADER_TRADING_POLICY_SUCCESS,
    EDIT_LEADER_TRADING_POLICY_FAILURE,

    //Follower Trading Policy
    GET_FOLLOWER_TRADING_POLICY,
    GET_FOLLOWER_TRADING_POLICY_SUCCESS,
    GET_FOLLOWER_TRADING_POLICY_FAILURE,
    EDIT_FOLLOWER_TRADING_POLICY,
    EDIT_FOLLOWER_TRADING_POLICY_SUCCESS,
    EDIT_FOLLOWER_TRADING_POLICY_FAILURE,
} from 'Actions/types';


/*
* Initial State
*/
const INIT_STATE = {
    followerLoading: false,
    leaderLoading: false,
    followerData: [],
    leaderData: []
}

//Check Action for Social Profile Trading...
export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Leader Profile Configuration..
        case GET_LEADER_TRADING_POLICY:
            return { ...state, leaderLoading: true, leaderData : '' };

        case GET_LEADER_TRADING_POLICY_SUCCESS:
        case GET_LEADER_TRADING_POLICY_FAILURE:
        case EDIT_LEADER_TRADING_POLICY_SUCCESS:
        case EDIT_LEADER_TRADING_POLICY_FAILURE:
            return { ...state, leaderLoading: false, leaderData: action.payload };

        case EDIT_LEADER_TRADING_POLICY:
            return { ...state, leaderLoading: true, leaderData : '' };

        //Follower Profile Configuration..
        case GET_FOLLOWER_TRADING_POLICY:
            return { ...state, followerLoading: true, followerData: '' };

        case GET_FOLLOWER_TRADING_POLICY_SUCCESS:
        case GET_FOLLOWER_TRADING_POLICY_FAILURE:
        case EDIT_FOLLOWER_TRADING_POLICY_SUCCESS:
        case EDIT_FOLLOWER_TRADING_POLICY_FAILURE:
            return { ...state, followerLoading: false, followerData: action.payload };

        case EDIT_FOLLOWER_TRADING_POLICY:
            return { ...state, followerLoading: true, followerData: '' };

        default:
            return { ...state };
    }
}