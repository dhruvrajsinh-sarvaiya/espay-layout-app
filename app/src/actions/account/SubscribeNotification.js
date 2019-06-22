import { action } from "../GlobalActions";
import {
    // Subscribe Notification
    SUBSCRIBE_NOTIFICATION,
    SUBSCRIBE_NOTIFICATION_SUCCESS,
    SUBSCRIBE_NOTIFICATION_FAILURE,

    // Unsubscribe Notification
    UNSUBSCRIBE_NOTIFICATION,
    UNSUBSCRIBE_NOTIFICATION_SUCCESS,
    UNSUBSCRIBE_NOTIFICATION_FAILURE,

    // Clear Notification
    CLEAR_NOTIFICATION_DATA,
} from "../ActionTypes";

// Redux action to Subscribe Notification
export function subscribeNotification() { return action(SUBSCRIBE_NOTIFICATION); }

// Redux action to Subscribe Notification Success
export function subscribeNotificationSuccess(payload) { return action(SUBSCRIBE_NOTIFICATION_SUCCESS, { payload }); }

// Redux action to Subscribe Notification Failure
export function subscribeNotificationFailure() { return action(SUBSCRIBE_NOTIFICATION_FAILURE); }

// Redux action to Unsubscribe Notification
export function unsubscribeNotification() { return action(UNSUBSCRIBE_NOTIFICATION); }

// Redux action to Unsubscribe Notification Success
export function unsubscribeNotificationSuccess(payload) { return action(UNSUBSCRIBE_NOTIFICATION_SUCCESS, { payload }); }

// Redux action to Unsubscribe Notification Failure
export function unsubscribeNotificationFailure() { return action(UNSUBSCRIBE_NOTIFICATION_FAILURE); }

//To clear all data of notifications
export function clearNotificationData() { return action(CLEAR_NOTIFICATION_DATA); }

