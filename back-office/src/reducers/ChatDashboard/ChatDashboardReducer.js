/* 
    Createdby : Dhara gajera
    CreatedDate : 25-12-2018
*/
// import React from 'react';
// action types
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

// initial state
const INITIAL_STATE = {
    dashboarddata: {},
    data: [],
    loading: false,
    errors: {},
    onlineUserCount: 0,
    offlineUserCount: 0,
    activeUserCount: 0,
    blockedUserCount: 0,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // get ONLINE USER CHAT Dashboard Data
        case GET_CHATONLINEUSER_DASHBOARD:
        case GET_CHATOFFLINEUSER_DASHBOARD:
        case GET_CHATACTIVEUSER_DASHBOARD:
        case GET_CHATBLOCKEDUSER_DASHBOARD:
            return { ...state, loading: true, data: [] };

        // get ONLINE USER  CHAT Dashboard Data success
        case GET_CHATONLINEUSER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: [], onlineUserCount: action.payload.Count };

        // get ONLINE USER CHAT Dashboard Data failure
        case GET_CHATONLINEUSER_DASHBOARD_FAILURE:
        case GET_CHATOFFLINEUSER_DASHBOARD_FAILURE:
        case GET_CHATACTIVEUSER_DASHBOARD_FAILURE:
        case GET_CHATBLOCKEDUSER_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATOFFLINEUSER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: [], offlineUserCount: action.payload.Count };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATACTIVEUSER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: [], activeUserCount: action.payload.Count };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATBLOCKEDUSER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: [], blockedUserCount: action.payload.Count };

        default: return { ...state };
    }
}