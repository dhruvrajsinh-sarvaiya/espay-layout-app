// Action types for Coin List Request
import {
    // Get Coin List Request
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    // Add Coin List Request
    ADD_COINLIST_REQUEST,
    ADD_COINLIST_REQUEST_SUCCESS,
    ADD_COINLIST_REQUEST_FAILURE,

    // Add Coin List Request Clear
    ADD_COINLIST_REQUEST_CLEAR,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// initial state for Coin List Request
const INIT_STATE = {
    // Coin List
    coinFieldsList: null,
    addCoinData: null,
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        // Handle Coin List Request method data
        case GET_COINLIST_REQUEST:
            return { ...state, loading: true };

        // Set Coin List Request success data
        case GET_COINLIST_REQUEST_SUCCESS:
            return { ...state, loading: false, coinFieldsList: action.payload };

        // Set Coin List Request failure data
        case GET_COINLIST_REQUEST_FAILURE:
            return { ...state, loading: false };

        // Handle Add Coin List Request method data
        case ADD_COINLIST_REQUEST:
            return { ...state, loading: true, addCoinData: null };

        // Set Add Coin List Request success data
        case ADD_COINLIST_REQUEST_SUCCESS:
            return { ...state, loading: false, addCoinData: action.payload };

        // Set Add Coin List Request failure data
        case ADD_COINLIST_REQUEST_FAILURE:
            return { ...state, loading: false, addCoinData: action.payload };

        // Clear Add Coin List Request method data
        case ADD_COINLIST_REQUEST_CLEAR:
            return { ...state, loading: false, addCoinData: null };

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
