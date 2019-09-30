import {
    // Subscribe Notification
    SUBSCRIBE_NOTIFICATION,
    SUBSCRIBE_NOTIFICATION_SUCCESS,
    SUBSCRIBE_NOTIFICATION_FAILURE,

    // Unsubscribe Notificaion 
    UNSUBSCRIBE_NOTIFICATION,
    UNSUBSCRIBE_NOTIFICATION_SUCCESS,
    UNSUBSCRIBE_NOTIFICATION_FAILURE,

    // Clear Data
    CLEAR_NOTIFICATION_DATA,
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

const initialState = {

    //Subscribe Notification
    subscribeNoti: null,
    isSubscribing: false,
    subscribeNotiError: false,

    //UnSubscribe Notification
    unsubscribeNoti: null,
    isUnsubscribing: false,
    unsubscribeNotiError: false,
}

export default function notificationReducer(state, action) {

    // If state is undefine then return with initial state		
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle subscribe notifcation method data
        case SUBSCRIBE_NOTIFICATION: {
            return Object.assign({}, state, {
                subscribeNoti: null,
                isSubscribing: true,
                subscribeNotiError: false,
                unsubscribeNoti: null,
            })
        }
        // Set subscribe notification success data
        case SUBSCRIBE_NOTIFICATION_SUCCESS: {
            return Object.assign({}, state, {
                subscribeNoti: action.payload,
                isSubscribing: false,
                subscribeNotiError: false
            })
        }
        // Set subscribe notification failure data
        case SUBSCRIBE_NOTIFICATION_FAILURE: {
            return Object.assign({}, state, {
                subscribeNoti: null,
                isSubscribing: false,
                subscribeNotiError: true
            })
        }

        // Handle unsubscribe notifcation method data
        case UNSUBSCRIBE_NOTIFICATION: {
            return Object.assign({}, state, {
                unsubscribeNoti: null,
                isUnsubscribing: true,
                unsubscribeNotiError: false,
                subscribeNoti: null,
            })
        }
        // Set unsubscribe notification success data
        case UNSUBSCRIBE_NOTIFICATION_SUCCESS: {
            return Object.assign({}, state, {
                unsubscribeNoti: action.payload,
                isUnsubscribing: false,
                unsubscribeNotiError: false
            })
        }
        // Set unsubscribe notification failure data
        case UNSUBSCRIBE_NOTIFICATION_FAILURE: {
            return Object.assign({}, state, {
                unsubscribeNoti: null,
                isUnsubscribing: false,
                unsubscribeNotiError: true
            })
        }

        // Clear notification data
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