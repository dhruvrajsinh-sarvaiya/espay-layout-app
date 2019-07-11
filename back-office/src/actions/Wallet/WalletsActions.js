import {
    // get all wallet list
    GET_ALL_WALLETS,
    GET_ALL_WALLETS_SUCCESS,
    GET_ALL_WALLETS_FAILURE,
    // get auth user list
    GETWALLETAUTHUSERS,
    GETWALLETAUTHUSERS_SUCCESS,
    GETWALLETAUTHUSERS_FAILURE,
    // get wallet details by id
    GETWALLETBYID,
    GETWALLETBYID_SUCCESS,
    GETWALLETBYID_FAILURE,
    //export wallets
    EXPORT_WALLETS,
    EXPORT_WALLETS_SUCCESS,
    EXPORT_WALLETS_FAILURE
} from "../types";

// get all wallet list
export const getAllWallets = (request) => ({
    type: GET_ALL_WALLETS,
    request: request
});

// get user wallets success
export const getAllWalletsSuccess = (response) => ({
    type: GET_ALL_WALLETS_SUCCESS,
    payload: response
});

// get user wallets failure
export const getAllWalletsFailure = (error) => ({
    type: GET_ALL_WALLETS_FAILURE,
    payload: error
});


/* get wallet's auth user list */
export const getWalletsAuthUserList = (request) => ({
    type: GETWALLETAUTHUSERS,
    request: request
});
export const getWalletsAuthUserListSuccess = (response) => ({
    type: GETWALLETAUTHUSERS_SUCCESS,
    payload: response.Data
});
export const getWalletsAuthUserListFailure = (error) => ({
    type: GETWALLETAUTHUSERS_FAILURE,
    payload: error
});

/* get wallet details by wallet id */
export const getWalletById = (request) => ({
    type: GETWALLETBYID,
    request: request
});
export const getWalletByIdSuccess = (response) => ({
    type: GETWALLETBYID_SUCCESS,
    payload: response.Data
});
export const getWalletByIdFailure = (error) => ({
    type: GETWALLETBYID_FAILURE,
    payload: error
});

/* export existing wallets */
export const exportWallets = (request) => ({
    type: EXPORT_WALLETS,
    request: request
});
export const exportWalletsSuccess = (response) => ({
    type: EXPORT_WALLETS_SUCCESS,
    payload: response
});
export const exportWalletsFailure = (error) => ({
    type: EXPORT_WALLETS_FAILURE,
    payload: error
});