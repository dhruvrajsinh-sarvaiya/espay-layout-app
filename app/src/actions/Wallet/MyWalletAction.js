import {
    //list all wallets
    LISTALLWALLETS,
    LISTALLWALLETS_SUCCESS,
    LISTALLWALLETS_FAILURE,

    //list wallet users...
    LISTWALLETUSERS,
    LISTWALLETUSERS_SUCCESS,
    LISTWALLETUSERS_FAILURE,

    //add wallet user...
    ADDWALLETUSER,
    ADDWALLETUSER_SUCCESS,
    ADDWALLETUSER_FAILURE,

    //accept reject wallet request...
    ACCEPTREJECTWALLETREQUEST,
    ACCEPTREJECTWALLETREQUEST_SUCCESS,
    ACCEPTREJECTWALLETREQUEST_FAILURE,

    //Clear Add User Data
    CLEAR_ADD_USER_DATA,

    //List User Wallet Request
    LIST_USER_WALLET_REQUEST,
    LIST_USER_WALLET_REQUEST_SUCCESS,
    LIST_USER_WALLET_REQUEST_FAILURE,

} from '../ActionTypes';

// Redux action to Get Wallets
export const getAllWallets = (request) => ({
    type: LISTALLWALLETS,
    request: request
});
// Redux action to Get Wallets Success
export const getAllWalletsSuccess = (response) => ({
    type: LISTALLWALLETS_SUCCESS,
    payload: response
});
// Redux action to Get Wallets Failure
export const getAllWalletsFailed = (error) => ({
    type: LISTALLWALLETS_FAILURE,
    error: error
});

// Redux action to Get Wallet User List
export const getWalletUserList = (WalletId) => ({
    type: LISTWALLETUSERS,
    WalletId: WalletId
});
// Redux action to Get Wallet User List Success
export const getWalletUserListSuccess = (response) => ({
    type: LISTWALLETUSERS_SUCCESS,
    payload: response
});
// Redux action to Get Wallet User List Failure
export const getWalletUserListFailed = (error) => ({
    type: LISTWALLETUSERS_FAILURE,
    error: error
});

// Redux action to Add Walllet User
export const addWalletUser = (request) => ({
    type: ADDWALLETUSER,
    request: request
});
// Redux action to Add Walllet User Success
export const addWalletUserSuccess = (response) => ({
    type: ADDWALLETUSER_SUCCESS,
    payload: response
});
// Redux action to Add Walllet User Failure
export const addWalletUserFailed = (error) => ({
    type: ADDWALLETUSER_FAILURE,
    payload: error
});

// Redux action to Wallet Request 
export const walletRequestAction = (request) => ({
    type: ACCEPTREJECTWALLETREQUEST,
    request: request
});
// Redux action to Wallet Request Success
export const walletRequestActionSuccess = (response) => ({
    type: ACCEPTREJECTWALLETREQUEST_SUCCESS,
    payload: response
});
// Redux action to Wallet Request Failure
export const walletRequestActionFailed = (error) => ({
    type: ACCEPTREJECTWALLETREQUEST_FAILURE,
    payload: error
});

export const clearAddUserData = () => ({
    type: CLEAR_ADD_USER_DATA,
});

/* List User Wallet Request  */
export const getListUserWalletRequest = () => ({
    type: LIST_USER_WALLET_REQUEST,
});

export const getListUserWalletRequestSuccess = (response) => ({
    type: LIST_USER_WALLET_REQUEST_SUCCESS,
    payload: response
});

export const getListUserWalletRequestFailed = (error) => ({
    type: LIST_USER_WALLET_REQUEST_FAILURE,
    error: error
});
