import {
    // Ip History List
    IP_HISTORY_LIST,
    IP_HISTORY_LIST_SUCCESS,
    IP_HISTORY_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const initialState = {

    // Initial State For Ip History Data
    IpHistoryFetchData: true,
    IpHistorydata: '',
    IpIsFetching: false,
}

export default function IpHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        //for ip history list
        case IP_HISTORY_LIST:
            return Object.assign({}, state, { IpHistoryFetchData: true, IpHistorydata: '', IpIsFetching: true, })
        //for ip history list success
        case IP_HISTORY_LIST_SUCCESS:
            return Object.assign({}, state, { IpHistoryFetchData: false, IpHistorydata: action.payload, IpIsFetching: false, })
        //for ip history list failure
        case IP_HISTORY_LIST_FAILURE:
            return Object.assign({}, state, { IpHistoryFetchData: false, IpHistorydata: action.payload, IpIsFetching: false, })

        // Set Default Initial Data in Store
        default:
            return state;
    }
}