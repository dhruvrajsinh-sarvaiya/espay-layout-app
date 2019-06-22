// Action type for IP Whitelist Module
import {
    //For IP Whitelist
    LIST_IP_WHITELIST,
    LIST_IP_WHITELIST_SUCCESS,
    LIST_IP_WHITELIST_FAILURE,

    //For Add IP to WhiteList
    ADD_IP_TO_WHITELIST,
    ADD_IP_TO_WHITELIST_SUCCESS,
    ADD_IP_TO_WHITELIST_FAILURE,

    //For Delete IP to WhiteList
    DELETE_IP_TO_WHITELIST,
    DELETE_IP_TO_WHITELIST_SUCCESS,
    DELETE_IP_TO_WHITELIST_FAILURE,

    //For Disable IP to WhiteList
    DISABLE_IP_TO_WHITELIST,
    DISABLE_IP_TO_WHITELIST_SUCCESS,
    DISABLE_IP_TO_WHITELIST_FAILURE,

    //For Enable IP to WhiteList
    ENABLE_IP_TO_WHITELIST,
    ENABLE_IP_TO_WHITELIST_SUCCESS,
    ENABLE_IP_TO_WHITELIST_FAILURE,

    //For Update IP To Whitelist
    UPDATE_IP_TO_WHITELIST,
    UPDATE_IP_TO_WHITELIST_SUCCESS,
    UPDATE_IP_TO_WHITELIST_FAILURE,

    // Cleat Ip Whitelist
    CLEAR_IP_WHITELIST,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes'

// Initial state for IP Whitelist Module
const INITIAL_STATE = {

    //Initial State For IP Whitelist
    IpWhitelistFetchData: true,
    IpWhitelistisFetching: false,
    IpWhitelistdata: '',

    //Initial State For Add IP To Whitelist
    AddIpToWhitelistFetchData: true,
    AddIpToWhitelistisFetching: false,
    AddIpToWhitelistdata: '',

    //Initial State For Delete IP From Whitelist
    DeleteIpWhitelistFetchData: true,
    DeleteIpWhitelistisFetching: false,
    DeleteIpWhitelistdata: '',

    //Initial State For Disable IP From Whitelist
    DisableIpWhitelistFetchData: true,
    DisableIpWhitelistisFetching: false,
    DisableIpWhitelistdata: '',

    //Initial State For Enable IP From Whitelist
    EnableIpWhitelistFetchData: true,
    EnableIpWhitelistisFetching: false,
    EnableIpWhitelistdata: '',

    //Initial State For Enable IP From Whitelist
    UpdateIpWhitelistFetchData: true,
    UpdateIpWhitelistisFetching: false,
    UpdateIpWhitelistdata: '',
};

export default function IPWhiteListReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle IP Whitelist method data
        case LIST_IP_WHITELIST:
            return {
                ...state,
                IpWhitelistFetchData: true,
                IpWhitelistisFetching: true,
                IpWhitelistdata: '',
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set IP Whitelist success data
        case LIST_IP_WHITELIST_SUCCESS:
            return {
                ...state,
                IpWhitelistFetchData: false,
                IpWhitelistisFetching: false,
                IpWhitelistdata: action.payload,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set IP Whitelist failure data
        case LIST_IP_WHITELIST_FAILURE:
            return {
                ...state,
                IpWhitelistFetchData: false,
                IpWhitelistisFetching: false,
                IpWhitelistdata: action.payload,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };

        // Handle add to IP Whitelist method data
        case ADD_IP_TO_WHITELIST:
            return {
                ...state,
                AddIpToWhitelistFetchData: true,
                AddIpToWhitelistisFetching: true,
                AddIpToWhitelistdata: '',
                IpWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set add to IP Whitelist success data
        case ADD_IP_TO_WHITELIST_SUCCESS:
            return {
                ...state,
                AddIpToWhitelistFetchData: false,
                AddIpToWhitelistisFetching: false,
                AddIpToWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set add to IP Whitelist failure data
        case ADD_IP_TO_WHITELIST_FAILURE:
            return {
                ...state,
                AddIpToWhitelistFetchData: false,
                AddIpToWhitelistisFetching: false,
                AddIpToWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };

        // Handle delete to IP Whitelist method data
        case DELETE_IP_TO_WHITELIST:
            return {
                ...state,
                DeleteIpWhitelistFetchData: true,
                DeleteIpWhitelistisFetching: true,
                DeleteIpWhitelistdata: '',
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set delete to IP Whitelist success data
        case DELETE_IP_TO_WHITELIST_SUCCESS:
            return {
                ...state,
                DeleteIpWhitelistFetchData: false,
                DeleteIpWhitelistisFetching: false,
                DeleteIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set delete to IP Whitelist failure data
        case DELETE_IP_TO_WHITELIST_FAILURE:
            return {
                ...state,
                DeleteIpWhitelistFetchData: false,
                DeleteIpWhitelistisFetching: false,
                DeleteIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };

        // Handle disable to IP Whitelist method data
        case DISABLE_IP_TO_WHITELIST:
            return {
                ...state,
                DisableIpWhitelistFetchData: true,
                DisableIpWhitelistisFetching: true,
                DisableIpWhitelistdata: '',
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set disable to IP Whitelist Success data
        case DISABLE_IP_TO_WHITELIST_SUCCESS:
            return {
                ...state,
                DisableIpWhitelistFetchData: false,
                DisableIpWhitelistisFetching: false,
                DisableIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set disable to IP Whitelist failure data
        case DISABLE_IP_TO_WHITELIST_FAILURE:
            return {
                ...state,
                DisableIpWhitelistFetchData: false,
                DisableIpWhitelistisFetching: false,
                DisableIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };

        // Handle enable to IP Whitelist method data
        case ENABLE_IP_TO_WHITELIST:
            return {
                ...state,
                EnableIpWhitelistFetchData: true,
                EnableIpWhitelistisFetching: true,
                EnableIpWhitelistdata: '',
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set enable to IP Whitelist success data
        case ENABLE_IP_TO_WHITELIST_SUCCESS:
            return {
                ...state,
                EnableIpWhitelistFetchData: false,
                EnableIpWhitelistisFetching: false,
                EnableIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };
        // Set enable to IP Whitelist failure data
        case ENABLE_IP_TO_WHITELIST_FAILURE:
            return {
                ...state,
                EnableIpWhitelistFetchData: false,
                EnableIpWhitelistisFetching: false,
                EnableIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                UpdateIpWhitelistFetchData: true,
            };

        // Handle update to IP Whitelist method data
        case UPDATE_IP_TO_WHITELIST:
            return {
                ...state,
                UpdateIpWhitelistFetchData: true,
                UpdateIpWhitelistisFetching: true,
                UpdateIpWhitelistdata: '',
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
            };
        // Set update to IP Whitelist success data 
        case UPDATE_IP_TO_WHITELIST_SUCCESS:
            return {
                ...state,
                UpdateIpWhitelistFetchData: false,
                UpdateIpWhitelistisFetching: false,
                UpdateIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
            };
        // Set update to IP Whitelist failure data
        case UPDATE_IP_TO_WHITELIST_FAILURE:
            return {
                ...state,
                UpdateIpWhitelistFetchData: false,
                UpdateIpWhitelistisFetching: false,
                UpdateIpWhitelistdata: action.payload,
                IpWhitelistFetchData: true,
                AddIpToWhitelistFetchData: true,
                DeleteIpWhitelistFetchData: true,
                DisableIpWhitelistFetchData: true,
                EnableIpWhitelistFetchData: true,
            };

        // Clear Ip Whitelist data
        case CLEAR_IP_WHITELIST: 
            return INITIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};