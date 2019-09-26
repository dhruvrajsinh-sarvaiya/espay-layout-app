import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Open Position Report
    GET_OPEN_POSITION_REPORT,
    GET_OPEN_POSITION_REPORT_SUCCESS,
    GET_OPEN_POSITION_REPORT_FAILURE,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Clear Open Position Report
    CLEAR_OPEN_POSITION_REPORT,

    // Get Pair List
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Open Position Report
const INITIAL_STATE = {
    // for Open Position Report
    OpenPositionReportData: null,
    OpenPositionReportLoading: false,
    OpenPositionReportError: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,
    UserDataListError: false,

    // for pair list
    PairListData: null,
    PairListDataLoading: false,
    PairListDataError: false,
}

export default function OpenPositionReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Get Open Position Report method data
        case GET_OPEN_POSITION_REPORT:
            return Object.assign({}, state, {
                OpenPositionReportData: null,
                OpenPositionReportLoading: true
            })
        // Set Get Open Position Report success data
        case GET_OPEN_POSITION_REPORT_SUCCESS:
            return Object.assign({}, state, {
                OpenPositionReportData: action.data,
                OpenPositionReportLoading: false,
            })
        // Set Get Open Position Report failure data
        case GET_OPEN_POSITION_REPORT_FAILURE:
            return Object.assign({}, state, {
                OpenPositionReportData: null,
                OpenPositionReportLoading: false,
                OpenPositionReportError: true
            })

        // Handle Get User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: true
            })
        // Set Get User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataListLoading: false,
            })
        // Set Get User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: false,
                UserDataListError: true
            })

        // Handle Get Wallet Data method data
        case GET_PAIR_LIST:
            return Object.assign({}, state, {
                PairListData: null,
                PairListDataLoading: true
            })
        // Set Get Wallet Data success data
        case GET_PAIR_LIST_SUCCESS:
            return Object.assign({}, state, {
                PairListData: action.payload,
                PairListDataLoading: false,
            })
        // Set Get Wallet Data failure data
        case GET_PAIR_LIST_FAILURE:
            return Object.assign({}, state, {
                PairListData: null,
                PairListDataLoading: false,
                PairListDataError: true
            })

        // Clear Open Position Report Data
        case CLEAR_OPEN_POSITION_REPORT:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}