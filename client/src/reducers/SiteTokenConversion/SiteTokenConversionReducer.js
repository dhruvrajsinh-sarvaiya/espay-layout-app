// Reducer For Handle Site Token Conversion By Tejas 11/2/2019
// import types
import {
    GET_SITE_TOKEN,
    GET_SITE_TOKEN_SUCCESS,
    GET_SITE_TOKEN_FAILURE,
    GET_SITE_TOKEN_CALCULATION,
    GET_SITE_TOKEN_CALCULATION_SUCCESS,
    GET_SITE_TOKEN_CALCULATION_FAILURE,
    SITE_TOKEN_CONVERSION,
    SITE_TOKEN_CONVERSION_SUCCESS,
    SITE_TOKEN_CONVERSION_FAILURE,
    //added by parth andhariya
    GET_BASE_MARKET_CURRENCY,
    GET_BASE_MARKET_CURRENCY_SUCCESS,
    GET_BASE_MARKET_CURRENCY_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    siteToken: [],
    loading: false,
    errorCode: 0,
    siteTokenCalculation: null,
    loadingCalc: false,
    siteTokenConversion: [],
    loadingConversion: false,
    calulcationError: [],
    error: [],
    conversionError: [],
    //added by parth andhariya 
    MarginCurrency: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get Site Token
        case GET_SITE_TOKEN:
            return { ...state, loading: true, conversionError: [] };

        // set Data Of Site Token
        case GET_SITE_TOKEN_SUCCESS:
            return { ...state, siteToken: action.payload.Response, errorCode: action.payload.ErrorCode, loading: false, error: [], conversionError: [] };

        // Display Error for Site Token failure
        case GET_SITE_TOKEN_FAILURE:

            return { ...state, loading: false, siteToken: [], errorCode: 0, error: action.payload, conversionError: [] };

        // get Site Token Calculation
        case GET_SITE_TOKEN_CALCULATION:
            return { ...state, loadingCalc: true, conversionError: [], calulcationError: [] };

        // set Data Of Site Token Calculation
        case GET_SITE_TOKEN_CALCULATION_SUCCESS:
            return { ...state, siteTokenCalculation: action.payload.response, loadingCalc: false, calulcationError: [], conversionError: [] };

        // Display Error for Site Token Calculation failure
        case GET_SITE_TOKEN_CALCULATION_FAILURE:

            return { ...state, loadingCalc: false, siteTokenCalculation: null, errorCode: 0, calulcationError: action.payload, conversionError: [] };

        // get Site Token Conversion
        case SITE_TOKEN_CONVERSION:
            return { ...state, loadingConversion: true, calulcationError: [], conversionError: [] };

        // set Data Of Site Token Conversion
        case SITE_TOKEN_CONVERSION_SUCCESS:
            return { ...state, siteTokenConversion: action.payload, errorCode: action.payload.ErrorCode, loadingConversion: false, conversionError: [], calulcationError: [] };

        // Display Error for Site Token Conversion failure
        case SITE_TOKEN_CONVERSION_FAILURE:

            return { ...state, loadingConversion: false, siteTokenConversion: [], errorCode: 0, conversionError: action.payload, calulcationError: [] };

        //added by parth andhariya
        // get Site Token Conversion
        case GET_BASE_MARKET_CURRENCY:
            return { ...state, loading: true, MarginCurrency: {} };

        // set Data Of Site Token Conversion
        case GET_BASE_MARKET_CURRENCY_SUCCESS:
            return { ...state, MarginCurrency: action.payload.Response, loading: false };

        // Display Error for Site Token Conversion failure
        case GET_BASE_MARKET_CURRENCY_FAILURE:

            return { ...state, loading: false, MarginCurrency: [] };

        default:
            return { ...state };
    }
};
