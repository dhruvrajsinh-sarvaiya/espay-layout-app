/* 
    Developer : Parth Andhariya
    Date : 24-05-2019
    File Comment : Block Unblock User Address Action
*/
import {
    // list 
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    //block/unblock
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    //added by vishva for DestroyBlackFund
    DESTROY_BLACKFUND,
    DESTROY_BLACKFUND_SUCCESS,
    DESTROY_BLACKFUND_FAILURE
} from "../types";
/* list Block Unblock Address */
export const getListBlockUnblockUserAddress = (request) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    request: request
});
export const getListBlockUnblockUserAddressSuccess = (response) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    payload: response
});
export const getListBlockUnblockUserAddressFailure = (error) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    payload: error
});
/*  Block Unblock Address Action */
export const getBlockUnblockUserAddress = (request) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS,
    request: request
});
export const getBlockUnblockUserAddressSuccess = (response) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    payload: response
});
export const getBlockUnblockUserAddressFailure = (error) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    payload: error
});
/*  destroy black fund Action */
export const destroyBlackfund = (request) => ({
    type: DESTROY_BLACKFUND,
    request: request
});
export const destroyBlackfundSuccess = (response) => ({
    type: DESTROY_BLACKFUND_SUCCESS,
    payload: response
});
export const destroyBlackfundFailure = (error) => ({
    type: DESTROY_BLACKFUND_FAILURE,
    payload: error
});

