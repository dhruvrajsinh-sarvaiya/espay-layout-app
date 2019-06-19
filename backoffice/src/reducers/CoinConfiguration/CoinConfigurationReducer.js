// Create Reducers for Add,Update and List Coin Configuration LIst By Tejas Date : 7/1/2019

// import types
import {
    GET_COIN_CONFIGURATION_LIST,
    GET_COIN_CONFIGURATION_LIST_SUCCESS,
    GET_COIN_CONFIGURATION_LIST_FAILURE,
    ADD_COIN_CONFIGURATION_LIST,
    ADD_COIN_CONFIGURATION_LIST_SUCCESS,
    ADD_COIN_CONFIGURATION_LIST_FAILURE,
    UPDATE_COIN_CONFIGURATION_LIST,
    UPDATE_COIN_CONFIGURATION_LIST_SUCCESS,
    UPDATE_COIN_CONFIGURATION_LIST_FAILURE,
    //added by parth andhariya
    ADD_CURRENCY_LOGO,
    ADD_CURRENCY_LOGO_SUCCESS,
    ADD_CURRENCY_LOGO_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    coinConfigurationList: [],
    addcoinConfigurationList: [],
    updatecoinConfigurationList: [],
    loading: false,
    error: [],
    addError: [],
    updateError: [],
    updateLoading: false,
    addLoading: false,
    //added by parth andhariya
    CurrencyLogo: {},
    CurrencyLogoLoading: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get Coin Configuration List
        case GET_COIN_CONFIGURATION_LIST:
            return { ...state, loading: true, };

        // set Data Of Coin Configuration List
        case GET_COIN_CONFIGURATION_LIST_SUCCESS:
            return { ...state, coinConfigurationList: action.payload, loading: false, error: [], };

        // Display Error for Coin Configuration List failure
        case GET_COIN_CONFIGURATION_LIST_FAILURE:

            return { ...state, loading: false, coinConfigurationList: [], error: action.payload };

        // Add Coin Configuration List
        case ADD_COIN_CONFIGURATION_LIST:
            return { ...state, addLoading: true };

        // set Data Of Add Coin Configuration List
        case ADD_COIN_CONFIGURATION_LIST_SUCCESS:
            return { ...state, addcoinConfigurationList: action.payload, addLoading: false, addError: [] };

        // Display Error for Add Coin Configuration List failure
        case ADD_COIN_CONFIGURATION_LIST_FAILURE:
            return { ...state, addLoading: false, addcoinConfigurationList: [], addError: action.payload };

        // update Coin Configuration List
        case UPDATE_COIN_CONFIGURATION_LIST:
            return { ...state, updateLoading: true };

        // set Data Of update Coin Configuration List
        case UPDATE_COIN_CONFIGURATION_LIST_SUCCESS:
            return { ...state, updatecoinConfigurationList: action.payload, updateLoading: false, updateError: [] };

        // Display Error for update Coin Configuration List failure
        case UPDATE_COIN_CONFIGURATION_LIST_FAILURE:

            return { ...state, updateLoading: false, updatecoinConfigurationList: [], updateError: action.payload };

        //added by parth andhariya
        // update Coin Configuration List
        case ADD_CURRENCY_LOGO:
            return { ...state, CurrencyLogoLoading: true };

        // set Data Of update Coin Configuration List
        case ADD_CURRENCY_LOGO_SUCCESS:
            return { ...state, CurrencyLogo: action.payload, CurrencyLogoLoading: false };

        // Display Error for update Coin Configuration List failure
        case ADD_CURRENCY_LOGO_FAILURE:
            return { ...state, CurrencyLogoLoading: false, CurrencyLogo: action.payload };

        default:
            return { ...state };
    }
}