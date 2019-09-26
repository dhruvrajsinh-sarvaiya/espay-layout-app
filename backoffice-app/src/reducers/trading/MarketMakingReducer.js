// MarketMakingReducer.js
import {
    // for get List of Market Making
    GET_MARKING_MAKING_LIST,
    GET_MARKING_MAKING_LIST_SUCCESS,
    GET_MARKING_MAKING_LIST_FAILURE,

    // for Change Market Making Status
    CHANGE_MARKING_MAKING_STATUS,
    CHANGE_MARKING_MAKING_STATUS_SUCCESS,
    CHANGE_MARKING_MAKING_STATUS_FAILURE,

    // for clear data
    ACTION_LOGOUT,
    CLEAR_MARKING_MAKING_DATA
} from "../../actions/ActionTypes";

// Initial State for Market Making
const INITIAL_STATE = {

    // Market Making list
    MarketMakingList: null,
    MarketMakingLoading: false,
    MarketMakingError: false,

    // for change status
    changeStatusData: null,
    changeStatusLoading: false,
}

export default function MarketMakingReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Market Making method data
        case GET_MARKING_MAKING_LIST:
            return Object.assign({}, state, {
                MarketMakingList: null,
                MarketMakingLoading: true
            })
        // Set Market Making success data
        case GET_MARKING_MAKING_LIST_SUCCESS:
            return Object.assign({}, state, {
                MarketMakingList: action.data,
                MarketMakingLoading: false,
            })
        // Set Market Making failure data
        case GET_MARKING_MAKING_LIST_FAILURE:
            return Object.assign({}, state, {
                MarketMakingList: null,
                MarketMakingLoading: false,
                MarketMakingError: true
            })
        // Handle Status Market Making method data
        case CHANGE_MARKING_MAKING_STATUS:
            return Object.assign({}, state, {
                changeStatusData: null,
                changeStatusLoading: true
            })
        // Set Status Market Making success data
        case CHANGE_MARKING_MAKING_STATUS_SUCCESS:
            return Object.assign({}, state, {
                changeStatusData: action.data,
                changeStatusLoading: false,
            })
        // Set Status Market Making failure data
        case CHANGE_MARKING_MAKING_STATUS_FAILURE:
            return Object.assign({}, state, {
                changeStatusData: null,
                changeStatusLoading: false,
            })
        // Clear Market Making method data
        case CLEAR_MARKING_MAKING_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}