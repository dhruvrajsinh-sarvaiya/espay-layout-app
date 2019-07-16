import {
    // Get Wallet Type Charge List
    GET_WALLET_TYPE_CHARGES_LIST,
    GET_WALLET_TYPE_CHARGES_LIST_SUCCESS,
    GET_WALLET_TYPE_CHARGES_LIST_FAILURE,

    // Clear Wallet Type Charge List
    CLEAR_WALLET_TYPE_CHARGES_LIST
} from "../ActionTypes";
import { action } from "../GlobalActions";

//action for Get Charges list and set type for reducers
export const getFeesLists = payload => ({
    type: GET_WALLET_TYPE_CHARGES_LIST,
    payload: payload
});

//action for set Success and data to Get Charges list and set type for reducers
export const getFeesListsSuccess = response => ({
    type: GET_WALLET_TYPE_CHARGES_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Get Charges list and set type for reducers
export const getFeesListsFailure = error => ({
    type: GET_WALLET_TYPE_CHARGES_LIST_FAILURE,
    payload: error
});

export function clearFeesCharges() {
    return action(CLEAR_WALLET_TYPE_CHARGES_LIST);
}

