// Action types for Favorites Module
import {
    // Get Favorite
    GET_FAVOURITES,
    GET_FAVOURITES_SUCCESS,
    GET_FAVOURITES_FAILURE,
    
    // Add FAvorite
    ADD_FAVOURITE,
    ADD_FAVOURITE_SUCCESS,
    ADD_FAVOURITE_FAILURE,
    
    // Remove Favorite
    REMOVE_FAVOURITE,
    REMOVE_FAVOURITE_SUCCESS,
    REMOVE_FAVOURITE_FAILURE,
    
    // Action Logout
    ACTION_LOGOUT,

    // Clear Favorite
    CLEAR_FAVOURITE,

    // Get Margin Favorite  
    GET_MARGIN_FAVOURITES_SUCCESS,
} from '../../actions/ActionTypes';

// Initial state for Favorites Module
const INTIAL_STATE = {

    //Favourite List
    favouriteList: null,
    marginFavouriteList: null,
    isFetching: false,
    favouriteError: false,

    //Add to Favourite
    addFavourite: null,
    isAdding: false,
    addError: false,

    //Remove to Favourite
    removeFavourite: null,
    isRemoving: false,
    removeError: false,
}

export default function favouriteReducer(state = INTIAL_STATE, action) {

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_FAVOURITE: {
            return INTIAL_STATE;
        }

        // Handle Get Favorite method data
        case GET_FAVOURITES: {
            return Object.assign({}, state, {
                favouriteList: null,
                marginFavouriteList: null,
                isFetching: true,
                favouriteError: false,
                addFavourite: null,
                removeFavourite: null,
            })
        }
        // Set Get Favorite success data
        case GET_FAVOURITES_SUCCESS: {
            return Object.assign({}, state, {
                favouriteList: action.payload,
                isFetching: false,
                favouriteError: false
            })
        }
        // Set Get Margin Favorite success data
        case GET_MARGIN_FAVOURITES_SUCCESS: {
            return Object.assign({}, state, {
                marginFavouriteList: action.payload,
                isFetching: false,
                favouriteError: false
            })
        }
        // Set Get Favorite failure data
        case GET_FAVOURITES_FAILURE: {
            return Object.assign({}, state, {
                favouriteList: null,
                marginFavouriteList: null,
                isFetching: false,
                favouriteError: true
            })
        }

        // Handle Add Favorite method data
        case ADD_FAVOURITE: {
            return Object.assign({}, state, {
                addFavourite: null,
                removeFavourite: null,
                isAdding: true,
                addError: false,
                removeFavourite: null,
            })
        }
        // Set Add Favorite success data
        case ADD_FAVOURITE_SUCCESS: {
            return Object.assign({}, state, {
                addFavourite: action.payload,
                isAdding: false,
                addError: false
            })
        }
        // Set Add Favorite failure data
        case ADD_FAVOURITE_FAILURE: {
            return Object.assign({}, state, {
                addFavourite: null,
                isAdding: false,
                addError: true
            })
        }

        // Handle Remove Favorite method data
        case REMOVE_FAVOURITE: {
            return Object.assign({}, state, {
                removeFavourite: null,
                addFavourite: null,
                isRemoving: true,
                removeError: false,
                addFavourite: null,
            })
        }
        // Set Remove Favorite success data
        case REMOVE_FAVOURITE_SUCCESS: {
            return Object.assign({}, state, {
                removeFavourite: action.payload,
                isRemoving: false,
                removeError: false
            })
        }
        // Set Remove Favorite failure data
        case REMOVE_FAVOURITE_FAILURE: {
            return Object.assign({}, state, {
                removeFavourite: null,
                isRemoving: false,
                removeError: true
            })
        }

        // If no actions were found from reducer then return default [existing] state value
        default: return state;
    }
}