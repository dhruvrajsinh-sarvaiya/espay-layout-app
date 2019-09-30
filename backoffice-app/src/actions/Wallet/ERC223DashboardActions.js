import {
    // Get Increase Descrease Token Supply List
    GET_INCRE_DECRE_TOKEN_SUPPLY,
    GET_INCRE_DECRE_TOKEN_SUPPLY_SUCCESS,
    GET_INCRE_DECRE_TOKEN_SUPPLY_FAILURE,

    // Add Increase Token
    ADD_INCREASE_TOKEN,
    ADD_INCREASE_TOKEN_SUCCESS,
    ADD_INCREASE_TOKEN_FAILURE,

    // Clear Decrease Token
    CLEAR_INCREASE_TOKEN,

    // Add Decrease Token
    ADD_DECREASE_TOKEN,
    ADD_DECREASE_TOKEN_SUCCESS,
    ADD_DECREASE_TOKEN_FAILURE,

    // Get Destroy Black Fund List
    GET_DESTROY_BLACKFUND_LIST,
    GET_DESTROY_BLACKFUND_LIST_SUCCESS,
    GET_DESTROY_BLACKFUND_LIST_FAILURE,

    // Get Transfer Fee List
    GET_TRANSFER_FEE_LIST,
    GET_TRANSFER_FEE_LIST_SUCCESS,
    GET_TRANSFER_FEE_LIST_FAILURE,

    // Add Transfer Fee
    ADD_TRANSFER_FEE,
    ADD_TRANSFER_FEE_SUCCESS,
    ADD_TRANSFER_FEE_FAILURE,
    CLEAR_TRANSFER_FEE_DATA,
    
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Clear Transfer Fee
export function clearTransferFeeData() {
    return action(CLEAR_TRANSFER_FEE_DATA)
}

// Redux action for Add Transfer Fee
export function addTransferFee(payload = {}) {
    return action(ADD_TRANSFER_FEE, { payload })
}

// Redux action for Add Transfer Fee Success
export function addTransferFeeSuccess(data) {
    return action(ADD_TRANSFER_FEE_SUCCESS, { data })
}

// Redux action for Add Transfer Fee Success
export function addTransferFeeFailure() {
    return action(ADD_TRANSFER_FEE_FAILURE)
}

// Redux action for Get Transfer Fee List
export function getTransferFeeList(payload = {}) {
    return action(GET_TRANSFER_FEE_LIST, { payload })
}

// Redux action for Get Transfer Fee List Success
export function getTransferFeeListSuccess(data) {
    return action(GET_TRANSFER_FEE_LIST_SUCCESS, { data })
}

// Redux action for Get Transfer Fee List Success
export function getTransferFeeListFailure() {
    return action(GET_TRANSFER_FEE_LIST_FAILURE)
}

// Redux action for Get Destroy Black Fund List
export function getDestroyBlackFundList(payload = {}) {
    return action(GET_DESTROY_BLACKFUND_LIST, { payload })
}

// Redux action for Get Destroy Black Fund List Success
export function getDestroyBlackFundListSuccess(data) {
    return action(GET_DESTROY_BLACKFUND_LIST_SUCCESS, { data })
}

// Redux action for Get Destroy Black Fund List Success
export function getDestroyBlackFundListFailure() {
    return action(GET_DESTROY_BLACKFUND_LIST_FAILURE)
}

// Redux action for Get Increase Descrease Token Supply List
export function getIncreDecreTokenSupplyList(payload = {}) {
    return action(GET_INCRE_DECRE_TOKEN_SUPPLY, { payload })
}

// Redux action for Get Increase Descrease Token Supply List Success
export function getIncreDecreTokenSupplyListSuccess(data) {
    return action(GET_INCRE_DECRE_TOKEN_SUPPLY_SUCCESS, { data })
}

// Redux action for Get Increase Descrease Token Supply List Success
export function getIncreDecreTokenSupplyListFailure() {
    return action(GET_INCRE_DECRE_TOKEN_SUPPLY_FAILURE)
}

// Redux action for Add Increase Token Supply List
export function addIncreaseToken(payload = {}) {
    return action(ADD_INCREASE_TOKEN, { payload })
}

// Redux action for Add Increase Token Supply List Success
export function addIncreaseTokenSuccess(data) {
    return action(ADD_INCREASE_TOKEN_SUCCESS, { data })
}

// Redux action for Add Increase Token Supply List Success
export function addIncreaseTokenFailure() {
    return action(ADD_INCREASE_TOKEN_FAILURE)
}

// Redux action for Clear Increase Token Supply List
export function clearIncreaseToken() {
    return action(CLEAR_INCREASE_TOKEN)
}

// Redux action for Add Decrease Token Supply List
export function addDecreaseToken(payload = {}) {
    return action(ADD_DECREASE_TOKEN, { payload })
}

// Redux action for Add Decrease Token Supply List Success
export function addDecreaseTokenSuccess(data) {
    return action(ADD_DECREASE_TOKEN_SUCCESS, { data })
}

// Redux action for Add Decrease Token Supply List Success
export function addDecreaseTokenFailure() {
    return action(ADD_DECREASE_TOKEN_FAILURE)
}