/* 
    Developer : Nishant Vadgama
    Date : 28-12-2018
    File Comment : staing configuration reducer
*/
import {
    //master staking list...
    MASTERSTAKINGLIST,
    MASTERSTAKINGLIST_SUCCESS,
    MASTERSTAKINGLIST_FAILURE,
    //insert/update wallet master
    INSERTUPDATESTAKINGMASTER,
    INSERTUPDATESTAKINGMASTER_SUCCESS,
    INSERTUPDATESTAKINGMASTER_FAILURE,
    //delete staking master...
    DELETEMASTERSTAKING,
    DELETEMASTERSTAKING_SUCCESS,
    DELETEMASTERSTAKING_FAILURE,
    //list
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
    GETSTAKINGCONFIG_FAILURE,
} from "Actions/types";

// initial state
const INIT_STATE = {
    //master
    masterStakinList: [],
    masterResponse: {},
    masterDeleteResponse: {},
    //staking
    loading: false,
    stakinList: [],
    stackDetails: {},
    addResponse: {},
    delResponse: {},
}

export default (state, action) => {
    if (typeof state === 'undefined') {
      return INIT_STATE
    }
    switch (action.type) {
        //master staking list...
        case MASTERSTAKINGLIST:
            return { ...state, loading: true, delResponse: {}, addResponse: {}, masterResponse: {}, masterDeleteResponse: {} };
        case MASTERSTAKINGLIST_SUCCESS:
            return { ...state, masterStakinList: action.payload, loading: false, delResponse: {}, addResponse: {} };
        case MASTERSTAKINGLIST_FAILURE:
            return { ...state, masterStakinList: [], loading: false, delResponse: {}, addResponse: {} };

        //insert update staking master...
        case INSERTUPDATESTAKINGMASTER:
            return { ...state, loading: true, masterResponse: {}, delResponse: {}, addResponse: {} };
        case INSERTUPDATESTAKINGMASTER_SUCCESS:
            return { ...state, masterResponse: action.payload, loading: false, delResponse: {}, addResponse: {} };
        case INSERTUPDATESTAKINGMASTER_FAILURE:
            return { ...state, masterResponse: action.payload, loading: false, delResponse: {}, addResponse: {} };

        //delete staking master...
        case DELETEMASTERSTAKING:
            return { ...state, loading: true, masterDeleteResponse: {}, delResponse: {}, addResponse: {} };
        case DELETEMASTERSTAKING_SUCCESS:
            return { ...state, masterDeleteResponse: action.payload, loading: false, delResponse: {}, addResponse: {} };
        case DELETEMASTERSTAKING_FAILURE:
            return { ...state, masterDeleteResponse: action.payload, loading: false, delResponse: {}, addResponse: {} };

        //staking config list
        case STAKINGLIST:
            return { ...state, loading: true, delResponse: {}, addResponse: {} };
        case STAKINGLIST_SUCCESS:
            return { ...state, stakinList: action.payload, loading: false, delResponse: {}, addResponse: {} };
        case STAKINGLIST_FAILURE:
            return { ...state, stakinList: [], loading: false, delResponse: {}, addResponse: {} };

        //add staking config
        case ADDSTAKINGCONFIG:
            return { ...state, loading: true, addResponse: {} };
        case ADDSTAKINGCONFIG_SUCCESS:
            return { ...state, addResponse: action.payload, loading: false };
        case ADDSTAKINGCONFIG_FAILURE:
            return { ...state, addResponse: action.payload, loading: false };

        //delete staking config
        case DELETESTAKINGCONFIG:
            return { ...state, loading: true, delResponse: {} };
        case DELETESTAKINGCONFIG_SUCCESS:
            return { ...state, delResponse: action.payload, loading: false };
        case DELETESTAKINGCONFIG_FAILURE:
            return { ...state, delResponse: action.payload, loading: false };

        //get staking info by id
        case GETSTAKINGCONFIG:
            return { ...state, loading: true, stackDetails: {} };
        case GETSTAKINGCONFIG_SUCCESS:
            return { ...state, stackDetails: action.payload, loading: false };
        case GETSTAKINGCONFIG_FAILURE:
            return { ...state, stackDetails: action.payload, loading: false };

        default:
            return { ...state };
    }
};
