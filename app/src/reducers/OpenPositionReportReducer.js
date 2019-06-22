// Action types for Open Position Report 
import {
    // Get Open Position Report
    GET_OPEN_POSITION_REPORT_DATA,
    GET_OPEN_POSITION_REPORT_DATA_SUCCESS,
    GET_OPEN_POSITION_REPORT_DATA_FAILURE,

    // Get Pair List
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial state for Open Position Report
const INTIAL_STATE = {

    //Pair List
    pairList: null,
    pairListDataFetch: true,

    // for position Report Data
    loading: false,
    positionReportData: null,
    positionReportDataFetch: true,

}

export default function OpenPositionReportReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Get Pair List method data
        case GET_PAIR_LIST: {
            return Object.assign({}, state, {
                pairList: null,
                pairListDataFetch: true,
                positionReportDataFetch: true,
            })
        }
        // Set Get Pair List success data
        case GET_PAIR_LIST_SUCCESS: {
            return Object.assign({}, state, {
                pairList: action.payload,
                pairListDataFetch: false,
                positionReportDataFetch: true,
            })
        }
        // Set Get Pair List failure data
        case GET_PAIR_LIST_FAILURE: {
            return Object.assign({}, state, {
                pairList: null,
                pairListDataFetch: false,
                positionReportDataFetch: true,
            })
        }

        // Handle Open Position Report method data
        case GET_OPEN_POSITION_REPORT_DATA:
            return Object.assign({}, state, {
                loading: true,
                positionReportData: null,
                positionReportDataFetch: true,
                pairListDataFetch: true,
            });
        // Set Open Position Report success data
        case GET_OPEN_POSITION_REPORT_DATA_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                positionReportData: action.data,
                positionReportDataFetch: false,
                pairListDataFetch: true,
            });
        // Set Open Position Report failure data
        case GET_OPEN_POSITION_REPORT_DATA_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                positionReportData: null,
                positionReportDataFetch: false,
                pairListDataFetch: true,
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}