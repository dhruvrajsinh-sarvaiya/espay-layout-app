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

    // add
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

} from "Actions/types";

//Set Initial State
const INITIAL_STATE = {
    response: {},
    coinlist: [],
    preference: false,
    submitResponse: {},
    addresses: [],
    formLoading: false,
    listLoading: false,
    preferenceResponse: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {

        // GET_COIN_LIST
        case GET_COIN_LIST:
            return { ...state, formLoading: true, response: {}, submitResponse: {} }
        case GET_COIN_LIST_SUCCESS:
            return { ...state, formLoading: false, coinlist: action.payload, response: {}, submitResponse: {} }
        case GET_COIN_LIST_FAILURE:
            return { ...state, formLoading: false, response: {}, submitResponse: {} }

        // GET GLOBAL PREFERENCE
        case GET_PREFERENCE:
            return { ...state, formLoading: true, preferenceResponse: {}, submitResponse: {} };
        case GET_PREFERENCE_SUCCESS:
            return { ...state, formLoading: false, preference: (action.payload) ? true : false, preferenceResponse: {}, submitResponse: {} };
        case GET_PREFERENCE_FAILURE:
            return { ...state, formLoading: false, preference: false, preferenceResponse: {}, submitResponse: {} };

        // SET GLOBAL PREFERENCE
        case SET_PREFERENCE:
            return { ...state, formLoading: true, submitResponse: {} }
        case SET_PREFERENCE_SUCCESS:
            return { ...state, formLoading: false, preferenceResponse: action.payload, submitResponse: {} }
        case SET_PREFERENCE_FAILURE:
            return { ...state, formLoading: false, submitResponse: {} }

        case FETCH_WITHDRAWALADDRESS:
            return { ...state, listLoading: true, response: {}, submitResponse: {} };
        case FETCH_WITHDRAWALADDRESS_SUCCESS:
            return { ...state, listLoading: false, addresses: action.payload, submitResponse: {} };
        case FETCH_WITHDRAWALADDRESS_FAIL:
            return { ...state, listLoading: false, addresses: [], submitResponse: {} };

        case SUBMIT_WITHDRAWALADDRESSES:
            return { ...state, formLoading: true, submitResponse: {} };
        case SUBMIT_WITHDRAWALADDRESSES_SUCCESS:
            return { ...state, formLoading: false, submitResponse: action.payload };
        case SUBMIT_WITHDRAWALADDRESSES_FAIL:
            return { ...state, formLoading: false, submitResponse: {} };

        case ADDTO_WHITELIST:
            return { ...state, listLoading: true, response: {}, submitResponse: {} };
        case ADDTO_WHITELIST_SUCCESS:
            return { ...state, listLoading: false, response: action.payload, submitResponse: {} };
        case ADDTO_WHITELIST_FAILURE:
            return { ...state, listLoading: false, response: {}, submitResponse: {} };

        case REMOVE_WHITELIST:
            return { ...state, listLoading: true, response: {}, submitResponse: {} };
        case REMOVE_WHITELIST_SUCCESS:
            return { ...state, listLoading: false, response: action.payload, submitResponse: {} };
        case REMOVE_WHITELIST_FAILURE:
            return { ...state, listLoading: false, response: {}, submitResponse: {} };

        case DELETE_ADDRESSES:
            return { ...state, listLoading: true, response: {}, submitResponse: {} };
        case DELETE_ADDRESSES_SUCCESS:
            return { ...state, listLoading: false, response: action.payload, submitResponse: {} };
        case DELETE_ADDRESSES_FAILURE:
            return { ...state, listLoading: false, response: {}, submitResponse: {} };

        default:
            return { ...state };
    }
};
