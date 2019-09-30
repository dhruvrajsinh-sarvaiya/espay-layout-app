import {
    //Email que list 
    GET_EMAIL_QUE_LIST,
    GET_EMAIL_QUE_LIST_SUCCESS,
    GET_EMAIL_QUE_LIST_FAILURE,

    //resend email
    GET_RESEND_EMAIL,
    GET_RESEND_EMAIL_SUCCESS,
    GET_RESEND_EMAIL_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_EMAIL_QUE_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //Email que list 
    EmailQueListData: null,
    EmailQueListFetching: false,

    //resend email
    resendEmaildata: null,
    resendEmailFetching: false,
}

export default function EmailQueReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_EMAIL_QUE_DATA:
            return INITIAL_STATE

        //Email Que list 
        case GET_EMAIL_QUE_LIST:
            return Object.assign({}, state, { EmailQueListFetching: true, EmailQueListData: null })
        //Email Que list  success
        case GET_EMAIL_QUE_LIST_SUCCESS:
            return Object.assign({}, state, { EmailQueListFetching: false, EmailQueListData: action.payload })
        //Email Que list  failure
        case GET_EMAIL_QUE_LIST_FAILURE:
            return Object.assign({}, state, { EmailQueListFetching: false, EmailQueListData: action.payload })

        //set resend Email Que 
        case GET_RESEND_EMAIL:
            return Object.assign({}, state, { resendEmailFetching: true, resendEmaildata: null })
        //set resendEmail Que success
        case GET_RESEND_EMAIL_SUCCESS:
            return Object.assign({}, state, { resendEmailFetching: false, resendEmaildata: action.payload })
        //set resendEmail Que failure
        case GET_RESEND_EMAIL_FAILURE:
            return Object.assign({}, state, { resendEmailFetching: false, resendEmaildata: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}