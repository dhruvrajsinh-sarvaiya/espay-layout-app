import {
    //trntype role wise List
    GET_TRNTYPE_ROLEWISE,
    GET_TRNTYPE_ROLEWISE_SUCCESS,
    GET_TRNTYPE_ROLEWISE_FAILURE,

    //trntype role wise update status
    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,

    //trntype role wise add 
    ADD_TRNTYPE_ROLEWISE,
    ADD_TRNTYPE_ROLEWISE_SUCCESS,
    ADD_TRNTYPE_ROLEWISE_FAILURE,

    //clear data
    CLEAR_TRNTYPE_ROLEWISE_DATA,
} from '../ActionTypes'

// Redux action Get Transaction Type Role Action
export const getTrnTypeRoleWise = (request) => ({
    type: GET_TRNTYPE_ROLEWISE,
    payload: request
});
// Redux action Get Transaction Type Role Wise success
export const getTrnTypeRoleWiseSuccess = (response) => ({
    type: GET_TRNTYPE_ROLEWISE_SUCCESS,
    payload: response
});
// Redux action Get Transaction Type Role Wise failure
export const getTrnTypeRoleWiseFailure = (error) => ({
    type: GET_TRNTYPE_ROLEWISE_FAILURE,
    payload: error
});

// Redux action Update Transaction Type Role Wise Status 
export const updateTrnTypeRoleWiseStatus = (request) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS,
    payload: request
});
// Redux action Update Transaction Type Role Wise Status success
export const updateTrnTypeRoleWiseStatusSuccess = (response) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    payload: response
});
// Redux action Update Transaction Type Role Wise Status failure
export const updateTrnTypeRoleWiseStatusFailure = (error) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,
    payload: error
});

// Redux action Add TrnTypeRoleWise 
export const addTrnTypeRoleWise = request => ({
    type: ADD_TRNTYPE_ROLEWISE,
    payload: request
});
// Redux action Add TrnTypeRoleWise Success
export const addTrnTypeRoleWiseSuccess = response => ({
    type: ADD_TRNTYPE_ROLEWISE_SUCCESS,
    payload: response
});
// Redux action Add TrnTypeRoleWise Failure
export const addTrnTypeRoleWiseFailure = error => ({
    type: ADD_TRNTYPE_ROLEWISE_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearRoleWiseData = () => ({
    type: CLEAR_TRNTYPE_ROLEWISE_DATA,
});

