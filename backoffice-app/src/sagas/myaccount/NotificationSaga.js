import { put, call, takeLatest, select } from 'redux-saga/effects';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { userAccessToken, } from '../../selector';
import { SUBSCRIBE_NOTIFICATION, UNSUBSCRIBE_NOTIFICATION } from '../../actions/ActionTypes';
import {
    subscribeNotificationSuccess,
    subscribeNotificationFailure,
    unsubscribeNotificationSuccess,
    unsubscribeNotificationFailure
} from '../../actions/account/SubscribeNotification';
import { getData } from '../../App';
import { swaggerPostAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';

export default function* notificationSaga() {
    //To Subscribe notification
    yield takeLatest(SUBSCRIBE_NOTIFICATION, subscribeNotification);
    //To Unsubscribe notification
    yield takeLatest(UNSUBSCRIBE_NOTIFICATION, unsubscribeNotification);
}

// Generator for Subscribe Notification
function* subscribeNotification() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Subscribe Push Notification api
        const response = yield call(swaggerPostAPI, Method.SubscribePushNotification, { DeviceID: getData(ServiceUtilConstant.FCMToken) }, headers);

        // To set Subscribe Push Notification success response to reducer
        yield put(subscribeNotificationSuccess(response))
    } catch (error) {
        // To set Subscribe Push Notification failure response to reducer
        yield put(subscribeNotificationFailure());
    }
}

// Generator for UnSubscribe Notification
function* unsubscribeNotification() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Unsubscribe Push Notification api
        const response = yield call(swaggerPostAPI, Method.UnsubscribePushNotification, { DeviceID: getData(ServiceUtilConstant.FCMToken) }, headers);

        // To set Unsubscribe Push Notification success response to reducer
        yield put(unsubscribeNotificationSuccess(response))
    } catch (error) {
        // To set Unsubscribe Push Notification failure response to reducer
        yield put(unsubscribeNotificationFailure());
    }
}