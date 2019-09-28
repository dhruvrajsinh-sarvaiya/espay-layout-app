import {
    //message que list 
    GET_MESSAGE_QUE_LIST,
    GET_MESSAGE_QUE_LIST_SUCCESS,
    GET_MESSAGE_QUE_LIST_FAILURE,

    //message que resend
    GET_RESEND_MESSAGE,
    GET_RESEND_MESSAGE_SUCCESS,
    GET_RESEND_MESSAGE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_MESSAGE_QUE_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //message que list 
    messageQueListData: null,
    messageQueListFetching: false,

    //resend sms
    resendMessagedata: null,
    resendMessageFetching: false,
}

export default function MessageQueReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_MESSAGE_QUE_DATA:
            return INITIAL_STATE

        //Message Que list 
        case GET_MESSAGE_QUE_LIST:
            return Object.assign({}, state, { messageQueListFetching: true, messageQueListData: null })
        //Message Que list  success
        case GET_MESSAGE_QUE_LIST_SUCCESS:
            return Object.assign({}, state, { messageQueListFetching: false, messageQueListData: action.payload })
        //Message Que list  failure
        case GET_MESSAGE_QUE_LIST_FAILURE:
            return Object.assign({}, state, { messageQueListFetching: false, messageQueListData: action.payload })

        //set resend Message Que 
        case GET_RESEND_MESSAGE:
            return Object.assign({}, state, { resendMessageFetching: true, resendMessagedata: null })
        //set resendMessage Que success
        case GET_RESEND_MESSAGE_SUCCESS:
            return Object.assign({}, state, { resendMessageFetching: false, resendMessagedata: action.payload })
        //set resendMessage Que failure
        case GET_RESEND_MESSAGE_FAILURE:
            return Object.assign({}, state, { resendMessageFetching: false, resendMessagedata: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}