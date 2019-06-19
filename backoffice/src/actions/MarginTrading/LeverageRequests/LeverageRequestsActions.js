/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Request action methods
    Date : 12-09-2019
*/
import {
    // list requests
    LEVERAGE_REQUEST_LIST,
    LEVERAGE_REQUEST_LIST_SUCCESS,
    LEVERAGE_REQUEST_LIST_FAILURE,
    // accpet or reject request
    ACCEPTREJECT_LEVERAGEREQUEST,
    ACCEPTREJECT_LEVERAGEREQUEST_SUCCESS,
    ACCEPTREJECT_LEVERAGEREQUEST_FAILURE
} from "../../types";

/* get a list of leverage pending requests */
export const getLeverageRequests = (request) => ({
    type: LEVERAGE_REQUEST_LIST,
    request: request
});
export const getLeverageRequestsSuccess = (response) => ({
    type: LEVERAGE_REQUEST_LIST_SUCCESS,
    payload: response
});
export const getLeverageRequestsFailure = (error) => ({
    type: LEVERAGE_REQUEST_LIST_FAILURE,
    payload: error
});

/* Accept or Reject pending leverage request */
export const acceptRejectLeverageRequest = (request) => ({
    type: ACCEPTREJECT_LEVERAGEREQUEST,
    request: request
})
export const acceptRejectLeverageRequestSuccess = (response) => ({
    type: ACCEPTREJECT_LEVERAGEREQUEST_SUCCESS,
    payload: response
})
export const acceptRejectLeverageRequestFailure = (error) => ({
    type: ACCEPTREJECT_LEVERAGEREQUEST_FAILURE,
    payload: error
})