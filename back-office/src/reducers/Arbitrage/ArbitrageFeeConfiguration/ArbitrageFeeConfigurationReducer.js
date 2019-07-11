/* 
    Developer : Vishva shah
    Date : 07-06-2019
    File Comment : Arbitrage Exchange Balance Reducer
*/
import {
    //list....
    GET_FEECONFIGURATION,
    GET_FEECONFIGURATION_SUCCESS,
    GET_FEECONFIGURATION_FAILURE,
    //add master Fee configuration
    ADD_FEECONFIGURATION,
    ADD_FEECONFIGURATION_SUCCESS,
    ADD_FEECONFIGURATION_FAILURE,
    //get Id
    GET_FEECONFIGURATION_BY_ID,
    GET_FEECONFIGURATION_BY_ID_SUCCESS,
    GET_FEECONFIGURATION_BY_ID_FAILURE,
    //update fee configuration
    UPDATE_FEECONFIGURATION,
    UPDATE_FEECONFIGURATION_SUCCESS,
    UPDATE_FEECONFIGURATION_FAILURE,
    //fee configuration details
    GET_FEE_CONFIGURATION_LIST,
    GET_FEE_CONFIGURATION_LIST_SUCCESS,
    GET_FEE_CONFIGURATION_LIST_FAILURE,
    //add fee configuration detail
    ADD_FEE_CONFIGURATION_LIST,
    ADD_FEE_CONFIGURATION_LIST_SUCCESS,
    ADD_FEE_CONFIGURATION_LIST_FAILURE,
    // get by id
    GET_FEE_CONFIGURATIONDETAIL_BYID,
    GET_FEE_CONFIGURATIONDETAIL_BYID_SUCCESS,
    GET_FEE_CONFIGURATIONDETAIL_BYID_FAILURE,
    //update fee configuration detail
    UPDATE_FEE_CONFIGURATION_LIST,
    UPDATE_FEE_CONFIGURATION_LIST_SUCCESS,
    UPDATE_FEE_CONFIGURATION_LIST_FAILURE
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    errors: {},
    FeeConfigurationData: [],
    updateData: {},
    addFeeData: "",
    getFeeById: "",
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
        //List master fee Configuration
        case GET_FEECONFIGURATION:
            return { ...state, loading: true, errors: {}, FeeConfigurationData: [], updateData: {}, addFeeData: "", getFeeById: "" };
        case GET_FEECONFIGURATION_SUCCESS:
            return { ...state, loading: false, FeeConfigurationData: action.payload.Details, addFeeData: "", updateData: {}, errors: {} };
        case GET_FEECONFIGURATION_FAILURE:
            return { ...state, loading: false, errors: action.payload, FeeConfigurationData: [], addFeeData: "", updateData: {}, };
        //Add Master Fee Configuration
        case ADD_FEECONFIGURATION:
            return { ...state, loading: true, addFeeData: "", updateData: {} };
        case ADD_FEECONFIGURATION_SUCCESS:
            return { ...state, loading: false, addFeeData: action.payload };
        case ADD_FEECONFIGURATION_FAILURE:
            return { ...state, loading: false, addFeeData: action.payload, updateData: {} };
        //Update Charge Configuration
        case UPDATE_FEECONFIGURATION:
            return { ...state, loading: true, addFeeData: "", updateData: {} };
        case UPDATE_FEECONFIGURATION_SUCCESS:
            return { ...state, loading: false, updateData: action.payload };
        case UPDATE_FEECONFIGURATION_FAILURE:
            return { ...state, loading: false, updateData: action.payload, addFeeData: "" };
        //Get Charge Configuration
        case GET_FEECONFIGURATION_BY_ID:
            return { ...state, loading: true, getFeeById: "", updateData: {}, addFeeData: "" };
        case GET_FEECONFIGURATION_BY_ID_SUCCESS:
            return { ...state, loading: false, getFeeById: action.payload };
        case GET_FEECONFIGURATION_BY_ID_FAILURE:
            return { ...state, loading: false, getFeeById: "" };
        //list fee configuration details action
        case GET_FEE_CONFIGURATION_LIST:
            return { ...state, loading: true, updateDetails: "", addDetails: "", Details: [], getDetails: "" };
        case GET_FEE_CONFIGURATION_LIST_SUCCESS:
            return { ...state, loading: false, Details: action.payload.Details };
        case GET_FEE_CONFIGURATION_LIST_FAILURE:
            return { ...state, loading: false, Details: [], updateDetails: "", addDetails: "" };
        //Add fee configuration details action
        case ADD_FEE_CONFIGURATION_LIST:
            return { ...state, loading: true, addDetails: "", updateDetails: "" };
        case ADD_FEE_CONFIGURATION_LIST_SUCCESS:
        case ADD_FEE_CONFIGURATION_LIST_FAILURE:
            return { ...state, loading: false, addDetails: action.payload, updateDetails: "" };
        //Get ById action
        case GET_FEE_CONFIGURATIONDETAIL_BYID:
            return { ...state, loading: true, getDetails: "", addDetails: "", updateDetails: "" };
        case GET_FEE_CONFIGURATIONDETAIL_BYID_SUCCESS:
            return { ...state, loading: false, getDetails: action.payload, updateDetails: "", addDetails: "" };
        case GET_FEE_CONFIGURATIONDETAIL_BYID_FAILURE:
            return { ...state, loading: false, getDetails: "", updateDetails: "", addDetails: "" };
        //Update action
        case UPDATE_FEE_CONFIGURATION_LIST:
            return { ...state, loading: true, updateDetails: "", getDetails: "", };
        case UPDATE_FEE_CONFIGURATION_LIST_SUCCESS:
        case UPDATE_FEE_CONFIGURATION_LIST_FAILURE:
            return { ...state, loading: false, updateDetails: action.payload, addDetails: "" };
        default:
            return { ...state };
    }
};