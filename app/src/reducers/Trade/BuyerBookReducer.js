// Action types for Buyer Book
import {
    // Fetch Buyer Book List
    FETCH_BUYER_BOOK_LIST,
    FETCH_BUYER_BOOK_LIST_SUCCESS,
    FETCH_BUYER_BOOK_LIST_FAILURE,

    // Action logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial state for Buyer Book
const INTIAL_STATE = {

    // Buyer Book List
    buyerBookData: null,
    isFetchingBuyerBook: false,
    errorBuyerBook: false,
}

export default function buyerBookReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Buyer Book List method data
        case FETCH_BUYER_BOOK_LIST:
            return {
                ...state,
                buyerBookData: null,
                isFetchingBuyerBook: true,
                errorBuyerBook: false,
            }
        // Set Buyer Book List success data
        case FETCH_BUYER_BOOK_LIST_SUCCESS:
            return {
                ...state,
                buyerBookData: action.data,
                isFetchingBuyerBook: false,
                errorBuyerBook: false,
            }
        // Set Buyer Book List failure data
        case FETCH_BUYER_BOOK_LIST_FAILURE:
            return {
                ...state,
                buyerBookData: null,
                isFetchingBuyerBook: false,
                errorBuyerBook: true
            }

        // If no actions were found from reducer then return default [existing] state value
        default:
            return state;
    }
}