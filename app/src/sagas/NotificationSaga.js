import { put, call, takeLatest, select } from 'redux-saga/effects';
import { Method, ServiceUtilConstant } from '../controllers/Constants';
import { userAccessToken, } from '../selector';
import { SUBSCRIBE_NOTIFICATION, UNSUBSCRIBE_NOTIFICATION } from '../actions/ActionTypes';
import {
    subscribeNotificationSuccess,
    subscribeNotificationFailure,
    unsubscribeNotificationSuccess,
    unsubscribeNotificationFailure
} from '../actions/account/SubscribeNotification';
import { getData } from '../App';
import { swaggerPostAPI } from '../api/helper';

export default function* notificationSaga() {
    //To Subscribe notification
    yield takeLatest(SUBSCRIBE_NOTIFICATION, subscribeNotification);
    //To Unsubscribe notification
    yield takeLatest(UNSUBSCRIBE_NOTIFICATION, unsubscribeNotification);
}

// Generator for Subscribe Notification
function* subscribeNotification() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };
        
        // To call Subscribe Notification api
        const response = yield call(swaggerPostAPI, Method.SubscribePushNotification, { DeviceID: getData(ServiceUtilConstant.FCMToken) }, headers);
        
        // To set Subscribe Notification success response to reducer
        yield put(subscribeNotificationSuccess(response))
    } catch (error) {
        // To set Subscribe Notification failure response to reducer
        yield put(subscribeNotificationFailure());
    }
}

// Generator for Unsubscribe Notification
function* unsubscribeNotification() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Unsubscribe Notification api
        const response = yield call(swaggerPostAPI, Method.UnsubscribePushNotification, { DeviceID: getData(ServiceUtilConstant.FCMToken) }, headers);
        
        // To set Unsubscribe Notification success response to reducer
        yield put(unsubscribeNotificationSuccess(response))
    } catch (error) {
        // To set Unsubscribe Notification failure response to reducer
        yield put(unsubscribeNotificationFailure());
    }
}