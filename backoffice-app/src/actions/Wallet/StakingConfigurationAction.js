
import {
    //master staking list...
    MASTERSTAKINGLIST,
    MASTERSTAKINGLIST_SUCCESS,
    MASTERSTAKINGLIST_FAILURE,
    //insert/update staking master
    ADD_MASTER_STACKING_DATA,
    ADD_MASTER_STACKING_DATA_SUCCESS,
    ADD_MASTER_STACKING_DATA_FAILURE,
    //delete staking master...
    DELETEMASTERSTAKING,
    DELETEMASTERSTAKING_SUCCESS,
    DELETEMASTERSTAKING_FAILURE,
    //LIST
    GET_STACKING_POLICY_LIST,
    GET_STACKING_POLICY_LIST_SUCCESS,
    GET_STACKING_POLICY_LIST_FAILURE,
    //Add
    ADD_STACKING_POLICY,
    ADD_STACKING_POLICY_SUCCESS,
    ADD_STACKING_POLICY_FAILURE,
    //DELETE
    DELETE_STACKING_POLICY,
    DELETE_STACKING_POLICY_SUCCESS,
    DELETE_STACKING_POLICY_FAILURE,
    // GET BY ID
    GETSTAKINGCONFIG,
    GETSTAKINGCONFIG_SUCCESS,
    GETSTAKINGCONFIG_FAILURE,

    CLEAR_STACKING_CONFIG,

} from "../ActionTypes";

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

// insert wallet master
export const addMasterStaking = (request) => ({
    type: ADD_MASTER_STACKING_DATA,
    request: request
});
export const addMasterStakingSuccess = (response) => ({
    type: ADD_MASTER_STACKING_DATA_SUCCESS,
    payload: response
});
export const addMasterStakingFail = (error) => ({
    type: ADD_MASTER_STACKING_DATA_FAILURE,
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
export const getStakingPolicyList = (request) => ({
    type: GET_STACKING_POLICY_LIST,
    request: request
});
export const getStakingPolicyListSuccess = (response) => ({
    type: GET_STACKING_POLICY_LIST_SUCCESS,
    payload: response
});
export const getStakingPolicyListFail = (error) => ({
    type: GET_STACKING_POLICY_LIST_FAILURE,
    payload: error
});

// add new staking configuration
export const addStakingPolicy = (request) => ({
    type: ADD_STACKING_POLICY,
    request: request
});
export const addStakingPolicySuccess = (response) => ({
    type: ADD_STACKING_POLICY_SUCCESS,
    payload: response
});
export const addStakingPolicyFail = (error) => ({
    type: ADD_STACKING_POLICY_FAILURE,
    payload: error
});

//DELETE STAKING CONFIGURATION
export const deleteStakingPolicy = (configId) => ({
    type: DELETE_STACKING_POLICY,
    id: configId
});
export const deleteStakingPolicySuccess = (response) => ({
    type: DELETE_STACKING_POLICY_SUCCESS,
    payload: response
});
export const deleteStakingPolicyFail = (error) => ({
    type: DELETE_STACKING_POLICY_FAILURE,
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

//clear the staking data
export const clearStakingConfig = () => ({
    type: CLEAR_STACKING_CONFIG,
});
