/* 
    Createdby : Dhara gajera
    Updateby : Dhara gajera
    CreatedDate : 24-12-2018
*/
import {
    GET_CHATONLINEUSER_DASHBOARD,
    GET_CHATONLINEUSER_DASHBOARD_SUCCESS,
    GET_CHATONLINEUSER_DASHBOARD_FAILURE,

    GET_CHATOFFLINEUSER_DASHBOARD,
    GET_CHATOFFLINEUSER_DASHBOARD_SUCCESS,
    GET_CHATOFFLINEUSER_DASHBOARD_FAILURE,

    GET_CHATACTIVEUSER_DASHBOARD,
    GET_CHATACTIVEUSER_DASHBOARD_SUCCESS,
    GET_CHATACTIVEUSER_DASHBOARD_FAILURE,

    GET_CHATBLOCKEDUSER_DASHBOARD,
    GET_CHATBLOCKEDUSER_DASHBOARD_SUCCESS,
    GET_CHATBLOCKEDUSER_DASHBOARD_FAILURE,
} from 'Actions/types';

/**
 * Function for Get Chat ONLINE USER Dashboard Data Action
 */
export const getChatOnlineUserDashboard = () => ({
    type: GET_CHATONLINEUSER_DASHBOARD,
    payload:{}
});

/* 
* Function for Get Chat ONLINE USER Dashboard Data Success Action
*/
export const getChatOnlineUserDashboardSuccess = (response) => ({
    type: GET_CHATONLINEUSER_DASHBOARD_SUCCESS,
    payload: response
});

/* 
*  Function for Get Chat  ONLINE USER Dashboard Data Failure Action
*/
export const getChatOnlineUserDashboardFailure = (error) => ({
    type: GET_CHATONLINEUSER_DASHBOARD_FAILURE,
    payload: error
});

/**************************************************************************************************
 * Function for Get Chat OFFLINE USER Dashboard Data Action
 */
export const getChatOfflineUserDashboard = () => ({
    type: GET_CHATOFFLINEUSER_DASHBOARD,
    payload:{}
});

/* 
* Function for Get Chat OFFLINE USER Dashboard Data Success Action
*/
export const getChatOfflineUserDashboardSuccess = (response) => ({
    type: GET_CHATOFFLINEUSER_DASHBOARD_SUCCESS,
    payload: response
});

/* 
*  Function for Get Chat OFFLINENE USER Dashboard Data Failure Action
*/
export const getChatOfflineUserDashboardFailure = (error) => ({
    type: GET_CHATOFFLINEUSER_DASHBOARD_FAILURE,
    payload: error
});


/*************************************************************************************************
 * Function for Get Chat ACTIVE USER Dashboard Data Action
 */
export const getChatActiveUserDashboard = () => ({
    type: GET_CHATACTIVEUSER_DASHBOARD,
    payload:{}
});

/* 
* Function for Get Chat ACTIVE USER Dashboard Data Success Action
*/
export const getChatActiveUserDashboardSuccess = (response) => ({
    type: GET_CHATACTIVEUSER_DASHBOARD_SUCCESS,
    payload: response
});

/* 
*  Function for Get Chat  ACTIVE USER Dashboard Data Failure Action
*/
export const getChatActiveUserDashboardFailure = (error) => ({
    type: GET_CHATACTIVEUSER_DASHBOARD_FAILURE,
    payload: error
});

/*************************************************************************************************
 * Function for Get Chat BLOCKED USER Dashboard Data Action
 */
export const getChatBlockedUserDashboard = () => ({
    type: GET_CHATBLOCKEDUSER_DASHBOARD,
    payload:{}
});

/* 
* Function for Get Chat BLOCKED USER Dashboard Data Success Action
*/
export const getChatBlockedUserDashboardSuccess = (response) => ({
    type: GET_CHATBLOCKEDUSER_DASHBOARD_SUCCESS,
    payload: response
});

/* 
*  Function for Get Chat  BLOCKED USER Dashboard Data Failure Action
*/
export const getChatBlockedUserDashboardFailure = (error) => ({
    type: GET_CHATBLOCKEDUSER_DASHBOARD_FAILURE,
    payload: error
});