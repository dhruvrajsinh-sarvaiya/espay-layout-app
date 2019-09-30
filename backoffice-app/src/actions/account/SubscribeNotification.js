import { action } from "../GlobalActions";
import {
    SUBSCRIBE_NOTIFICATION,
    SUBSCRIBE_NOTIFICATION_SUCCESS,
    SUBSCRIBE_NOTIFICATION_FAILURE,
    UNSUBSCRIBE_NOTIFICATION,
    UNSUBSCRIBE_NOTIFICATION_SUCCESS,
    UNSUBSCRIBE_NOTIFICATION_FAILURE,
    CLEAR_NOTIFICATION_DATA,
} from "../ActionTypes";

//To Subscribe Notification
export function subscribeNotification() { return action(SUBSCRIBE_NOTIFICATION); }

export function subscribeNotificationSuccess(payload) { return action(SUBSCRIBE_NOTIFICATION_SUCCESS, { payload }); }

export function subscribeNotificationFailure() { return action(SUBSCRIBE_NOTIFICATION_FAILURE); }

//To Unsubscribe Notification
export function unsubscribeNotification() { return action(UNSUBSCRIBE_NOTIFICATION); }

export function unsubscribeNotificationSuccess(payload) { return action(UNSUBSCRIBE_NOTIFICATION_SUCCESS, { payload }); }

export function unsubscribeNotificationFailure() { return action(UNSUBSCRIBE_NOTIFICATION_FAILURE); }

//To clear all data of notifications
export function clearNotificationData() { return action(CLEAR_NOTIFICATION_DATA); }

