import {
    // Clear Data
    ACTION_LOGOUT,
    CLEAR_LEDGER_FOLLOWER_DATA,

    // Get Ledger Trading Policy
    GET_LEADER_TRADING_POLICY,
    GET_LEADER_TRADING_POLICY_SUCCESS,
    GET_LEADER_TRADING_POLICY_FAILURE,

    // Get Follower Trading Policy
    GET_FOLLOWER_TRADING_POLICY,
    GET_FOLLOWER_TRADING_POLICY_SUCCESS,
    GET_FOLLOWER_TRADING_POLICY_FAILURE,

    // Edit Leader Trading Policy
    EDIT_LEADER_TRADING_POLICY,
    EDIT_LEADER_TRADING_POLICY_SUCCESS,
    EDIT_LEADER_TRADING_POLICY_FAILURE,

    // Edit Follower Trading Policy
    EDIT_FOLLOWER_TRADING_POLICY,
    EDIT_FOLLOWER_TRADING_POLICY_SUCCESS,
    EDIT_FOLLOWER_TRADING_POLICY_FAILURE,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    // For Ledger Trading Policy
    LedgerTradingData: null,
    LedgerTradingLoading: false,
    LedgerTradingError: false,

    // For Follower Trading Policy
    FollowerTradingData: null,
    FollowerTradingLoading: false,
    FollowerTradingError: false,

    // For Edit Ledger Trading Policy
    EditLedgerTradingData: null,
    EditLedgerTradingLoading: false,
    EditLedgerTradingError: false,

    // For Follower Trading Policy
    EditFollowerTradingData: null,
    EditFollowerTradingLoading: false,
    EditFollowerTradingError: false,
}

export default function SocialTradingPolicyReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get Leader Trading Policy method data
        case GET_LEADER_TRADING_POLICY:
            return Object.assign({}, state, {
                LedgerTradingData: null,
                LedgerTradingLoading: true
            })
        // Set Leader Trading Policy success data
        case GET_LEADER_TRADING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                LedgerTradingData: action.data,
                LedgerTradingLoading: false
            })
        // Set Leader Trading Policy failure data
        case GET_LEADER_TRADING_POLICY_FAILURE:
            return Object.assign({}, state, {
                LedgerTradingData: null,
                LedgerTradingLoading: false,
                LedgerTradingError: true
            })

        // Handle Get Follower Trading Policy method data 
        case GET_FOLLOWER_TRADING_POLICY:
            return Object.assign({}, state, {
                FollowerTradingData: null,
                FollowerTradingLoading: true
            })
        // Set Follower Trading Policy success data
        case GET_FOLLOWER_TRADING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                FollowerTradingData: action.data,
                FollowerTradingLoading: false
            })
        // Set Follower Trading Policy failure data
        case GET_FOLLOWER_TRADING_POLICY_FAILURE:
            return Object.assign({}, state, {
                FollowerTradingData: null,
                FollowerTradingLoading: false,
                FollowerTradingError: true
            })

        // Handle Edit Leader Trading Policy method data
        case EDIT_LEADER_TRADING_POLICY:
            return Object.assign({}, state, {
                EditLedgerTradingData: null,
                EditLedgerTradingLoading: true
            })
        // Set Edit Leader Trading Policy success data
        case EDIT_LEADER_TRADING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                EditLedgerTradingData: action.data,
                EditLedgerTradingLoading: false
            })
        // Set Edit Leader Trading Policy failure data
        case EDIT_LEADER_TRADING_POLICY_FAILURE:
            return Object.assign({}, state, {
                EditLedgerTradingData: null,
                EditLedgerTradingLoading: false,
                EditLedgerTradingError: true
            })

        // Handle Edit Follower Trading Policy method data 
        case EDIT_FOLLOWER_TRADING_POLICY:
            return Object.assign({}, state, {
                EditFollowerTradingData: null,
                EditFollowerTradingLoading: true
            })
        // Set Edit Follower Trading Policy success data 
        case EDIT_FOLLOWER_TRADING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                EditFollowerTradingData: action.data,
                EditFollowerTradingLoading: false
            })
        // Set Edit Follower Trading Policy failure data 
        case EDIT_FOLLOWER_TRADING_POLICY_FAILURE:
            return Object.assign({}, state, {
                EditFollowerTradingData: null,
                EditFollowerTradingLoading: false,
                EditFollowerTradingError: true
            })

        // Clear Leader Follower Data
        case CLEAR_LEDGER_FOLLOWER_DATA:
            return Object.assign({}, state, {
                EditFollowerTradingData: null,
                EditLedgerTradingData: null,
                FollowerTradingData: null,
                LedgerTradingData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}