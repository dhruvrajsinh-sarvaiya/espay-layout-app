// Action types for Notification
import {
    SUBSCRIBE_NOTIFICATION,
    SUBSCRIBE_NOTIFICATION_SUCCESS,
    SUBSCRIBE_NOTIFICATION_FAILURE,
    UNSUBSCRIBE_NOTIFICATION,
    UNSUBSCRIBE_NOTIFICATION_SUCCESS,
    UNSUBSCRIBE_NOTIFICATION_FAILURE,
    CLEAR_NOTIFICATION_DATA,
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// Initial state for Notification
const INTIAL_STATE = {

    //Subscribe Notification
    subscribeNoti: null,
    isSubscribing: false,
    subscribeNotiError: false,

    //UnSubscribe Notification
    unsubscribeNoti: null,
    isUnsubscribing: false,
    unsubscribeNotiError: false,
}

export default function notificationReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Subscribe Notification method data
        case SUBSCRIBE_NOTIFICATION: {
            return Object.assign({}, state, {
                subscribeNoti: null,
                isSubscribing: true,
                subscribeNotiError: false,
                unsubscribeNoti: null,
            })
        }
        // Set Subscribe Notification success data
        case SUBSCRIBE_NOTIFICATION_SUCCESS: {
            return Object.assign({}, state, {
                subscribeNoti: action.payload,
                isSubscribing: false,
                subscribeNotiError: false
            })
        }
        // Set Subscribe Notification failure data
        case SUBSCRIBE_NOTIFICATION_FAILURE: {
            return Object.assign({}, state, {
                subscribeNoti: null,
                isSubscribing: false,
                subscribeNotiError: true
            })
        }

        // Handle UnSubscribe Notification method data
        case UNSUBSCRIBE_NOTIFICATION: {
            return Object.assign({}, state, {
                unsubscribeNoti: null,
                isUnsubscribing: true,
                unsubscribeNotiError: false,
                subscribeNoti: null,
            })
        }
        // Set UnSubscribe Notification success data
        case UNSUBSCRIBE_NOTIFICATION_SUCCESS: {
            return Object.assign({}, state, {
                unsubscribeNoti: action.payload,
                isUnsubscribing: false,
                unsubscribeNotiError: false
            })
        }
        // Set UnSubscribe Notification failure data
        case UNSUBSCRIBE_NOTIFICATION_FAILURE: {
            return Object.assign({}, state, {
                unsubscribeNoti: null,
                isUnsubscribing: false,
                unsubscribeNotiError: true
            })
        }

        // Clear Notification Data
        case CLEAR_NOTIFICATION_DATA: {
            return Object.assign({}, state, {
                subscribeNoti: null,
                unsubscribeNoti: null,
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}