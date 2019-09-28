import {

    // Get online user chat list
    GET_CHAT_USER_LIST,
    GET_CHAT_USER_LIST_SUCCESS,
    GET_CHAT_USER_LIST_FAILURE,

    // Clear reducer data
    CLEAR_CHAT_DATA,

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
} from '../../actions/ActionTypes';

//  Redux Action To Get Chat user list 
export const getUserChatListApi = (request) => ({
    type: GET_CHAT_USER_LIST,
    payload: request
})
//  Redux Action To Get Chat user list Success
export const getUserChatListApiSuccess = (response) => ({
    type: GET_CHAT_USER_LIST_SUCCESS,
    payload: response
});
// Redux Action To Get Chat user list Failure
export const getUserChatListApiFailure = (error) => ({
    type: GET_CHAT_USER_LIST_FAILURE,
    payload: error
});

// Clear chat data
export const clearChatListData = () => ({
    type: CLEAR_CHAT_DATA,
});


//change chat user block status methods 27/12/2018
export const changeBlockUserChatStatus = (request) => ({
    type: CHANGEUSERBLOCKSTATUSCHAT,
    payload: request
});

// Redux Action To blockuser data success
export const changeBlockUserChatStatusSuccess = response => ({
    type: CHANGEUSERBLOCKSTATUSCHAT_SUCCESS,
    payload: response
});

// Redux Action To  blockuser data failure
export const changeBlockUserChatStatusFailure = error => ({
    type: CHANGEUSERBLOCKSTATUSCHAT_FAILURE,
    payload: error
});

// Redux Action To  blockuser data clear
export const changeBlockUserChatStatusClear = () => ({
    type: CHANGEUSERBLOCKSTATUSCHAT_CLEAR,
});

//  Redux Action To Get ChatUser History By username
export const getChatUserhistory = (request) => ({
    type: GET_CHATUSERHISTORY,
    payload: request
});

//  Redux Action To Get ChatUser History Success
export const getChatUserhistorySuccess = (data) => ({
    type: GET_CHATUSERHISTORY_SUCCESS,
    payload: data
});

// Redux Action To Get ChatUser History Failure
export const getChatUserhistoryFailure = (error) => ({
    type: GET_CHATUSERHISTORY_FAILURE,
    payload: error
});

// Clear chat history
export const ChatUserHistoryClear = () => ({
    type: CHATUSERHISTORYCLEAR,
});
