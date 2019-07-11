

/**
 *   Developer : Parth Andhariya
 *   Date : 19-03-2019
 *   Component: Charge Configuration reducer
 */
import {
    GET_CHARGECONFIGURATION,
    GET_CHARGECONFIGURATION_SUCCESS,
    GET_CHARGECONFIGURATION_FAILURE,
    ADD_CHARGECONFIGURATION,
    ADD_CHARGECONFIGURATION_SUCCESS,
    ADD_CHARGECONFIGURATION_FAILURE,
    UPDATE_CHARGECONFIGURATION,
    UPDATE_CHARGECONFIGURATION_SUCCESS,
    UPDATE_CHARGECONFIGURATION_FAILURE,
    GET_CHARGECONFIGURATION_BY_ID,
    GET_CHARGECONFIGURATION_BY_ID_SUCCESS,
    GET_CHARGECONFIGURATION_BY_ID_FAILURE,
    GET_CHARGE_CONFIGURATION_LIST,
    GET_CHARGE_CONFIGURATION_LIST_SUCCESS,
    GET_CHARGE_CONFIGURATION_LIST_FAILURE,
    ADD_CHARGE_CONFIGURATION_LIST,
    ADD_CHARGE_CONFIGURATION_LIST_SUCCESS,
    ADD_CHARGE_CONFIGURATION_LIST_FAILURE,
    GET_CHARGE_CONFIGURATION_BYID,
    GET_CHARGE_CONFIGURATION_BYID_SUCCESS,
    GET_CHARGE_CONFIGURATION_BYID_FAILURE,
    UPDATE_CHARGE_CONFIGURATION_LIST,
    UPDATE_CHARGE_CONFIGURATION_LIST_SUCCESS,
    UPDATE_CHARGE_CONFIGURATION_LIST_FAILURE
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    errors: {},
    ChargeData: [],
    updateData: {},
    addChargeData: "",
    getChargeById: "",
    loading: false,
    Details: [],
    addDetails: "",
    getDetails: "",
    updateDetails: ""
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //List Charge Configuration
        case GET_CHARGECONFIGURATION:
            return {
                ...state,
                loading: true,
                errors: {},
                ChargeData: [],
                updateData: {},
                addChargeData: "",
                getChargeById: ""
            };
        case GET_CHARGECONFIGURATION_SUCCESS:
            return {
                ...state,
                loading: false,
                ChargeData: action.payload.Details,
                addChargeData: "",
                updateData: {},
                errors: {}
            };
        case GET_CHARGECONFIGURATION_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload,
                ChargeData: [],
                addChargeData: "",
                updateData: {},

            };
        //Add Charge Configuration
        case ADD_CHARGECONFIGURATION:
            return { ...state, loading: true, addChargeData: "", updateData: {} };
        case ADD_CHARGECONFIGURATION_SUCCESS:
            return { ...state, loading: false, addChargeData: action.payload };
        case ADD_CHARGECONFIGURATION_FAILURE:
            return {...state,loading: false,addChargeData: action.payload,updateData: {} };
        //Update Charge Configuration
        case UPDATE_CHARGECONFIGURATION:
            return {...state,loading: true,addChargeData: "",updateData: {} };
        case UPDATE_CHARGECONFIGURATION_SUCCESS:
            return { ...state, loading: false, updateData: action.payload };
        case UPDATE_CHARGECONFIGURATION_FAILURE:
            return {...state,loading: false,updateData: action.payload,addChargeData: "" };
        //Get Charge Configuration
        case GET_CHARGECONFIGURATION_BY_ID:
            return {...state,loading: true,getChargeById: "",updateData: {},addChargeData: "" };

        case GET_CHARGECONFIGURATION_BY_ID_SUCCESS:
            return {...state,loading: false,getChargeById: action.payload };

        case GET_CHARGECONFIGURATION_BY_ID_FAILURE:
            return {...state,loading: false,getChargeById: "" };
        //charge configuration detail cases
        //List action
        case GET_CHARGE_CONFIGURATION_LIST:
            return {...state,loading: true,updateDetails: "",addDetails: "",Details: [],getDetails: "" };

        case GET_CHARGE_CONFIGURATION_LIST_SUCCESS:
            return { ...state,loading: false,Details: action.payload.Details };
        case GET_CHARGE_CONFIGURATION_LIST_FAILURE:
            return {...state,loading: false,Details: [],updateDetails: "", addDetails: "" };
        //Add action
        case ADD_CHARGE_CONFIGURATION_LIST:
            return { ...state, loading: true, addDetails: "", updateDetails: "" };

        case ADD_CHARGE_CONFIGURATION_LIST_SUCCESS:
        case ADD_CHARGE_CONFIGURATION_LIST_FAILURE:
            return {...state,loading: false,addDetails: action.payload,updateDetails: "" };
        //Get ById action
        case GET_CHARGE_CONFIGURATION_BYID:
            return { ...state,loading: true,getDetails: "",addDetails: "",updateDetails: "" };

        case GET_CHARGE_CONFIGURATION_BYID_SUCCESS:
            return {...state,loading: false,getDetails: action.payload,updateDetails: "",addDetails: "" };
        case GET_CHARGE_CONFIGURATION_BYID_FAILURE:
            return {...state,loading: false,getDetails: "",updateDetails: "", addDetails: "" };
        //Update action
        case UPDATE_CHARGE_CONFIGURATION_LIST:
            return { ...state, loading: true, updateDetails: "", getDetails: "", };

        case UPDATE_CHARGE_CONFIGURATION_LIST_SUCCESS:
        case UPDATE_CHARGE_CONFIGURATION_LIST_FAILURE:
            return {...state,loading: false,updateDetails: action.payload,addDetails: "" };
        default:
            return { ...state };
    }
};
