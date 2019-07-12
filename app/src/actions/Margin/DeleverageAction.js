import {
    //For Deleverage Pre Confirm
    DELEVERAGE_PRE_CONFIRM,
    DELEVERAGE_PRE_CONFIRM_SUCCESS,
    DELEVERAGE_PRE_CONFIRM_FAILURE,

    //For Deleverage Confirm
    DELEVERAGE_CONFIRM,
    DELEVERAGE_CONFIRM_SUCCESS,
    DELEVERAGE_CONFIRM_FAILURE,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Deleverage Pre Confirm
export function deleveragePreConfirm(request) {
    return action(DELEVERAGE_PRE_CONFIRM, { request })
}
// Redux action to Deleverage Pre Confirm Success
export function deleveragePreConfirmSuccess(response) {
    return action(DELEVERAGE_PRE_CONFIRM_SUCCESS, { response })
}
// Redux action to Deleverage Pre Confirm Failure
export function deleveragePreConfirmFailure(error) {
    return action(DELEVERAGE_PRE_CONFIRM_FAILURE, { error })
}

// Redux action to Deleverage Confirm
export function deleverageConfirm(Request) {
    return action(DELEVERAGE_CONFIRM, { Request })
}
// Redux action to Deleverage Confirm Success
export function deleverageConfirmSuccess(response) {
    return action(DELEVERAGE_CONFIRM_SUCCESS, { response })
}
// Redux action to Deleverage Confirm Failure
export function deleverageConfirmFailure(error) {
    return action(DELEVERAGE_CONFIRM_FAILURE, { error })
}