/* 
    Developer : Nishant Vadgama
    Date : 24-11-2018
    File Comment : wallet dashboard super admin view actions
*/
import {
    //Wallet Details
    WALLETDETAILS,
    WALLETDETAILS_SUCCESS,
    WALLETDETAILS_FAIL,
    //Wallet Types Details
    WALLETTYPES,
    WALLETTYPES_SUCCESS,
    WALLETTYPES_FAIL,
    // recent charges
    RECENTCHARGES,
    RECENTCHARGES_SUCCESS,
    RECENTCHARGES_FAIL,
    // recent usage
    RECENTUSAGE,
    RECENTUSAGE_SUCCESS,
    RECENTUSAGE_FAIL,
    // recent commission
    RECENTCOMMISION,
    RECENTCOMMISION_SUCCESS,
    RECENTCOMMISION_FAIL,
    // wallet transaction types
    WALLETTRNTYPES,
    WALLETTRNTYPES_SUCCESS,
    WALLETTRNTYPES_FAIL,
    //transaction graph data
    TRNGRAPH,
    TRNGRAPH_SUCCESS,
    TRNGRAPH_FAIL,
    //wallet user details
    WALLETUSERDETAILS,
    WALLETUSERDETAILS_SUCCESS,
    WALLETUSERDETAILS_FAIL,
    //CHANNELDETAILS
    CHANNELDETAILS,
    CHANNELDETAILS_SUCCESS,
    CHANNELDETAILS_FAIL
} from '../types';

// get wallet details
export const getWalletDetails = () => ({
    type: WALLETDETAILS
});
export const getWalletDetailsSuccess = (response) => ({
    type: WALLETDETAILS_SUCCESS,
    payload: response
});
export const getWalletDetailsFail = (error) => ({
    type: WALLETDETAILS_FAIL,
    payload: error
});

// get wallet types
export const getWalletTypes = () => ({
    type: WALLETTYPES
});
export const getWalletTypesSuccess = (response) => ({
    type: WALLETTYPES_SUCCESS,
    payload: response
});
export const getWalletTypesFail = (error) => ({
    type: WALLETTYPES_FAIL,
    payload: error
});


/* Recent Charges records */
export const getRecentCharges = () => ({
    type: RECENTCHARGES
});
export const getRecentChargesSuccess = (response) => ({
    type: RECENTCHARGES_SUCCESS,
    payload: response
});
export const getRecentChargesFail = (error) => ({
    type: RECENTCHARGES_FAIL,
    payload: error
});

/* Recent Usage records */
export const getRecentUsage = () => ({
    type: RECENTUSAGE
});
export const getRecentUsageSuccess = (response) => ({
    type: RECENTUSAGE_SUCCESS,
    payload: response
});
export const getRecentUsageFail = (error) => ({
    type: RECENTUSAGE_FAIL,
    payload: error
});

/* Recent Charges records */
export const getRecentCommission = () => ({
    type: RECENTCOMMISION
});
export const getRecentCommissionSuccess = (response) => ({
    type: RECENTCOMMISION_SUCCESS,
    payload: response
});
export const getRecentCommissionFail = (error) => ({
    type: RECENTCOMMISION_FAIL,
    payload: error
});



/* Wallet Transaction types */
export const getWalletTrnTypes = () => ({
    type: WALLETTRNTYPES
});
export const getWalletTrnTypesSuccess = (response) => ({
    type: WALLETTRNTYPES_SUCCESS,
    payload: response
});
export const getWalletTrnTypesFail = (error) => ({
    type: WALLETTRNTYPES_FAIL,
    payload: error
});

/* Transaction graph methods */
export const getTransactionGraphData = () => ({
    type: TRNGRAPH
});
export const getTransactionGraphDataSuccess = (response) => ({
    type: TRNGRAPH_SUCCESS,
    payload: response
});
export const getTransactionGraphDataFail = (error) => ({
    type: TRNGRAPH_FAIL,
    payload: error
});

/* wallet user details methods */
export const getWalletUserDetails = () => ({
    type: WALLETUSERDETAILS
});
export const getWalletUserDetailsSuccess = (response) => ({
    type: WALLETUSERDETAILS_SUCCESS,
    payload: response
});
export const getWalletUserDetailsFail = (error) => ({
    type: WALLETUSERDETAILS_FAIL,
    payload: error
});

/* CHANNEL DETAILS METHODS */
export const getChannelDetails = () => ({
    type: CHANNELDETAILS
});
export const getChannelDetailsSuccess = (response) => ({
    type: CHANNELDETAILS_SUCCESS,
    payload: response
});
export const getChannelDetailsFail = (error) => ({
    type: CHANNELDETAILS_FAIL,
    payload: error
});