import {
    //transaction policy list
    GET_TRANSACTION_POLICY,
    GET_TRANSACTION_POLICY_SUCCESS,
    GET_TRANSACTION_POLICY_FAILURE,

    //update transaction policy status enable disable
    UPDATE_TRANSACTION_POLICY_STATUS,
    UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,

    //Add transaction policy 
    ADD_TRANSACTION_POLICY,
    ADD_TRANSACTION_POLICY_SUCCESS,
    ADD_TRANSACTION_POLICY_FAILURE,

    //update transaction policy 
    UPDATE_TRANSACTION_POLICY,
    UPDATE_TRANSACTION_POLICY_SUCCESS,
    UPDATE_TRANSACTION_POLICY_FAILURE,

    //for clear response
    CLEAR_TRANSACTION_POLICY,
} from '../ActionTypes'

//Redux action for transaction policy list
export const getTransactionPolicy = () => ({
    type: GET_TRANSACTION_POLICY
});

//Redux action for transaction policy list Success
export const getTransactionPolicySuccess = response => ({
    type: GET_TRANSACTION_POLICY_SUCCESS,
    payload: response
});

//Redux action for transaction policy list failure
export const getTransactionPolicyFailure = error => ({
    type: GET_TRANSACTION_POLICY_FAILURE,
    payload: error
});

//Redux action for update transaction policy status delete
export const updateTransactionPolicyStatus = UpdatePolicyStatus => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS,
    payload: UpdatePolicyStatus
});

//Redux action for update transaction policy status delete Sucess
export const updateTransactionPolicyStatusSuccess = response => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    payload: response
});

//Redux action for update transaction policy status delete failure
export const updateTransactionPolicyStatusFailure = error => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,
    payload: error
});

//Redux action Add transaction policy 
export const addTransactionPolicy = transactionPolicy => ({
    type: ADD_TRANSACTION_POLICY,
    payload: transactionPolicy
});

//Redux action Add transaction policy Success
export const addTransactionPolicySuccess = transactionPolicy => ({
    type: ADD_TRANSACTION_POLICY_SUCCESS,
    payload: transactionPolicy
});

//Redux action Add transaction policy failure
export const addtransactionPolicyFailure = error => ({
    type: ADD_TRANSACTION_POLICY_FAILURE,
    payload: error
});

//Redux action update transaction policy 
export const onUpdateTransactionPolicy = updateTransactionPolicy => ({
    type: UPDATE_TRANSACTION_POLICY,
    payload: updateTransactionPolicy
});

//Redux action update transaction policy Success
export const onUpdateTransactionPolicySuccess = response => ({
    type: UPDATE_TRANSACTION_POLICY_SUCCESS,
    payload: response
});

//Redux action update transaction policy failure
export const onUpdateTransactionPolicyFail = error => ({
    type: UPDATE_TRANSACTION_POLICY_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearTransactionPolicy = () => ({
    type: CLEAR_TRANSACTION_POLICY,
});




