import {
    //Add Currecny Logo
    ADD_CURRENCY_LOGO,
    ADD_CURRENCY_LOGO_SUCCESS,
    ADD_CURRENCY_LOGO_FAILURE,
} from "../ActionTypes";

/**
 * Redux Action To Add Currecny Logo
 */
export const addCurrencyLogo = (data) => ({
    type: ADD_CURRENCY_LOGO,
    payload: data
});

/**
 * Redux Action To Add Currecny Logo Success
 */
export const addCurrencyLogoSuccess = (data) => ({
    type: ADD_CURRENCY_LOGO_SUCCESS,
    payload: data
});

/**
 * Redux Action To Add Currecny Logo Failure
 */
export const addCurrencyLogoFailure = (error) => ({
    type: ADD_CURRENCY_LOGO_FAILURE,
    payload: error
});
