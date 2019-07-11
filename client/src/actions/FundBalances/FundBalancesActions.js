/* 
    Developer : Nishant Vadgama
    Date : 25-10-2018
    File Comment : Fund Balance Actions methods
*/

import {
    // get all balances
    GET_ALL_BALANCE,
    GET_ALL_BALANCE_SUCCESS,
    GET_ALL_BALANCE_FAILURE,
    // get seprated balance
    GET_WALLETBALANCE,
    GET_WALLETBALANCE_SUCCESS,
    GET_WALLETBALANCE_FAILURE,
} from '../types';

//get all balance
export const getAllBalance = () => ({
    type: GET_ALL_BALANCE
});
export const getAllBalanceSuccess = (response) => ({
    type: GET_ALL_BALANCE_SUCCESS,
    payload: response
})
export const getAllBalanceFailure = (error) => ({
    type: GET_ALL_BALANCE_FAILURE,
    payload: error
})

//get all balance
export const getWalletsBalance = (walletType) => ({
    type: GET_WALLETBALANCE,
    walletType : walletType
});
export const getWalletsBalanceSuccess = (response) => ({
    type: GET_WALLETBALANCE_SUCCESS,
    payload: response
})
export const getWalletsBalanceFailure = (error) => ({
    type: GET_WALLETBALANCE_FAILURE,
    payload: error
})