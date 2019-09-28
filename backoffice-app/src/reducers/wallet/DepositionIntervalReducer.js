import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Deposition Interval List
    GET_DEPOSITION_INTERVAL_LIST,
    GET_DEPOSITION_INTERVAL_LIST_SUCCESS,
    GET_DEPOSITION_INTERVAL_LIST_FAILURE,

    // Add Deposition Interval
    ADD_DEPOSITION_INTERVAL,
    ADD_DEPOSITION_INTERVAL_SUCCESS,
    ADD_DEPOSITION_INTERVAL_FAILURE,

    // Clear Deposition Interval
    CLEAR_DEPOSITION_INTERVAL
} from "../../actions/ActionTypes";

// Initial State for Deposition Interval
const INITIAL_STATE = {
    // Deposition Interval List
    DepositionIntervalList: null,
    DepositionIntervalLoading: false,
    DepositionIntervalError: false,

    // Add Deposition Interval
    AddDepositionInterval: null,
    AddDepositionIntervalLoading: false,
    AddDepositionIntervalError: false,
}

export default function DepositionIntervalReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Deposition Interval List method data
        case GET_DEPOSITION_INTERVAL_LIST:
            return Object.assign({}, state, {
                DepositionIntervalList: null,
                DepositionIntervalLoading: true
            })
        // Set Deposition Interval List success data
        case GET_DEPOSITION_INTERVAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                DepositionIntervalList: action.data,
                DepositionIntervalLoading: false,
            })
        // Set Deposition Interval List failure data
        case GET_DEPOSITION_INTERVAL_LIST_FAILURE:
            return Object.assign({}, state, {
                DepositionIntervalList: null,
                DepositionIntervalLoading: false,
                DepositionIntervalError: true
            })

        // Handle Add Deposition Interval List method data
        case ADD_DEPOSITION_INTERVAL:
            return Object.assign({}, state, {
                AddDepositionInterval: null,
                AddDepositionIntervalLoading: true
            })
        // Set Deposition Interval List success data
        case ADD_DEPOSITION_INTERVAL_SUCCESS:
            return Object.assign({}, state, {
                AddDepositionInterval: action.data,
                AddDepositionIntervalLoading: false,
            })
        // Set Deposition Interval List failure data
        case ADD_DEPOSITION_INTERVAL_FAILURE:
            return Object.assign({}, state, {
                AddDepositionInterval: null,
                AddDepositionIntervalLoading: false,
                AddDepositionIntervalError: true
            })

        // Handle Clear Deposition Interval method data
        case CLEAR_DEPOSITION_INTERVAL:
            return Object.assign({}, state, {
                AddDepositionInterval: null,
                DepositionIntervalList: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
