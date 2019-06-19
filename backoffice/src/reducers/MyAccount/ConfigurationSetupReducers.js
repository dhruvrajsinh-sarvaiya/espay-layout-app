/**
 * Created By Sanjay
 * Created Date 09/02/2019
 * Reducer for Configuration Setup in Referral System
 */

 import {
    ADD_CONFIGURATION_SETUP,
    ADD_CONFIGURATION_SETUP_SUCCESS,
    ADD_CONFIGURATION_SETUP_FAILURE
 } from  "Actions/types";
 
const INIT_STATE = {
    addConfigSetupData:{},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_CONFIGURATION_SETUP:
            return { ...state, loading: true, addConfigSetupData: {} };

        case ADD_CONFIGURATION_SETUP_SUCCESS:
            return { ...state, loading: false, addConfigSetupData: action.payload };

        case ADD_CONFIGURATION_SETUP_FAILURE:
            return { ...state, loading: false, addConfigSetupData: action.payload };

        default:
            return { ...state };
    }
};