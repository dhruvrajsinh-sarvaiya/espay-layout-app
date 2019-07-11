/* 
    Developer : Nishant Vadgama
    Date : 13-12-2018
    File Comment : User details reducers 
*/
import {
    USERLIST,
    USERLIST_SUCCESS,
    USERLIST_FAILURE
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    errors: {},
    userlist: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //get user list
        case USERLIST:
            return { ...state, loading: true, errors: {} };
        case USERLIST_SUCCESS:
            return { ...state, loading: false, userlist: action.payload, errors: {} };
        case USERLIST_FAILURE:
            return { ...state, loading: false, errors: action.payload };

        default:
            return { ...state };
    }
};
