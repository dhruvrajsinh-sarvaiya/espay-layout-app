/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing action methods lsit
*/
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
    //list wallet requests...
    LISTWALLETREQUEST,
    LISTWALLETREQUEST_SUCCESS,
    LISTWALLETREQUEST_FAILURE,
    //accept reject wallet request...
    ACCEPTREJECTWALLETREQUEST,
    ACCEPTREJECTWALLETREQUEST_SUCCESS,
    ACCEPTREJECTWALLETREQUEST_FAILURE
} from '../types';

/* List all wallets */
export const getAllWallets = (request) => ({
    type: LISTALLWALLETS,
    request: request
});
export const getAllWalletsSuccess = (response) => ({
    type: LISTALLWALLETS_SUCCESS,
    payload: response
});
export const getAllWalletsFailed = (error) => ({
    type: LISTALLWALLETS_FAILURE,
    error: error
});

/* List wallet users */
export const getWalletUserList = (WalletId) => ({
    type: LISTWALLETUSERS,
    WalletId: WalletId
});
export const getWalletUserListSuccess = (response) => ({
    type: LISTWALLETUSERS_SUCCESS,
    payload: response
});
export const getWalletUserListFailed = (error) => ({
    type: LISTWALLETUSERS_FAILURE,
    error: error
});

/* Add wallet users */
export const addWalletUser = (request) => ({
    type: ADDWALLETUSER,
    request: request
});
export const addWalletUserSuccess = (response) => ({
    type: ADDWALLETUSER_SUCCESS,
    payload: response
});
export const addWalletUserFailed = (error) => ({
    type: ADDWALLETUSER_FAILURE,
    payload: error
});

/* list wallet requests */
export const listWalletRequests = (request) => ({
    type: LISTWALLETREQUEST,
});
export const listWalletRequestsSuccess = (response) => ({
    type: LISTWALLETREQUEST_SUCCESS,
    payload: response
});
export const listWalletRequestsFailed = (error) => ({
    type: LISTWALLETREQUEST_FAILURE,
    payload: error
});

/* accept reject wallet request */
export const walletRequestAction = (request) => ({
    type: ACCEPTREJECTWALLETREQUEST,
    request: request
});
export const walletRequestActionSuccess = (response) => ({
    type: ACCEPTREJECTWALLETREQUEST_SUCCESS,
    payload: response
});
export const walletRequestActionFailed = (error) => ({
    type: ACCEPTREJECTWALLETREQUEST_FAILURE,
    payload: error
});