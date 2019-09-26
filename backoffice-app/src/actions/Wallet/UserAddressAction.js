import {
    // user address list 
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,

    //block/unblock
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,

    //DestroyBlackFund
    DESTROY_BLACKFUND,
    DESTROY_BLACKFUND_SUCCESS,
    DESTROY_BLACKFUND_FAILURE,

    //clear data
    CLEAR_USER_ADDRESS_DATA
} from '../ActionTypes'

// Redux action get User Address List
export const getListBlockUnblockUserAddress = (request) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    payload: request
});
// Redux action get User Address List success
export const getListBlockUnblockUserAddressSuccess = (response) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    payload: response
});
// Redux action get User Address List Failure
export const getListBlockUnblockUserAddressFailure = (error) => ({
    type: GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    payload: error
});

// Redux action block/unblock User
export const getBlockUnblockUserAddress = (request) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS,
    payload: request
});
// Redux action block/unblock User success
export const getBlockUnblockUserAddressSuccess = (response) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    payload: response
});
// Redux action block/unblock User Failure
export const getBlockUnblockUserAddressFailure = (error) => ({
    type: GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    payload: error
});

// Redux action Destroy User
export const destroyBlackfund = (request) => ({
    type: DESTROY_BLACKFUND,
    payload: request
});
// Redux action Destroy User success
export const destroyBlackfundSuccess = (response) => ({
    type: DESTROY_BLACKFUND_SUCCESS,
    payload: response
});
// Redux action Destroy User Failure
export const destroyBlackfundFailure = (error) => ({
    type: DESTROY_BLACKFUND_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearUserAddressData = () => ({
    type: CLEAR_USER_ADDRESS_DATA,
});

