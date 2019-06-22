// Action types for Open Order
import {
    // Fetch Open Order History
    FETCH_OPEN_ORDER_HISTORY,
    FETCH_OPEN_ORDER_SUCCESS,
    FETCH_OPEN_ORDER_FAILURE,

    // Cancel Open Order
    CANCEL_OPEN_ORDER,
    CANCEL_OPEN_ORDER_SUCCESS,
    CANCEL_OPEN_ORDER_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Cancel Open Order
    CLEAR_CANCEL_OPEN_ORDER,

    // Clear Open Order
    CLEAR_OPEN_ORDER,
} from '../../actions/ActionTypes';

// Initial State for Open Order
const INTIAL_STATE = {

    // Open Order
    isOpenOrder: false,
    openOrder: null,
    errorOpenOrder: false,

    // Cancel Open Order
    cancelopenorderdata: null,
    isFetchingCancelOpenOrder: false,
    errorCancelOpenOrder: false,
}

export default function openOrderReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_OPEN_ORDER: {
            return INTIAL_STATE;
        }

        // Handle Open Order History method data
        case FETCH_OPEN_ORDER_HISTORY:
            return Object.assign({}, state, {
                isOpenOrder: true,
                openOrder: null,
                cancelopenorderdata: null,
                errorOpenOrder: false,
            });
        // Set Open Order History success data
        case FETCH_OPEN_ORDER_SUCCESS:
            return Object.assign({}, state, {
                isOpenOrder: false,
                openOrder: action.data,
                errorOpenOrder: false,
            });
        // Set Open Order History failure data
        case FETCH_OPEN_ORDER_FAILURE:
            return Object.assign({}, state, {
                isOpenOrder: false,
                openOrder: null,
                errorOpenOrder: true,
            });

        // Handle Cancel Open Order method data
        case CANCEL_OPEN_ORDER:
            return {
                ...state,
                cancelopenorderdata: null,
                isFetchingCancelOpenOrder: true
            }
        // Set Cancel Open Order success data
        case CANCEL_OPEN_ORDER_SUCCESS:
            return {
                ...state,
                cancelopenorderdata: action.data,
                isFetchingCancelOpenOrder: false
            }
        // Set Cancel Open Order failure data
        case CANCEL_OPEN_ORDER_FAILURE:
            return {
                ...state,
                cancelopenorderdata: null,
                isFetchingCancelOpenOrder: false,
                errorCancelOpenOrder: true
            }
        // Clear Cancel Open Order Data
        case CLEAR_CANCEL_OPEN_ORDER: {
            return {
                ...state,
                cancelopenorderdata: null,
            }
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}