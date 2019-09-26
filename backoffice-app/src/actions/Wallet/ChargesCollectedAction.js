import {
    //Charges Collected List
    GET_CHARGECOLLECTED_REPORT,
    GET_CHARGECOLLECTED_REPORT_SUCCESS,
    GET_CHARGECOLLECTED_REPORT_FAILURE,

    //clear data
    CLEAR_CHARGES_COLLECTED,
} from '../ActionTypes'

// Redux action get Charges Collected List
export const getChargeCollectedReport = (request) => ({
    type: GET_CHARGECOLLECTED_REPORT,
    payload: request
});
// Redux action get Charges Collected List success
export const getChargeCollectedReportSuccess = (response) => ({
    type: GET_CHARGECOLLECTED_REPORT_SUCCESS,
    payload: response
});
// Redux action get Charges Collected List Failure
export const getChargeCollectedReportFailure = (error) => ({
    type: GET_CHARGECOLLECTED_REPORT_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearChargesCollected = () => ({
    type: CLEAR_CHARGES_COLLECTED,
});