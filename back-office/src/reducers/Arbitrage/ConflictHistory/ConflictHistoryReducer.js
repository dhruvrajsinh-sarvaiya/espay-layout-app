/* 
   Developer : Parth Andhariya
    Date : 10-06-2019
    File Comment : Conflict History reducer
*/
import {
    // list 
    LIST_CONFLICT_HISTORY,
    LIST_CONFLICT_HISTORY_SUCCESS,
    LIST_CONFLICT_HISTORY_FAILURE,
    // Recon
    CONFLICT_RECON_REQUEST,
    CONFLICT_RECON_REQUEST_SUCCESS,
    CONFLICT_RECON_REQUEST_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    loading: false,
    ConflictList: [],
    ConflictRecons: ""
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //list...
        case LIST_CONFLICT_HISTORY:
            return {
                ...state,
                loading: true,
                ConflictList: [],
            };
        case LIST_CONFLICT_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                ConflictList: action.payload.Data,
            };
        case LIST_CONFLICT_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                ConflictList: [],
            };
        //Recon process...
        case CONFLICT_RECON_REQUEST:
            return {
                ...state,
                loading: true,
                ConflictRecons: ""
            };
        case CONFLICT_RECON_REQUEST_SUCCESS:
        case CONFLICT_RECON_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                ConflictRecons: action.payload,
            };
        default:
            return { ...state };
    }
};
