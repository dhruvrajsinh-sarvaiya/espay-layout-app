import {
    //Organization Details
    ORGDETAILS,
    ORGDETAILS_SUCCESS,
    ORGDETAILS_FAIL,

    //User Details
    USERDETAILS,
    USERDETAILS_SUCCESS,
    USERDETAILS_FAIL,

    //User Details
    TYPEDETAILS,
    TYPEDETAILS_SUCCESS,
    TYPEDETAILS_FAIL,

    //Role Details
    ROLEDETAILS,
    ROLEDETAILS_SUCCESS,
    ROLEDETAILS_FAIL,

    //WALLET TYPE LIST
    WALLETTYPELIST,
    WALLETTYPELIST_SUCCESS,
    WALLETTYPELIST_FAIL,

    //WALLET TYPE LIST
    WALLETSUMMARY,
    WALLETSUMMARY_SUCCESS,
    WALLETSUMMARY_FAIL,

    //WALLET STATUS TYPE LIST
    WALLETSTATUSDETAILS,
    WALLETSTATUSDETAILS_SUCCESS,
    WALLETSTATUSDETAILS_FAIL,

    //User Graph Details
    USERGRAPH,
    USERGRAPH_SUCCESS,
    USERGRAPH_FAIL,

    //Organization Graph Details
    OGRGRAPH,
    OGRGRAPH_SUCCESS,
    OGRGRAPH_FAIL,
} from '../ActionTypes';

// get organization details
export const getOrganizationsDetails = () => ({
    type: ORGDETAILS
});
export const getOrganizationsDetailsSuccess = (response) => ({
    type: ORGDETAILS_SUCCESS,
    payload: response
});
export const getOrganizationsDetailsFail = (error) => ({
    type: ORGDETAILS_FAIL,
    payload: error
});

// get user details
export const getUsersDetails = () => ({
    type: USERDETAILS
});
export const getUsersDetailsSuccess = (response) => ({
    type: USERDETAILS_SUCCESS,
    payload: response
});
export const getUsersDetailsFail = (error) => ({
    type: USERDETAILS_FAIL,
    payload: error
});

// get user type details
export const getUserTypesDetails = () => ({
    type: TYPEDETAILS
});
export const getUserTypesDetailsSuccess = (response) => ({
    type: TYPEDETAILS_SUCCESS,
    payload: response
});
export const getUserTypesDetailsFail = (error) => ({
    type: TYPEDETAILS_FAIL,
    payload: error
});

// get role details
export const getRoleDetails = () => ({
    type: ROLEDETAILS
});
export const getRoleDetailsSuccess = (response) => ({
    type: ROLEDETAILS_SUCCESS,
    payload: response
});
export const getRoleDetailsFail = (error) => ({
    type: ROLEDETAILS_FAIL,
    payload: error
});

/* WALLET TYPE LIST METHODS */
export const getWalletTypeList = () => ({
    type: WALLETTYPELIST
});
export const getWalletTypeListSuccess = (response) => ({
    type: WALLETTYPELIST_SUCCESS,
    payload: response
});
export const getWalletTypeListFail = (error) => ({
    type: WALLETTYPELIST_FAIL,
    payload: error
});

/* WALLET SUMMARY METHODS */
export const getWalletSummary = () => ({
    type: WALLETSUMMARY
});
export const getWalletSummarySuccess = (response) => ({
    type: WALLETSUMMARY_SUCCESS,
    payload: response
});
export const getWalletSummaryFail = (error) => ({
    type: WALLETSUMMARY_FAIL,
    payload: error
});

// get wallet status details
export const getWalletStatusDetails = () => ({
    type: WALLETSTATUSDETAILS
});
export const getWalletStatusDetailsSuccess = (response) => ({
    type: WALLETSTATUSDETAILS_SUCCESS,
    payload: response
});
export const getWalletStatusDetailsFail = (error) => ({
    type: WALLETSTATUSDETAILS_FAIL,
    payload: error
});

// get user graph
export const getUserGraph = () => ({
    type: USERGRAPH
});
export const getUserGraphSuccess = (response) => ({
    type: USERGRAPH_SUCCESS,
    payload: response
});
export const getUserGraphFail = (error) => ({
    type: USERGRAPH_FAIL,
    payload: error
});

// get organization graph
export const getOrganizationGraph = () => ({
    type: OGRGRAPH
});
export const getOrganizationGraphSuccess = (response) => ({
    type: OGRGRAPH_SUCCESS,
    payload: response
});
export const getOrganizationGraphFail = (error) => ({
    type: OGRGRAPH_FAIL,
    payload: error
});
