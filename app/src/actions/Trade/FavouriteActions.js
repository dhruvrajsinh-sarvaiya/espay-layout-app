import { action } from "../GlobalActions";
import {
    // Get Favorite
    GET_FAVOURITES,
    GET_FAVOURITES_SUCCESS,
    GET_FAVOURITES_FAILURE,

    // Add Favorite
    ADD_FAVOURITE,
    ADD_FAVOURITE_SUCCESS,
    ADD_FAVOURITE_FAILURE,

    // Remove Favorite
    REMOVE_FAVOURITE,
    REMOVE_FAVOURITE_SUCCESS,
    REMOVE_FAVOURITE_FAILURE,

    // Clear Favorite
    CLEAR_FAVOURITE,

    // Get Margin Favorite
    GET_MARGIN_FAVOURITES_SUCCESS
} from "../ActionTypes";

// Redux action to Get Favorites
export function getFavourites(payload) { return action(GET_FAVOURITES, { payload }); }

// Redux action to Get Favorites Success
export function getFavouritesSuccess(payload) { return action(GET_FAVOURITES_SUCCESS, { payload }); }

// Redux action to Get Margin Favorites Success
export function getMarginFavouritesSuccess(payload) { return action(GET_MARGIN_FAVOURITES_SUCCESS, { payload }); }

// Redux action to Get Favorites Failure
export function getFavouritesFailure() { return action(GET_FAVOURITES_FAILURE); }

// Redux action to Clear Favorite
export function clearFavourites() { return action(CLEAR_FAVOURITE) };

// Redux action for Add to Favorite
export function addFavourite(payload) {
    return action(ADD_FAVOURITE, { payload });
}

// Redux action for Add to Favorite Success
export function addFavouriteSuccess(payload) {
    return action(ADD_FAVOURITE_SUCCESS, { payload });
}

// Redux action for Add to Favorite Failure
export function addFavouriteFailure() {
    return action(ADD_FAVOURITE_FAILURE);
}

// Redux action for Remove to Favorite
export function removeFavourite(payload) {
    return action(REMOVE_FAVOURITE, { payload });
}

// Redux action for Remove to Favorite Success
export function removeFavouriteSuccess(payload) {
    return action(REMOVE_FAVOURITE_SUCCESS, { payload });
}

// Redux action for Remove to Favorite Failure
export function removeFavouriteFailure() {
    return action(REMOVE_FAVOURITE_FAILURE);
}