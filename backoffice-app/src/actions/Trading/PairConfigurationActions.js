import {
    /* Pair Configuration List  */
    GET_PAIR_CONFIGURATION_LIST,
    GET_PAIR_CONFIGURATION_LIST_SUCCESS,
    GET_PAIR_CONFIGURATION_LIST_FAILURE,

    /* Market Currency List */
    GET_MARKET_CURRENCY,
    GET_MARKET_CURRENCY_SUCCESS,
    GET_MARKET_CURRENCY_FAILURE,

    /* Pair Currency List */
    GET_PAIR_CURRENCY,
    GET_PAIR_CURRENCY_SUCCESS,
    GET_PAIR_CURRENCY_FAILURE,

    //add pair configuration 
    ADD_PAIR_CONFIGURATION,
    ADD_PAIR_CONFIGURATION_SUCCESS,
    ADD_PAIR_CONFIGURATION_FAILURE,

    //edit pair configuration 
    EDIT_PAIR_CONFIGURATION,
    EDIT_PAIR_CONFIGURATION_SUCCESS,
    EDIT_PAIR_CONFIGURATION_FAILURE,

    //clear data
    CLEAR_PAIR_DATA,
    CLEAR_PAIRCONFIGURATION_DATA,
} from '../ActionTypes';
import { action } from '../GlobalActions';

/* Actions for Pair Configuration List */
export function getPairConfigurationList(payload = {}) {
    /* for loading */
    return action(GET_PAIR_CONFIGURATION_LIST, { payload })
}
export function getPairConfigurationListSuccess(data) {
    /* for success call */
    return action(GET_PAIR_CONFIGURATION_LIST_SUCCESS, { data })
}
export function getPairConfigurationListFailure() {
    /* for failure call */
    return action(GET_PAIR_CONFIGURATION_LIST_FAILURE)
}

/* Actions for Market Currency */
export function getMarketCurrencyList(payload = {}) {
    /* for loading */
    return action(GET_MARKET_CURRENCY, { payload })
}
export function getMarketCurrencyListSuccess(data) {
    /* for success call */
    return action(GET_MARKET_CURRENCY_SUCCESS, { data })
}
export function getMarketCurrencyListFailure() {
    /* for failure call */
    return action(GET_MARKET_CURRENCY_FAILURE)
}

/* Actions for Pair Currency  */
export function getPairCurrencyList(payload) {
    /* for loading */
    return action(GET_PAIR_CURRENCY, { payload })
}
export function getPairCurrencyListSuccess(data) {
    /* for success call */
    return action(GET_PAIR_CURRENCY_SUCCESS, { data })
}
export function getPairCurrencyListFailure() {
    /* for failure call */
    return action(GET_PAIR_CURRENCY_FAILURE)
}

/* Actions for Add Pair Cofiguration Record */
export function addPairConfiguration(payload) {
    /* for loading */
    return action(ADD_PAIR_CONFIGURATION, { payload })
}
export function addPairConfigurationSuccess(data) {
    /* for success call */
    return action(ADD_PAIR_CONFIGURATION_SUCCESS, { data })
}
export function addPairConfigurationFailure() {
    /* for failure call */
    return action(ADD_PAIR_CONFIGURATION_FAILURE)
}

/* Actions for Add Pair Cofiguration Record */
export function editPairConfiguration(payload) {
    /* for loading */
    return action(EDIT_PAIR_CONFIGURATION, { payload })
}
export function editPairConfigurationSuccess(data) {
    /* for success call */
    return action(EDIT_PAIR_CONFIGURATION_SUCCESS, { data })
}
export function editPairConfigurationFailure() {
    /* for failure call */
    return action(EDIT_PAIR_CONFIGURATION_FAILURE)
}

export function clearNewPairData() {
    /* Clear Pair Data */
    return action(CLEAR_PAIR_DATA)
}

//clear pair config data
export function clearPairConfigurationData() {
    return action(CLEAR_PAIRCONFIGURATION_DATA)
}
