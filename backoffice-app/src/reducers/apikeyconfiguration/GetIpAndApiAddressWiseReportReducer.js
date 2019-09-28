import {
    //api wise report
    GET_API_WISE_REPORT,
    GET_API_WISE_REPORT_SUCCESS,
    GET_API_WISE_REPORT_FAILURE,

    //ip address wise report
    GET_IP_ADDRESS_WISE_REPORT,
    GET_IP_ADDRESS_WISE_REPORT_SUCCESS,
    GET_IP_ADDRESS_WISE_REPORT_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_API_IP_WISE_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    //api wise report
    apiWiseReportData: null,
    apiWiseReportDataFetching: false,

    //ip address wise report
    ipAddressWiseReportData: null,
    ipAddressWiseReportDataFetching: false,

    //for User list
    userData: null,
}

export default function GetIpAndApiAddressWiseReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_API_IP_WISE_DATA:
            return INITIAL_STATE

        //get api wise report list 
        case GET_API_WISE_REPORT:
            return { ...state, apiWiseReportDataFetching: true, apiWiseReportData: null };
        //get api wise report list  success
        case GET_API_WISE_REPORT_SUCCESS:
            return { ...state, apiWiseReportDataFetching: false, apiWiseReportData: action.response };
        //get api wise report list  failure
        case GET_API_WISE_REPORT_FAILURE:
            return { ...state, apiWiseReportDataFetching: false, apiWiseReportData: action.response };

        //get ip address wise report list 
        case GET_IP_ADDRESS_WISE_REPORT:
            return { ...state, ipAddressWiseReportDataFetching: true, ipAddressWiseReportData: null };
        //get ip address wise report list success
        case GET_IP_ADDRESS_WISE_REPORT_SUCCESS:
            return { ...state, ipAddressWiseReportDataFetching: false, ipAddressWiseReportData: action.response };
        //get ip address wise report list failure
        case GET_IP_ADDRESS_WISE_REPORT_FAILURE:
            return { ...state, ipAddressWiseReportDataFetching: false, ipAddressWiseReportData: action.response };

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return { ...state, userData: null };
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return { ...state, userData: action.payload };
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return { ...state, userData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}