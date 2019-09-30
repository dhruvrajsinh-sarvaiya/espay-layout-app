import {

    // Get Profit loss Report List
    GET_PROFITLOSS_LIST,
    GET_PROFITLOSS_LIST_SUCCESS,
    GET_PROFITLOSS_LIST_FAILURE,

    // clear Profit loss data
    CLEAR_PROFITLOSS_DATA,

    // Action Logout
    ACTION_LOGOUT,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //get all wallet type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    //get pairlist
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,
} from "../../actions/ActionTypes";

//initial state
const INITIAL_STATE = {
    // for Loading
    loading: false,

    // for Profit Loss Report
    ProfitLossReport: null,

    // for User Data
    userData: null,

    // for Wallet Data
    walletData: null,

    // for Pair List
    pairList: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // clear Profit loss data
        case CLEAR_PROFITLOSS_DATA: {
            return INITIAL_STATE;
        }

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null })

        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload })

        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: action.payload })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null })

        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload })

        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload })

        // Handle Get pairList Data method data
        case GET_PAIR_LIST: {
            return Object.assign({}, state, { pairList: null })
        }

        // Set Get pairList Data success data
        case GET_PAIR_LIST_SUCCESS: {
            return Object.assign({}, state, { pairList: action.payload })
        }

        // Set Get pairList Data failure data
        case GET_PAIR_LIST_FAILURE: {
            return Object.assign({}, state, { pairList: null, })
        }

        // Set Get ProfitLossReport success data
        case GET_PROFITLOSS_LIST:
            return Object.assign({}, state, {
                loading: true,
                ProfitLossReport: null
            })

        // Set Get ProfitLossReport List success data
        case GET_PROFITLOSS_LIST_SUCCESS:
        // Set Get ProfitLossReport List failure data
        case GET_PROFITLOSS_LIST_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                ProfitLossReport: action.payload,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};
