// Action types for Seller Book
import {
    // Fetch Seller Book List
    FETCH_SELLER_BOOK_LIST,
    FETCH_SELLER_BOOK_LIST_SUCCESS,
    FETCH_SELLER_BOOK_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial State for Seller Book
const INTIAL_STATE = {

    // Seller Book List
    sellerBookData: null,
    isFetchingSellerBook: false,
    errorSellerBook: false,
}

export default function sellerBookReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Seller Book method data
        case FETCH_SELLER_BOOK_LIST:
            return {
                ...state,
                sellerBookData: null,
                isFetchingSellerBook: true,
                errorSellerBook: false,
            }
        // Set Seller Book success data
        case FETCH_SELLER_BOOK_LIST_SUCCESS:
            return {
                ...state,
                sellerBookData: action.data,
                isFetchingSellerBook: false,
                errorSellerBook: false,
            }
        // Set Seller Book failure data
        case FETCH_SELLER_BOOK_LIST_FAILURE:
            return {
                ...state,
                sellerBookData: null,
                isFetchingSellerBook: false,
                errorSellerBook: true
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}