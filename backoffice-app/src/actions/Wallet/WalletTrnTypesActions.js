import {
    // Get Wallet Trn Types List
    GET_WALLET_TRN_TYPES_LIST,
    GET_WALLET_TRN_TYPES_LIST_SUCCESS,
    GET_WALLET_TRN_TYPES_LIST_FAILURE,

    // Change Wallet Transaction Type
    CHANGE_WALLET_TRN_TYPE,
    CHANGE_WALLET_TRN_TYPE_SUCCESS,
    CHANGE_WALLET_TRN_TYPE_FAILURE,

    // Clear Wallet Trn Types Data
    CLEAR_WALLET_TRN_TYPES_DATA,

    // Add Wallet Trn Types
    ADD_WALLET_TRN_TYPES,
    ADD_WALLET_TRN_TYPES_SUCCESS,
    ADD_WALLET_TRN_TYPES_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Wallet Transaction Types List
export function getWalletTrnTypesList() {
    return action(GET_WALLET_TRN_TYPES_LIST)
}

// Redux action for Get Wallet Transaction Types List Success
export function getWalletTrnTypesListSuccess(data) {
    return action(GET_WALLET_TRN_TYPES_LIST_SUCCESS, { data })
}

// Redux action for Get Wallet Transaction Types List Success
export function getWalletTrnTypesListFailure() {
    return action(GET_WALLET_TRN_TYPES_LIST_FAILURE)
}

// Redux action for Change Wallet Transaction Types List
export function changeWalletTrnTypes(payload) {
    return action(CHANGE_WALLET_TRN_TYPE, { payload })
}

// Redux action for Change Wallet Transaction Types List Success
export function changeWalletTrnTypesSuccess(data) {
    return action(CHANGE_WALLET_TRN_TYPE_SUCCESS, { data })
}

// Redux action for Change Wallet Transaction Types List Success
export function changeWalletTrnTypesFailure() {
    return action(CHANGE_WALLET_TRN_TYPE_FAILURE)
}

// Redux action for Add Wallet Transaction Types List
export function addWalletTrnTypes(payload) {
    return action(ADD_WALLET_TRN_TYPES, { payload })
}

// Redux action for Add Wallet Transaction Types List Success
export function addWalletTrnTypesSuccess(data) {
    return action(ADD_WALLET_TRN_TYPES_SUCCESS, { data })
}

// Redux action for Add Wallet Transaction Types List Success
export function addWalletTrnTypesFailure() {
    return action(ADD_WALLET_TRN_TYPES_FAILURE)
}

// Redux action for Clear Wallet Transaction Types Data
export function clearWalletTrnTypes() {
    return action(CLEAR_WALLET_TRN_TYPES_DATA)
}