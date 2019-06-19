/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount Security Dashboard
*/
import {
    ADD_SECURITY_QUESTION_DASHBOARD,
    ADD_SECURITY_QUESTION_DASHBOARD_SUCCESS,
    ADD_SECURITY_QUESTION_DASHBOARD_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Security Question Configuration..
        case ADD_SECURITY_QUESTION_DASHBOARD:
            return { ...state, loading: true };

        case ADD_SECURITY_QUESTION_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_SECURITY_QUESTION_DASHBOARD_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return { ...state };
    }
};