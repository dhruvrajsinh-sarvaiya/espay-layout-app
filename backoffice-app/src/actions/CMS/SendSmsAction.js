// SendSmsAction.js
import {
    // for send sms data
    SEND_SMS_DATA,
    SEND_SMS_DATA_SUCCESS,
    SEND_SMS_DATA_FAILURE,

    // for clear sms data
    CLEAR_SEND_SMS_DATA
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action for send sms data
export function sendSmsData(payload = {}) {
    return action(SEND_SMS_DATA, { payload })
}

// Redux action for send sms data success
export function sendSmsDataSuccess(data) {
    return action(SEND_SMS_DATA_SUCCESS, { data })
}

// Redux action for send sms data failure
export function sendSmsDataFailure() {
    return action(SEND_SMS_DATA_FAILURE)
}

// Redux action for clear send sms data
export function clearSendSmsData() {
    return action(CLEAR_SEND_SMS_DATA)
}