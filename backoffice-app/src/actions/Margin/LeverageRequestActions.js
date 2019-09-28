import { action } from '../GlobalActions';
import { 
    // Get Leverage Request List
    GET_LEVERAGE_REQUEST_LIST, 
    GET_LEVERAGE_REQUEST_LIST_SUCCESS, 
    GET_LEVERAGE_REQUEST_LIST_FAILURE,
    CLEAR_LEVERAGE_REQ_DATA,
} from '../ActionTypes';

// Redux action for Get Leverage Request List
export function getLeverageReqList(payload) {
    return action(GET_LEVERAGE_REQUEST_LIST, { payload })
}

// Redux action for Get Leverage Request List Success
export function getLeverageReqListSuccess(data) {
    return action(GET_LEVERAGE_REQUEST_LIST_SUCCESS, { data })
}

// Redux action for Get Leverage Request List Success
export function getLeverageReqListFailure() {
    return action(GET_LEVERAGE_REQUEST_LIST_FAILURE)
}

// Redux action for Clear Leverage Data
export function clearLeverageReqData() {
    return action(CLEAR_LEVERAGE_REQ_DATA)
}
