// SendSmsReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Chat User List
    GET_CHATUSERLIST,
    GET_CHATUSERLIST_SUCCESS,
    GET_CHATUSERLIST_FAILURE,

    // for send sms data
    SEND_SMS_DATA,
    SEND_SMS_DATA_SUCCESS,
    SEND_SMS_DATA_FAILURE,

    // for clear sms data
    CLEAR_SEND_SMS_DATA
} from '../../actions/ActionTypes';

// Initial State for Send SMS Module
const INITIAL_STATE = {

    // for User
    UserDataList: null,
    UserListLoading: false,
    UserListError: false,

    // for Send SMS
    SendSmsData: null,
    SendSmsLoading: false,
    SendSmsError: false,
}

export default function SendSmsReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle User Data List method data
        case GET_CHATUSERLIST:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataLoading: true
            })
        // Set User Data List success data
        case GET_CHATUSERLIST_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataLoading: false,
            })
        // Set User Data List failure data
        case GET_CHATUSERLIST_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataLoading: false,
                UserDataError: true
            })

        // Handle Send SMS Data method data
        case SEND_SMS_DATA:
            return Object.assign({}, state, {
                SendSmsData: null,
                SendSmsLoading: true
            })
        // Set Send SMS Data success data
        case SEND_SMS_DATA_SUCCESS:
            return Object.assign({}, state, {
                SendSmsData: action.data,
                SendSmsLoading: false,
            })
        // Set Send SMS Data failure data
        case SEND_SMS_DATA_FAILURE:
            return Object.assign({}, state, {
                SendSmsData: null,
                SendSmsLoading: false,
                SendSmsError: true
            })

        // Handle Clear Send SMS Data method data
        case CLEAR_SEND_SMS_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
