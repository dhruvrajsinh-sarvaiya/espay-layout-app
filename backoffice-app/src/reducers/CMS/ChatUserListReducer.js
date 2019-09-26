// ChatUserListReducer

import {

    // Chat user list
    GET_CHATUSERLIST,
    GET_CHATUSERLIST_SUCCESS,
    GET_CHATUSERLIST_FAILURE,

    //update block user status for chat
    CHANGEUSERBLOCKSTATUSCHAT,
    CHANGEUSERBLOCKSTATUSCHAT_SUCCESS,
    CHANGEUSERBLOCKSTATUSCHAT_FAILURE,
    CHANGEUSERBLOCKSTATUSCHAT_CLEAR,

    // for get userwise chathistory
    GET_CHATUSERHISTORY,
    GET_CHATUSERHISTORY_SUCCESS,
    GET_CHATUSERHISTORY_FAILURE,
    CHATUSERHISTORYCLEAR,

    // Get online user chat list
    GET_CHAT_USER_LIST,
    GET_CHAT_USER_LIST_SUCCESS,
    GET_CHAT_USER_LIST_FAILURE,

    // Clear reducer data
    CLEAR_CHAT_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// initial state
const initialState = {
    chatUser_list: null,
    loading: false,
    errors: null,
    chatUserStatus: null,
    statusChecker: 0, //to check status update method called
    chatUser_History: null,

    chatUserListFetching: false,
    chatUserListData: null,
};

const ChatUserListReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // Clear reducer data 
        case CLEAR_CHAT_DATA:
            return initialState

        // get Chat User list
        case GET_CHAT_USER_LIST:
            return { ...state, chatUserListFetching: true, chatUserListData: null };

        // get Chat User list success
        case GET_CHAT_USER_LIST_SUCCESS:
        // get Chat User list failure
        case GET_CHAT_USER_LIST_FAILURE:
            return { ...state, chatUserListFetching: false, chatUserListData: action.payload };


        // get ContactUs List
        case GET_CHATUSERLIST:
            return { ...state, loading: true, chatUserStatus: null, chatUser_list: null, errors: {}, statusChecker: 0 };

        // get ContactUs List success
        case GET_CHATUSERLIST_SUCCESS:
            return { ...state, loading: false, chatUserStatus: null, chatUser_list: action.payload, statusChecker: 0 };

        // get ContactUs List failure
        case GET_CHATUSERLIST_FAILURE:
            return { ...state, loading: false, chatUser_list: action.payload, statusChecker: 0 };

        // chat user block status
        case CHANGEUSERBLOCKSTATUSCHAT:
            return { ...state, loading: true, chatUserStatus: null, errors: {}, statusChecker: 1 };

        // chat user block status success
        case CHANGEUSERBLOCKSTATUSCHAT_SUCCESS:
            return { ...state, loading: false, chatUserStatus: action.payload, statusChecker: 1 };

        // chat user block status failure
        case CHANGEUSERBLOCKSTATUSCHAT_FAILURE:
            return { ...state, loading: false, errors: action.payload, statusChecker: 1 };

        // chat user block status clear
        case CHANGEUSERBLOCKSTATUSCHAT_CLEAR:
            return { ...state, loading: false, chatUserStatus: null, statusChecker: 1 };

        // chat user block status clear
        case CHATUSERHISTORYCLEAR:
            return { ...state, loading: false, chatUser_History: null, statusChecker: 0 };

        // get Chat User History
        case GET_CHATUSERHISTORY:
            return { ...state, loading: true, errors: {}, statusChecker: 0 };

        // get Chat User History success
        case GET_CHATUSERHISTORY_SUCCESS:
            return { ...state, loading: false, chatUser_History: action.payload, statusChecker: 0 };

        // get Chat User History failure
        case GET_CHATUSERHISTORY_FAILURE:
            return { ...state, loading: false, errors: action.payload, statusChecker: 0 };

        default: return { ...state };
    }
}

export default ChatUserListReducer;