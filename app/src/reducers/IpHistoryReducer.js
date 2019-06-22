// Action type for IP History Module
import {
    IP_HISTORY_LIST,
    IP_HISTORY_LIST_SUCCESS,
    IP_HISTORY_LIST_FAILURE,
    ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial state for IP History Module
const INITIAL_STATE = {
    // Ip History Data
    IpHistoryFetchData: true,
    IpHistorydata: '',
    IpIsFetching: false,
}

const IpHistoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle IP History method data
        case IP_HISTORY_LIST:
            return { ...state, IpHistoryFetchData: true, IpHistorydata: '', IpIsFetching: true, };
        // Set IP History success data
        case IP_HISTORY_LIST_SUCCESS:
            return { ...state, IpHistoryFetchData: false, IpHistorydata: action.payload, IpIsFetching: false, };
        // Set IP History failure data
        case IP_HISTORY_LIST_FAILURE:
            return { ...state, IpHistoryFetchData: false, IpHistorydata: action.payload, IpIsFetching: false, };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default IpHistoryReducer;



