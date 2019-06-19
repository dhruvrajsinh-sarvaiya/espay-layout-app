/**
 * Auther : Salim Deraiya
 * Created : 08/12/2018
 * Device Authorize Actions
 */

import {
    DEVICE_AUTHORIZE,
    DEVICE_AUTHORIZE_SUCCESS,
    DEVICE_AUTHORIZE_FAILURE
} from "../types";

/**
 * Redux Action To Device Authorize
 */
export const deviceAuthorize = (data) => ({
    type: DEVICE_AUTHORIZE,
    payload: data
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