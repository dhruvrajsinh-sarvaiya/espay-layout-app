/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : Marging Trading Wallet Actions
*/

import {
    //list
    LIST_MARGIN_WALLETS,
    LIST_MARGIN_WALLETS_SUCCESS,
    LIST_MARGIN_WALLETS_FAILURE,
    // //create
    // CREATE_MARGIN_WALLETS,
    // CREATE_MARGIN_WALLETS_SUCCESS,
    // CREATE_MARGIN_WALLETS_FAILURE,
    // //add leverage
    // ADD_LEVERAGE,
    // ADD_LEVERAGE_SUCCESS,
    // ADD_LEVERAGE_FAILURE,
    // //confirm leverage request
    // ADD_LEVERAGE_CONFIRMATION,
    // ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    // ADD_LEVERAGE_CONFIRMATION_FAILURE
} from '../../types';

/* List maging wallets */
export const getMaringWalletList = (request) => ({
    type: LIST_MARGIN_WALLETS,
    request: request
});
export const getMaringWalletListSuccess = (response) => ({
    type: LIST_MARGIN_WALLETS_SUCCESS,
    payload: response
});
export const getMaringWalletListFailure = (error) => ({
    type: LIST_MARGIN_WALLETS_FAILURE,
    payload: error
});

// /* create a margin wallet */
// export const createMarginWallet = (WalletTypeId) => ({
//     type: CREATE_MARGIN_WALLETS,
//     WalletTypeId: WalletTypeId
// });
// export const createMarginWalletSuccess = (response) => ({
//     type: CREATE_MARGIN_WALLETS_SUCCESS,
//     payload: response
// });
// export const createMarginWalletFailure = (error) => ({
//     type: CREATE_MARGIN_WALLETS_FAILURE,
//     payload: error
// });

// /* add leverage */
// export const addLeverageWithWallet = (request) => ({
//     type: ADD_LEVERAGE,
//     request: request
// });
// export const addLeverageWithWalletSuccess = (response) => ({
//     type: ADD_LEVERAGE_SUCCESS,
//     payload: response
// });
// export const addLeverageWithWalletFailure = (error) => ({
//     type: ADD_LEVERAGE_FAILURE,
//     payload: error
// });

// /* confirm leverage */
// export const confirmAddLeverage = (request) => ({
//     type: ADD_LEVERAGE_CONFIRMATION,
//     request: request
// })
// export const confirmAddLeverageSuccess = (response) => ({
//     type: ADD_LEVERAGE_CONFIRMATION_SUCCESS,
//     payload: response
// })
// export const confirmAddLeverageFailure = (error) => ({
//     type: ADD_LEVERAGE_CONFIRMATION_FAILURE,
//     payload: error
// })