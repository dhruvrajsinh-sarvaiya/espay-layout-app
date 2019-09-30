import {
    // Social Trading History List
    SOCIAL_TRADING_HISTORY_LIST,
    SOCIAL_TRADING_HISTORY_LIST_SUCCESS,
    SOCIAL_TRADING_HISTORY_LIST_FAILURE,

    //clear data
    CLEAR_SOCIAL_TRADING_HISTORY,
    ACTION_LOGOUT,

    //pair list 
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,

    //Affliate User Data 
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,
} from '../../actions/ActionTypes';

/*
* Initial State
*/
const INIT_STATE = {

    // Social Trading History List
    socialTradingLoading: false,
    socialTradingData: null,

    //pair list
    pairList: null,

    //user data
    affiliateUserData: null,
}

//Check Action  To SOCIAL TRADING HISTORY
export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE;

        // To reset initial state on clear data
        case CLEAR_SOCIAL_TRADING_HISTORY:
            return INIT_STATE;

        // Handle Get socialTradingHistory List method data
        case SOCIAL_TRADING_HISTORY_LIST:
            return Object.assign({}, state, { socialTradingLoading: true, socialTradingData: null })
        // Set socialTradingHistory List success data
        case SOCIAL_TRADING_HISTORY_LIST_SUCCESS:
            return Object.assign({}, state, { socialTradingLoading: false, socialTradingData: action.payload })
        // Set socialTradingHistory List Failure data
        case SOCIAL_TRADING_HISTORY_LIST_FAILURE:
            return Object.assign({}, state, { socialTradingLoading: false, socialTradingData: action.payload })

        // Handle Get Pair list method data
        case GET_PAIR_LIST:
            return Object.assign({}, state, { pairList: null })
        // Set Pair list success data
        case GET_PAIR_LIST_SUCCESS:
            return Object.assign({}, state, { pairList: action.payload })
        // Set Pair list Failure data
        case GET_PAIR_LIST_FAILURE:
            return Object.assign({}, state, { pairList: null, })

        // Handle Get Affliate User  method data
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, { affiliateUserData: null })
        // Set Affliate User t success data
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, { affiliateUserData: action.payload, })
        // Set Affliate User  Failure data
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, { affiliateUserData: action.payload, })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}