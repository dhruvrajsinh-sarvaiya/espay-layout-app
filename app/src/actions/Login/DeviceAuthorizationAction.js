import {
    //Device Authorized
    DEVICE_AUTHORIZE,
    DEVICE_AUTHORIZE_SUCCESS,
    DEVICE_AUTHORIZE_FAILURE
} from "../ActionTypes";
/**
 * Redux Action To Device Authorize
 */
export const deviceAuthorize = (reqObj) => ({
    type: DEVICE_AUTHORIZE,
    payload: reqObj
});

/**
 * Redux Action To Device Authorize Success
 */
export const deviceAuthorizeSuccess = (data) => ({
    type: DEVICE_AUTHORIZE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Device Authorize Failure
 */
export const deviceAuthorizeFailure = (error) => ({
    type: DEVICE_AUTHORIZE_FAILURE,
    payload: error
});