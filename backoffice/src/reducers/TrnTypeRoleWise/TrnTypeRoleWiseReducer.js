/*
 Reducer: Transaction Typr Role Wise
 Created By : Sanjay Rathod
 Date:02/01/2019
 */

import {
    GET_TRNTYPE_ROLEWISE,
    GET_TRNTYPE_ROLEWISE_SUCCESS,
    GET_TRNTYPE_ROLEWISE_FAILURE,

    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,

    ADD_TRNTYPE_ROLEWISE,
    ADD_TRNTYPE_ROLEWISE_SUCCESS,
    ADD_TRNTYPE_ROLEWISE_FAILURE

} from "Actions/types";

// initial state
const INIT_STATE = {
    errors: {},
    TrnTypeRoleWiseData: [],
    updateStatus: {},
    addTrnTypeRoleWiseData: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        //Get Trn Type Role Wise
        case GET_TRNTYPE_ROLEWISE:
            return {
                ...state,
                loading: true,
                errors: {},
                TrnTypeRoleWiseData: [],
                updateStatus: {},
                addTrnTypeRoleWiseData: {}
            };
        case GET_TRNTYPE_ROLEWISE_SUCCESS:
            return {
                ...state,
                loading: false,
                TrnTypeRoleWiseData: action.payload.Data,
                addTrnTypeRoleWiseData: {},
                errors: {},
            };
        case GET_TRNTYPE_ROLEWISE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload,
                TrnTypeRoleWiseData: [],
                addTrnTypeRoleWiseData: {}
            };

        //Update Trn Type Role Wise Status
        case UPDATE_TRNTYPE_ROLEWISE_STATUS:
            return { ...state, loading: true, updateStatus: {}, addTrnTypeRoleWiseData: {} };
        case UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS:
            return { ...state, loading: false, updateStatus: action.payload };
        case UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload, updateStatus: action.payload };

        case ADD_TRNTYPE_ROLEWISE:
            return { ...state, loading: true, updateStatus: {}, addTrnTypeRoleWiseData: {} };
        case ADD_TRNTYPE_ROLEWISE_SUCCESS:
            return { ...state, loading: false, addTrnTypeRoleWiseData: action.payload };
        case ADD_TRNTYPE_ROLEWISE_FAILURE:
            return { ...state, loading: false, error: action.payload, addTrnTypeRoleWiseData: action.payload };

        default:
            return { ...state };
    }
};
