import { action } from "../GlobalActions";
import {
    // Get Charges List
    GET_CHARGES_LIST,
    GET_CHARGES_LIST_SUCCESS,
    GET_CHARGES_LIST_FAILURE
} from "../ActionTypes";

// Redux action to Get Charge List
export function getChargesList(payload) {
    return action(GET_CHARGES_LIST, { payload });
}

// Redux action to Get Charge List Success
export function getChargesListSuccess(payload) {
    return action(GET_CHARGES_LIST_SUCCESS, { payload });
}

// Redux action to Get Charge List Failure
export function getChargesListFailure() {
    return action(GET_CHARGES_LIST_FAILURE);
}