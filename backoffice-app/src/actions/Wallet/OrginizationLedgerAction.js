import {
    //wallets...
    GET_ORG_WALLETS,
    GET_ORG_WALLETS_SUCCESS,
    GET_ORG_WALLETS_FAILURE,

    //ledger...
    GET_ORG_LEDGER,
    GET_ORG_LEDGER_SUCCESS,
    GET_ORG_LEDGER_FAILURE,

    //clear data
    CLEAR_ORGINAZIATION_LEDGER,
} from "../ActionTypes";

//Redux action for get organization wallets 
export const getOrganizationWallets = (data) => ({
    type: GET_ORG_WALLETS,
    payload: data
});
//Redux action for get organization wallets Success
export const getOrganizationWalletsSuccess = (response) => ({
    type: GET_ORG_WALLETS_SUCCESS,
    payload: response
});
//Redux action for get organization wallets failure
export const getOrganizationWalletsFailure = (error) => ({
    type: GET_ORG_WALLETS_FAILURE,
    payload: error
});
//Redux action for get organization wallet ledger 
export const getOrganizationLedger = (data) => ({
    type: GET_ORG_LEDGER,
    payload: data
});
//Redux action for get organization wallet ledger Success
export const getOrganizationLedgerSuccess = (response) => ({
    type: GET_ORG_LEDGER_SUCCESS,
    payload: response
});
//Redux action for get organization wallet ledger Failure
export const getOrganizationLedgerFailure = (error) => ({
    type: GET_ORG_LEDGER_FAILURE,
    payload: error
});
//Redux action  for clear response
export const clearOrginizationLedger = () => ({
    type: CLEAR_ORGINAZIATION_LEDGER,
});
