import {
    //wallettypes delete 
    DELETE_WALLET_TYPE_MASTER,
    DELETE_WALLET_TYPE_MASTER_SUCCESS,
    DELETE_WALLET_TYPE_MASTER_FAILURE,

    //wallettypes add 
    ADD_WALLET_TYPE_MASTER,
    ADD_WALLET_TYPE_MASTER_SUCCESS,
    ADD_WALLET_TYPE_MASTER_FAILURE,

    //wallettypes update 
    UPDATE_WALLET_TYPE_MASTER,
    UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    UPDATE_WALLET_TYPE_MASTER_FAILURE,

    //for clear response
    CLEAR_WALLET_TYPE_MASTER_DATA
} from '../ActionTypes'

// Redux action Get wallettypes delete 
export const deleteWalletTypeMaster = (request) => ({
    type: DELETE_WALLET_TYPE_MASTER,
    payload: request
});
// Redux action Get wallettypes delete success
export const deleteWalletTypeMasterSuccess = (response) => ({
    type: DELETE_WALLET_TYPE_MASTER_SUCCESS,
    payload: response
});
// Redux action Get wallettypes delete Failure
export const deleteWalletTypeMasterFailure = (error) => ({
    type: DELETE_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

// Redux action Get wallettypes add 
export const addWalletTypeMaster = (WalletTypeMaster) => ({
    type: ADD_WALLET_TYPE_MASTER,
    payload: WalletTypeMaster
});
// Redux action Get wallettypes add success
export const addWalletTypeMasterSuccess = (response) => ({
    type: ADD_WALLET_TYPE_MASTER_SUCCESS,
    payload: response
});
// Redux action Get wallettypes add Failure
export const addWalletTypeMasterFailure = (error) => ({
    type: ADD_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

// Redux action Get wallettypes edit 
export const onUpdateWalletTypeMaster = (updateWalletTypeMaster) => ({
    type: UPDATE_WALLET_TYPE_MASTER,
    payload: updateWalletTypeMaster
});
// Redux action Get wallettypes edit success
export const onUpdateWalletTypeMasterSuccess = (response) => ({
    type: UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    payload: response
});
// Redux action Get wallettypes edit Failure
export const onUpdateWalletTypeMasterFail = (error) => ({
    type: UPDATE_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearWalletTypesData = () => ({
    type: CLEAR_WALLET_TYPE_MASTER_DATA,
});





