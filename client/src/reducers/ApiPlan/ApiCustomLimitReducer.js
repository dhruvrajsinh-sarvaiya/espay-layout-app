// Reducer For Handle APi custom Limits  By Tejas 14/3/2019
// import types
import {
    GET_CUSTOM_LIMITS,
    GET_CUSTOM_LIMITS_SUCCESS,
    GET_CUSTOM_LIMITS_FAILURE,
    SET_CUSTOM_LIMITS,
    SET_CUSTOM_LIMITS_SUCCESS,
    SET_CUSTOM_LIMITS_FAILURE,
    UPDATE_CUSTOM_LIMITS,
    UPDATE_CUSTOM_LIMITS_SUCCESS,
    UPDATE_CUSTOM_LIMITS_FAILURE,
    SET_DEFAULT_CUSTOM_LIMITS,
    SET_DEFAULT_CUSTOM_LIMITS_SUCCESS,
    SET_DEFAULT_CUSTOM_LIMITS_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    getCustomLimitData: null,
    getCustomLimitLoading: false,
    getCustomLimitError: [],

    setCustomLimitData: [],
    setCustomLimitLoading: false,
    setCustomLimitError: [],

    updateCustomLimitData: [],
    updateCustomLimitLoading: false,
    updateCustomLimitError: [],

    setDefaultLimit: [],
    setDefaultLimitLoading: false,
    setDefaultLimitError: [],
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    switch (action.type) {
        // get Get API Custom Limit
        case GET_CUSTOM_LIMITS:
            return {
                ...state,
                getCustomLimitData: null,
                getCustomLimitLoading: true,
                getCustomLimitError: [],
            };

        // set Data Of Get API Custom Limit
        case GET_CUSTOM_LIMITS_SUCCESS:
            return { ...state, getCustomLimitData: action.payload.Response, getCustomLimitLoading: false, getCustomLimitError: [] };

        // Display Error for Get API Custom Limit failure
        case GET_CUSTOM_LIMITS_FAILURE:

            return { ...state, getCustomLimitLoading: false, getCustomLimitData: null, getCustomLimitError: action.payload };

        // get Set Api Custom Limits
        case SET_CUSTOM_LIMITS:
            return {
                ...state,
                setCustomLimitData: [],
                setCustomLimitLoading: true,
                setCustomLimitError: [],
            };

        // set Data Of Set Api Custom Limits
        case SET_CUSTOM_LIMITS_SUCCESS:
            return { ...state, setCustomLimitData: action.payload, setCustomLimitError: [], setCustomLimitLoading: false };

        // Display Error for Set Api Custom Limits failure
        case SET_CUSTOM_LIMITS_FAILURE:

            return { ...state, setCustomLimitLoading: false, setCustomLimitData: [], setCustomLimitError: action.payload };

        //  update Custom Limit
        case UPDATE_CUSTOM_LIMITS:
            return {
                ...state,
                updateCustomLimitData: [],
                updateCustomLimitLoading: true,
                updateCustomLimitError: [],
            };

        // set Data Of update Custom Limit
        case UPDATE_CUSTOM_LIMITS_SUCCESS:
            return {
                ...state, updateCustomLimitData: action.payload, updateCustomLimitError: [], updateCustomLimitLoading: false
            };

        // Display Error for update Custom Limit failure
        case UPDATE_CUSTOM_LIMITS_FAILURE:

            return { ...state, updateCustomLimitLoading: false, updateCustomLimitData: [], updateCustomLimitError: action.payload };

        // set default limit
        case SET_DEFAULT_CUSTOM_LIMITS:
            return {
                ...state,
                setDefaultLimit: [],
                setDefaultLimitLoading: true,
                setDefaultLimitError: [],
            };

        // set Data Of set default limit
        case SET_DEFAULT_CUSTOM_LIMITS_SUCCESS:
            return {
                ...state, setDefaultLimit: action.payload, setDefaultLimitError: [], setDefaultLimitLoading: false
            };

        // Display Error for set default limit failure
        case SET_DEFAULT_CUSTOM_LIMITS_FAILURE:

            return { ...state, setDefaultLimitLoading: false, setDefaultLimit: [], setDefaultLimitError: action.payload };


        default:
            return { ...state };
    }
};
