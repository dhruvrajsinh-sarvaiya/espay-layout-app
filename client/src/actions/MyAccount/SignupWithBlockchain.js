/**
 * Auther : Salim Deraiya
 * Created : 16/10/2018
 * Signup With Blockchain Actions
 */

import {
    SIGNUP_WITH_BLOCKCHAIN,
    SIGNUP_WITH_BLOCKCHAIN_SUCCESS,
    SIGNUP_WITH_BLOCKCHAIN_FAILURE
} from "../types";


/**
 * Redux Action To Signup with Blockchain
 */
export const signUpWithBlockchain = (data) => ({
    type: SIGNUP_WITH_BLOCKCHAIN,
    payload: data
});

/**
 * Redux Action To Signup with Blockchain Success
 */
export const signUpWithBlockchainSuccess = (data) => ({
    type: SIGNUP_WITH_BLOCKCHAIN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup with Blockchain Failure
 */
export const signUpWithBlockchainFailure = (error) => ({
    type: SIGNUP_WITH_BLOCKCHAIN_FAILURE,
    payload: error
});