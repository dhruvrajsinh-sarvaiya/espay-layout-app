// Reducer For Handle Api Response By Tejas
// import types
import {
    GET_API_RESPONSE_LIST,
    GET_API_RESPONSE_LIST_SUCCESS,
    GET_API_RESPONSE_LIST_FAILURE,
    ADD_API_RESPONSE_LIST,
    ADD_API_RESPONSE_LIST_SUCCESS,
    ADD_API_RESPONSE_LIST_FAILURE,
    UPDATE_API_RESPONSE_LIST,
    UPDATE_API_RESPONSE_LIST_SUCCESS,
    UPDATE_API_RESPONSE_LIST_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiResponseList: [],
    apiResponseListLoading:false,
    addResponseList: [],
    updateResponseList: [],
    addError: [],
    updateError: [],
    updateLoading: false,
    addLoading: false,
    loading: false,
    error: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // Add Api Response Config
        case GET_API_RESPONSE_LIST:
            return { ...state, apiResponseListLoading: true };

        // set Data Of Add Api Response Config
        case GET_API_RESPONSE_LIST_SUCCESS:
            return { ...state, apiResponseList: action.payload, apiResponseListLoading: false, error: [] };

        // Display Error for Add Api Response Config failure
        case GET_API_RESPONSE_LIST_FAILURE:
            return { ...state, apiResponseListLoading: false, apiResponseList: [], error: action.payload };


        // Add Api Response Config
        case ADD_API_RESPONSE_LIST:
            return { ...state, addLoading: true };

        // set Data Of Add Api Response Config
        case ADD_API_RESPONSE_LIST_SUCCESS:
            return { ...state, addResponseList: action.payload, addLoading: false, addError: [] };

        // Display Error for Add Api Response Config failure
        case ADD_API_RESPONSE_LIST_FAILURE:
            return { ...state, addLoading: false, addResponseList: [], addError: action.payload };

        // update Api Response Config
        case UPDATE_API_RESPONSE_LIST:
            return { ...state, updateLoading: true };

        // set Data Of update Api Response Config
        case UPDATE_API_RESPONSE_LIST_SUCCESS:
            return { ...state, updateResponseList: action.payload, updateLoading: false, updateError: [] };

        // Display Error for update Api Response Config failure
        case UPDATE_API_RESPONSE_LIST_FAILURE:

            return { ...state, updateLoading: false, updateResponseList: [], updateError: action.payload };

        default:
            return { ...state };
    }
};
