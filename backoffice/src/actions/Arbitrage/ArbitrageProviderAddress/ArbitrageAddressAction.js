/* 
    Developer : Vishva shah
    FIle Comment : Arbitrage Address action method
    Date : 12-06-2019
*/

import {
    // get list
    GET_ARBITRAGE_ADDRESS_LIST,
    GET_ARBITRAGE_ADDRESS_LIST_SUCCESS,
    GET_ARBITRAGE_ADDRESS_LIST_FAILURE,
    //insert&update record
    INSERT_UPDATE_ARBITRAGEADDRESS,
    INSERT_UPDATE_ARBITRAGEADDRESS_SUCCESS,
    INSERT_UPDATE_ARBITRAGEADDRESS_FAILURE
} from "Actions/types";

// get arbitrage address list
export const getArbitrageAddressList = (request) => ({
    type: GET_ARBITRAGE_ADDRESS_LIST,
    payload: request
});
export const getArbitrageAddressListSuccess = response => ({
    type: GET_ARBITRAGE_ADDRESS_LIST_SUCCESS,
    payload: response
});
export const getArbitrageAddressListFailure = error => ({
    type: GET_ARBITRAGE_ADDRESS_LIST_FAILURE,
    payload: error
});
//insert & update arbitrage address record
export const insertUpdateArbitrageAddress = (request) => ({
    type: INSERT_UPDATE_ARBITRAGEADDRESS,
    payload: request
});
export const insertUpdateArbitrageAddressSuccess = response => ({
    type: INSERT_UPDATE_ARBITRAGEADDRESS_SUCCESS,
    payload: response
});
export const insertUpdateArbitrageAddressFailure = error => ({
    type: INSERT_UPDATE_ARBITRAGEADDRESS_FAILURE,
    payload: error
});