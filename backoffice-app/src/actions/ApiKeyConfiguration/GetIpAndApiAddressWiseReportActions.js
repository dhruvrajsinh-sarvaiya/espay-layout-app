import {
    //api wise report
    GET_API_WISE_REPORT,
    GET_API_WISE_REPORT_SUCCESS,
    GET_API_WISE_REPORT_FAILURE,

    //ip address wise report
    GET_IP_ADDRESS_WISE_REPORT,
    GET_IP_ADDRESS_WISE_REPORT_SUCCESS,
    GET_IP_ADDRESS_WISE_REPORT_FAILURE,

    //clear data
    CLEAR_API_IP_WISE_DATA,
} from "../ActionTypes";

//Redux action get api wise report list 
export const getApiWiseReport = (request) => ({
    type: GET_API_WISE_REPORT,
    payload: request
});
//Redux action get api wise report list success
export const getApiWiseReportSuccess = (response) => ({
    type: GET_API_WISE_REPORT_SUCCESS,
    response: response
});
//Redux action get api wise report list Faillure
export const getApiWiseReportFailure = (error) => ({
    type: GET_API_WISE_REPORT_FAILURE,
    response: error
});

//Redux action get ip address wise report list 
export const getIpAddressWiseReport = (request) => ({
    type: GET_IP_ADDRESS_WISE_REPORT,
    payload: request
});
//Redux action get ip address wise report list success
export const getIpAddressWiseReportSuccess = (response) => ({
    type: GET_IP_ADDRESS_WISE_REPORT_SUCCESS,
    response: response
});
//Redux action get ip address wise report list Faillure
export const getIpAddressWiseReportFailure = (error) => ({
    type: GET_IP_ADDRESS_WISE_REPORT_FAILURE,
    response: error
});

//Redux action  for clear response
export const clearIpAndAddressWiseData = () => ({
    type: CLEAR_API_IP_WISE_DATA,
});

