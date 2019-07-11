/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Login Actions
 */

 //Import action types form type.js
 import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_BLOCKCHAIN_SUCCESS, 
    LOGIN_BLOCKCHAIN_FAILURE, 
    LOGIN_BLOCKCHAIN
} from '../types';

/**
 * Redux Action Login Success
 */
export const loginSuccess = (data) => ({
    type: LOGIN_SUCCESS,
    payload: data
});

/**
 * Redux Action Login Failure
 */
export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error
})

/**
 * Redux Action To Login
 */
export const login = (data) => ({
    type: LOGIN,
    payload: data
})

/**
 * Redux Action Login Blockchain Success
 */
export const loginBlockchainSuccess = (data) => ({
    type: LOGIN_BLOCKCHAIN_SUCCESS,
    payload: data
});

/**
 * Redux Action Login Blockchain Failure
 */
export const loginBlockchainFailure = (error) => ({
    type: LOGIN_BLOCKCHAIN_FAILURE,
    payload: error
})

/**
 * Redux Action To Login Blockchain
 */
export const loginBlockchain = (data) => ({
    type: LOGIN_BLOCKCHAIN,
    payload: data
})
