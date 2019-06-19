/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount 2FA Auth Dashboard Actions
*/
import {
    TWO_FA_DASHBOARD,
    TWO_FA_DASHBOARD_SUCCESS,
    TWO_FA_DASHBOARD_FAILURE
} from "../types";

//For Display 2FA Auth Data
/**
 * Redux Action To Display 2FA Auth Data
 */

export const get2FaAuthData = () => ({
    type: TWO_FA_DASHBOARD
});

/**
 * Redux Action To Display 2FA Auth Data Success
 */
export const get2FaAuthDataSuccess = (response) => ({
    type: TWO_FA_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display 2FA Auth Data Failure
 */
export const get2FaAuthDataFailure = (error) => ({
    type: TWO_FA_DASHBOARD_FAILURE,
    payload: error
});