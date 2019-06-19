/* 
    Createdby : dhara gajera
    CreatedDate : 26-12-2018
    Description : to get chat user list and chat user block status 
*/
import {
	GET_CHATUSERLIST,
    GET_CHATUSERLIST_SUCCESS,
    GET_CHATUSERLIST_FAILURE,

    //update block user status for chat
    CHANGEUSERBLOCKSTATUSCHAT,
    CHANGEUSERBLOCKSTATUSCHAT_SUCCESS,
    CHANGEUSERBLOCKSTATUSCHAT_FAILURE,

    GET_USERDATA_BY_USERNAME,
    GET_CHATUSERHISTORY,
    GET_CHATUSERHISTORY_SUCCESS,
    GET_CHATUSERHISTORY_FAILURE,

} from 'Actions/types';

/**
 * Function for Get chat user list Data Action
 */
export const getChatUserList = () => ({
    type: GET_CHATUSERLIST,
    payload:{}
});

/* 
* Function for Get  chat user list Data Success Action
*/
export const getChatUserListSuccess = (response) => ({
    type: GET_CHATUSERLIST_SUCCESS,
    payload: response
});

/* 
*  Function for Get chat user list Data Failure Action
*/
export const getChatUserListFailure = (error) => ({
    type: GET_CHATUSERLIST_FAILURE,
    payload: error
});

//change chat user block status methods 27/12/2018
export const changeBlockUserChatStatus = (request) => ({
    type: CHANGEUSERBLOCKSTATUSCHAT,
    payload: request
});

/* 
* Function for block chat user Success Action
*/
export const changeBlockUserChatStatusSuccess = response => ({
    type: CHANGEUSERBLOCKSTATUSCHAT_SUCCESS,
    payload: response
});

/* 
* Function for block chat user Failure Action
*/
export const changeBlockUserChatStatusFailure = error => ({
    type: CHANGEUSERBLOCKSTATUSCHAT_FAILURE,
    payload: error
});


export const getSingleUserData = (value) => ({
    type: GET_USERDATA_BY_USERNAME,
    payload: value
});


/**
 * Redux Action To Get ChatUser History By username
 */
export const getChatUserhistory = (request) => ({
    type: GET_CHATUSERHISTORY,
    payload : request
});

/**
 * Redux Action To Get ChatUser History Success
 */
export const getChatUserhistorySuccess = (data) => ({
    type: GET_CHATUSERHISTORY_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get ChatUser History Failure
 */
export const getChatUserhistoryFailure = (error) => ({
    type: GET_CHATUSERHISTORY_FAILURE,
    payload: error
});