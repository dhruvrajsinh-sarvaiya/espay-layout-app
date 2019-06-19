
/*
Saga : Unstaking Pending Request 
Created By : Vishva shah
Date : 12/03/2019
*/
import {
    
    GET_LIST_PENDING_REQUEST,
    GET_LIST_PENDING_REQUEST_SUCCESS,
    GET_LIST_PENDING_REQUEST_FAILURE,

    ACCEPTREJECT_UNSTAKING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE
  
} from "Actions/types";

// initial state
const INIT_STATE = {
  
    errors: {},
    PendingList: [],
    loading: false,
    statusResponse: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // get pending request list
        case GET_LIST_PENDING_REQUEST:
            return { ...state, loading: true, errors: {} ,statusResponse: {}};
        case GET_LIST_PENDING_REQUEST_SUCCESS:
            return { ...state, loading: false, PendingList: action.payload.Unstakings, errors: {} };
        case GET_LIST_PENDING_REQUEST_FAILURE:
            return { ...state, loading: false, errors: action.payload, PendingList: [] };

        case ACCEPTREJECT_UNSTAKING_REQUEST:
            return { ...state, loading: true, errors: {}, statusResponse: {} }
        case ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS:
            return { ...state, loading: false, statusResponse: action.payload, errors: {} }
        case ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE:
            return { ...state, loading: false, statusResponse: action.payload, errors: {} }

            default:
            return { ...state };
    }
};
