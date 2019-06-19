import {
    // GET_COIN_LIST
    GET_COIN_LIST,
    GET_COIN_LIST_SUCCESS,
    GET_COIN_LIST_FAILURE,
    // GET GLOBAL PREFERENCE
    GET_PREFERENCE,
    GET_PREFERENCE_SUCCESS,
    GET_PREFERENCE_FAILURE,
    // SET GLOBAL PREFERENCE
    SET_PREFERENCE,
    SET_PREFERENCE_SUCCESS,
    SET_PREFERENCE_FAILURE,
    //list
    FETCH_WITHDRAWALADDRESS,
    FETCH_WITHDRAWALADDRESS_SUCCESS,
    FETCH_WITHDRAWALADDRESS_FAIL,
    //add block
    SUBMIT_WITHDRAWALADDRESSES,
    SUBMIT_WITHDRAWALADDRESSES_SUCCESS,
    SUBMIT_WITHDRAWALADDRESSES_FAIL,
    // add to whitelist
    ADDTO_WHITELIST,
    ADDTO_WHITELIST_SUCCESS,
    ADDTO_WHITELIST_FAILURE,
    // remove form whitelist
    REMOVE_WHITELIST,
    REMOVE_WHITELIST_SUCCESS,
    REMOVE_WHITELIST_FAILURE,
    // delete from whitelist
    DELETE_ADDRESSES,
    DELETE_ADDRESSES_SUCCESS,
    DELETE_ADDRESSES_FAILURE,
} from "../types";

// get currency
export const getCurrency = () => ({
    type: GET_COIN_LIST
});
export const getCurrencySuccess = (response) => ({
    type: GET_COIN_LIST_SUCCESS,
    payload: response
})
export const getCurrencyFailure = (error) => ({
    type: GET_COIN_LIST_FAILURE,
    payload: error
})

// GET PREFERENCE
export const getPreference = () => ({
    type: GET_PREFERENCE
});
export const getPreferenceSuccess = (response) => ({
    type: GET_PREFERENCE_SUCCESS,
    payload: response
});
export const getPreferenceFailure = (error) => ({
    type: GET_PREFERENCE_FAILURE,
    payload: error
});

// SET PREFERENCE
export const setPreference = (preference) => ({
    type: SET_PREFERENCE,
    preference: preference
});
export const setPreferenceSuccess = (response) => ({
    type: SET_PREFERENCE_SUCCESS,
    payload: response
});
export const setPreferenceFailure = (error) => ({
    type: SET_PREFERENCE_FAILURE,
    payload: error
});

/* ADD */
export const onSubmitWhithdrawalAddress = (request) => ({
    type: SUBMIT_WITHDRAWALADDRESSES,
    request: request
});
export const onSubmitWhithdrawalAddressSuccess = (response) => ({
    type: SUBMIT_WITHDRAWALADDRESSES_SUCCESS,
    payload: response
});
export const onSubmitWhithdrawalAddressFail = (error) => ({
    type: SUBMIT_WITHDRAWALADDRESSES_FAIL,
    payload: error
});

/* LIST */
export const getAllWhithdrawalAddress = () => ({
    type: FETCH_WITHDRAWALADDRESS
});
export const getAllWhithdrawalAddressSuccess = (response) => ({
    type: FETCH_WITHDRAWALADDRESS_SUCCESS,
    payload: response
});
export const getAllWhithdrawalAddressFail = (error) => ({
    type: FETCH_WITHDRAWALADDRESS_FAIL,
    payload: error
});

/* ADD BULK WHITELIST */
export const addToWhitelist = (request) => ({
    type: ADDTO_WHITELIST,
    request: request
});
export const addToWhitelistSuccess = (response) => ({
    type: ADDTO_WHITELIST_SUCCESS,
    payload: response
});
export const addToWhitelistFailure = (error) => ({
    type: ADDTO_WHITELIST_FAILURE,
    payload: error
});

/* REMOVE BULK WHITELIST */
export const removeWhitelist = (request) => ({
    type: REMOVE_WHITELIST,
    request: request
});
export const removeWhitelistSuccess = (response) => ({
    type: REMOVE_WHITELIST_SUCCESS,
    payload: response
});
export const removeWhitelistFailure = (error) => ({
    type: REMOVE_WHITELIST_FAILURE,
    payload: error
});

/* DELTE BULK RECORDS */
export const deleteAddress = (request) => ({
    type: DELETE_ADDRESSES,
    request: request
});
export const deleteAddressSuccess = (response) => ({
    type: DELETE_ADDRESSES_SUCCESS,
    payload: response
});
export const deleteAddressFailure = (error) => ({
    type: DELETE_ADDRESSES_FAILURE,
    payload: error
});