import {
    //user wallets list 
    ARBI_LIST_WALLET_MASTER,
    ARBI_LIST_WALLET_MASTER_SUCCESS,
    ARBI_LIST_WALLET_MASTER_FAILURE,

    //clear data
    CLEAR_ARBI_LIST_WALLET_MASTER
} from "../ActionTypes";

//Redux action get user wallets list 
export const getArbiUserWalletsList = (request) => ({
    type: ARBI_LIST_WALLET_MASTER,
    payload: request
});
//Redux action get user wallets list success
export const getArbiUserWalletsListSuccess = (response) => ({
    type: ARBI_LIST_WALLET_MASTER_SUCCESS,
    payload: response
});
//Redux action get user wallets list Faillure
export const getArbiUserWalletsListFailure = (error) => ({
    type: ARBI_LIST_WALLET_MASTER_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearArbiUserWalletsData = () => ({
    type: CLEAR_ARBI_LIST_WALLET_MASTER,
});

