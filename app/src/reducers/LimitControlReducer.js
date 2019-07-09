// Action types for Limit Control
import {
    // Fetch Save Limit
    FETCH_SAVE_LIMIT,
    FETCH_SAVE_LIMIT_SUCCESS,
    FETCH_SAVE_LIMIT_FAILURE,

    // Fetch Limit Control
    FETCH_LIMIT_CONTROL,
    FETCH_LIMIT_CONTROL_SUCCESS,
    FETCH_LIMIT_CONTROL_FAILURE,

    // get wallet list
    FETCH_WALLET_LIST,
    FETCH_WALLET_LIST_SUCCESS,
    FETCH_WALLET_LIST_FAILURE,

    // Dropdown Change
    DropdownChange,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

const INTIAL_STATE = {

    //Initial State For Limit Control Data
    //For Limit Control
    LimitControlFetchData: true,
    LimitControlisFetching: false,
    LimitControlData: '',

    //For get saved Limit Control
    GetLimitFetchData: true,
    GetLimitisFetching: false,
    GetLimitData: '',

    //For Wallet List
    ListWalletData: '',
    ListWalletFetchData: true,
    ListWalletIsFetching: false,
}

const LimitControlReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle DropdownChange method data
        case DropdownChange:
            return Object.assign({}, state, {
                LimitControlFetchData: true,
                ListWalletFetchData: true,
                GetLimitFetchData: true,
            });

        // Handle Fetch Save Limit method data
        case FETCH_SAVE_LIMIT:
            return Object.assign({}, state, {
                GetLimitFetchData: true,
                LimitControlisFetching: true,
                LimitControlFetchData: true,
                ListWalletFetchData: true,
                LimitControlData: '',
            });
        // Set Fetch Save Limit success data
        case FETCH_SAVE_LIMIT_SUCCESS:
            return Object.assign({}, state, {
                GetLimitFetchData: true,
                LimitControlFetchData: false,
                ListWalletFetchData: true,
                LimitControlisFetching: false,
                LimitControlData: action.data,
            });
        // Set Fetch Save Limit failure data
        case FETCH_SAVE_LIMIT_FAILURE:
            return Object.assign({}, state, {
                GetLimitFetchData: true,
                LimitControlFetchData: false,
                ListWalletFetchData: true,
                LimitControlisFetching: false,
                LimitControlData: action.e,
            });

        // Handle Fetch Limit Control method data
        case FETCH_LIMIT_CONTROL:
            return Object.assign({}, state, {
                LimitControlFetchData: true,
                ListWalletFetchData: true,
                GetLimitFetchData: true,
                GetLimitisFetching: true,
                GetLimitData: '',
            });
        // Set Fetch Limit Control success data
        case FETCH_LIMIT_CONTROL_SUCCESS:
            return Object.assign({}, state, {
                LimitControlFetchData: true,
                ListWalletFetchData: true,
                GetLimitFetchData: false,
                GetLimitisFetching: false,
                GetLimitData: action.data,
            });
        // Set Fetch Limit Control failure data
        case FETCH_LIMIT_CONTROL_FAILURE:
            return Object.assign({}, state, {
                LimitControlFetchData: true,
                ListWalletFetchData: true,
                GetLimitFetchData: false,
                GetLimitisFetching: false,
                GetLimitData: action.e,
            });

        // Handle Watch List method data
        case FETCH_WALLET_LIST:
            return { ...state, ListWalletIsFetching: true, ListWalletData: '', ListWalletFetchData: true, LimitControlFetchData: true, GetLimitFetchData: true };
        // Set Watch List success data
        case FETCH_WALLET_LIST_SUCCESS:
            return { ...state, ListWalletIsFetching: false, ListWalletData: action.data, ListWalletFetchData: false, LimitControlFetchData: true, GetLimitFetchData: true };
        // Set Watch List failure data
        case FETCH_WALLET_LIST_FAILURE:
            return { ...state, ListWalletIsFetching: false, ListWalletData: action.data, ListWalletFetchData: false, LimitControlFetchData: true, GetLimitFetchData: true };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default LimitControlReducer;