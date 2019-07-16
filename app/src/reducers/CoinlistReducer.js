// Action types for Coin List
import {
    // Get Coin List
    GET_COINLIST,
    GET_COINLIST_SUCCESS,
    GET_COINLIST_FAILURE,

    // Get Coin List Clear
    GET_COINLIST_CLEAR,

    // Action Logout
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// initial state for CoinList
const INTIAL_STATE = {
    data: null,
    loading: false,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Coin List method data
        case GET_COINLIST:
            return { ...state, loading: true, data: null };

        // Set Coin List success data
        case GET_COINLIST_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        // Set Coin List failure data
        case GET_COINLIST_FAILURE:
            return { ...state, loading: false, };

        // clear Coinlist
        case GET_COINLIST_CLEAR:
            return { ...state, loading: false, data: null };

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
