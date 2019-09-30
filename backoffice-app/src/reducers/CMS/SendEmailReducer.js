import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Chat User List
    GET_CHATUSERLIST,
    GET_CHATUSERLIST_SUCCESS,
    GET_CHATUSERLIST_FAILURE,

    // Send Email Data
    SEND_EMAIL_DATA,
    SEND_EMAIL_DATA_SUCCESS,
    SEND_EMAIL_DATA_FAILURE,

    //clear data
    CLEAR_SEND_EMAIL_DATA
} from "../../actions/ActionTypes";

// Initial State for Send Email Module
const INITIAL_STATE = {

    // for User
    UserDataList: null,
    UserListLoading: false,
    UserListError: false,

    // for Send Email
    SendEmailData: null,
    SendEmailLoading: false,
    SendEmailError: false,
}

export default function SendEmailReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

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

        // Handle Send Email Data method data
        case SEND_EMAIL_DATA:
            return Object.assign({}, state, {
                SendEmailData: null,
                SendEmailLoading: true
            })
        // Set Send Email Data success data
        case SEND_EMAIL_DATA_SUCCESS:
            return Object.assign({}, state, {
                SendEmailData: action.data,
                SendEmailLoading: false,
            })
        // Set Send Email Data failure data
        case SEND_EMAIL_DATA_FAILURE:
            return Object.assign({}, state, {
                SendEmailData: null,
                SendEmailLoading: false,
                SendEmailError: true
            })

        // Handle Clear Send Email Data method data
        case CLEAR_SEND_EMAIL_DATA:
            return Object.assign({}, state, {
                SendEmailData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
