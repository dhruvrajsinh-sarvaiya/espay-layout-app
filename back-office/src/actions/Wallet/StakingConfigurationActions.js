/* 
    Developer : Nishant Vadgama
    Date : 28-12-2018
    File Comment : staking configuration action methods
*/
import {
    //master staking list...
    MASTERSTAKINGLIST,
    MASTERSTAKINGLIST_SUCCESS,
    MASTERSTAKINGLIST_FAILURE,
    //insert/update staking master
    INSERTUPDATESTAKINGMASTER,
    INSERTUPDATESTAKINGMASTER_SUCCESS,
    INSERTUPDATESTAKINGMASTER_FAILURE,
    //delete staking master...
    DELETEMASTERSTAKING,
    DELETEMASTERSTAKING_SUCCESS,
    DELETEMASTERSTAKING_FAILURE,
    //LIST
    STAKINGLIST,
    STAKINGLIST_SUCCESS,
    STAKINGLIST_FAILURE,
    //Add
    ADDSTAKINGCONFIG,
    ADDSTAKINGCONFIG_SUCCESS,
    ADDSTAKINGCONFIG_FAILURE,
    //DELETE
    DELETESTAKINGCONFIG,
    DELETESTAKINGCONFIG_SUCCESS,
    DELETESTAKINGCONFIG_FAILURE,
    // GET BY ID
    GETSTAKINGCONFIG,
    GETSTAKINGCONFIG_SUCCESS,
    GETSTAKINGCONFIG_FAILURE
} from '../types';

// get staking master list
export const getMasterStakingList = (request) => ({
    type: MASTERSTAKINGLIST,
    request: request
});
export const getMasterStakingListSuccess = (response) => ({
    type: MASTERSTAKINGLIST_SUCCESS,
    payload: response
});
export const getMasterStakingListFail = (error) => ({
    type: MASTERSTAKINGLIST_FAILURE,
    payload: error
});

// insert update wallet master
export const insertUpdateWalletMaster = (request) => ({
    type: INSERTUPDATESTAKINGMASTER,
    request: request
});
export const insertUpdateWalletMasterSuccess = (response) => ({
    type: INSERTUPDATESTAKINGMASTER_SUCCESS,
    payload: response
});
export const insertUpdateWalletMasterFail = (error) => ({
    type: INSERTUPDATESTAKINGMASTER_FAILURE,
    payload: error
});

//DELETE master STAKING 
export const deleteMasterStaking = (PolicyMasterId) => ({
    type: DELETEMASTERSTAKING,
    PolicyMasterId: PolicyMasterId
});
export const deleteMasterStakingSuccess = (response) => ({
    type: DELETEMASTERSTAKING_SUCCESS,
    payload: response
});
export const deleteMasterStakingFail = (error) => ({
    type: DELETEMASTERSTAKING_FAILURE,
    payload: error
});

// get staking configuration list
export const getStakingConfigList = (request) => ({
    type: STAKINGLIST,
    request: request
});
export const getStakingConfigListSuccess = (response) => ({
    type: STAKINGLIST_SUCCESS,
    payload: response
});
export const getStakingConfigListFail = (error) => ({
    type: STAKINGLIST_FAILURE,
    payload: error
});

// add new stacking configuration
export const addStakingConfig = (request) => ({
    type: ADDSTAKINGCONFIG,
    request: request
});
export const addStakingConfigSuccess = (response) => ({
    type: ADDSTAKINGCONFIG_SUCCESS,
    payload: response
});
export const addStakingConfigFail = (error) => ({
    type: ADDSTAKINGCONFIG_FAILURE,
    payload: error
});

//DELETE STAKING CONFIGURATION
export const deleteStakingConfig = (configId) => ({
    type: DELETESTAKINGCONFIG,
    id: configId
});
export const deleteStakingConfigSuccess = (response) => ({
    type: DELETESTAKINGCONFIG_SUCCESS,
    payload: response
});
export const deleteStakingConfigFail = (error) => ({
    type: DELETESTAKINGCONFIG_FAILURE,
    payload: error
});

//GET BY ID
export const getStckingById = (stackID) => ({
    type: GETSTAKINGCONFIG,
    id: stackID
});
export const getStckingByIdSuccess = (response) => ({
    type: GETSTAKINGCONFIG_SUCCESS,
    payload: response
});
export const getStckingByIdFail = (error) => ({
    type: GETSTAKINGCONFIG_FAILURE,
    payload: error
});