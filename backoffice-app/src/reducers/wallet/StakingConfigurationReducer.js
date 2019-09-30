import {
    //master staking list
    MASTERSTAKINGLIST,
    MASTERSTAKINGLIST_SUCCESS,
    MASTERSTAKINGLIST_FAILURE,

    //delete staking master
    DELETEMASTERSTAKING,
    DELETEMASTERSTAKING_SUCCESS,
    DELETEMASTERSTAKING_FAILURE,

    // get staking policy list
    GET_STACKING_POLICY_LIST,
    GET_STACKING_POLICY_LIST_SUCCESS,
    GET_STACKING_POLICY_LIST_FAILURE,

    // Add staking policy
    ADD_STACKING_POLICY,
    ADD_STACKING_POLICY_SUCCESS,
    ADD_STACKING_POLICY_FAILURE,

    // delete staking policy
    DELETE_STACKING_POLICY,
    DELETE_STACKING_POLICY_SUCCESS,
    DELETE_STACKING_POLICY_FAILURE,

    // get staking config
    GETSTAKINGCONFIG,
    GETSTAKINGCONFIG_SUCCESS,
    GETSTAKINGCONFIG_FAILURE,

    // Clear data
    ACTION_LOGOUT,
    CLEAR_STACKING_CONFIG,

    // get wallet type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // add master staking data
    ADD_MASTER_STACKING_DATA,
    ADD_MASTER_STACKING_DATA_SUCCESS,
    ADD_MASTER_STACKING_DATA_FAILURE,
} from "../../actions/ActionTypes";

// initial state
const INIT_STATE = {
    //master
    stakingList: null,
    stakingListFetching: false,

    //delete
    stakingDeleteData: null,
    stakingDeleteFetching: false,

    //wallet
    walletData: null,
    walletDataFetching: false,

    // Add Master Staking 
    addMasterStakingData: null,
    addMasterStakingLoading: false,
    addMasterStakingError: false,

    // Edit Master Staking 
    editMasterStakingData: null,
    editMasterStakingLoading: false,
    editMasterStakingError: false,

    // Get Staking Policies List
    stakingPolicyData: null,
    stakingPolicyLoading: false,
    stakingPolicyError: false,

    // Delete Staking Policies Data
    deleteStakingPolicyData: null,
    deleteStakingPolicyLoading: false,
    deleteStakingPolicyError: false,

    // Add/Edit Staking Policies Data
    addStakingPolicyData: null,
    addStakingPolicyLoading: false,
    addStakingPolicyError: false,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INIT_STATE;
        }

        // To reset initial state on clear data
        case CLEAR_STACKING_CONFIG: {
            return INIT_STATE;
        }

        //for currency
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null, walletDataFetching: true })

        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload, walletDataFetching: false })

        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload, walletDataFetching: false })

        //master staking list...
        case MASTERSTAKINGLIST:
            return Object.assign({}, state, { stakingListFetching: true, stakingList: null })
        case MASTERSTAKINGLIST_SUCCESS:
            return Object.assign({}, state, { stakingListFetching: false, stakingList: action.payload, })
        case MASTERSTAKINGLIST_FAILURE:
            return Object.assign({}, state, { stakingListFetching: false, stakingList: action.payload, })

        //delete staking master...
        case DELETEMASTERSTAKING:
            return Object.assign({}, state, { stakingDeleteFetching: true, stakingDeleteData: null })
        case DELETEMASTERSTAKING_SUCCESS:
            return Object.assign({}, state, { stakingDeleteFetching: false, stakingDeleteData: action.payload })
        case DELETEMASTERSTAKING_FAILURE:
            return Object.assign({}, state, { stakingDeleteFetching: false, stakingDeleteData: action.payload })

        // Handle Add Master Staking Data method data
        case ADD_MASTER_STACKING_DATA:
            return Object.assign({}, state, {
                addMasterStakingData: null,
                addMasterStakingLoading: true
            })
        // Set Add Master Staking Data success data
        case ADD_MASTER_STACKING_DATA_SUCCESS:
            return Object.assign({}, state, {
                addMasterStakingData: action.payload,
                addMasterStakingLoading: false,
            })
        // Set Add Master Staking Data failure data
        case ADD_MASTER_STACKING_DATA_FAILURE:
            return Object.assign({}, state, {
                addMasterStakingData: null,
                addMasterStakingLoading: false,
                addMasterStakingError: true
            })

        //staking config list
        case GET_STACKING_POLICY_LIST:
            return Object.assign({}, state, {
                stakingPolicyData: null,
                stakingPolicyLoading: true
            })
        case GET_STACKING_POLICY_LIST_SUCCESS:
            return Object.assign({}, state, {
                stakingPolicyData: action.payload,
                stakingPolicyLoading: false,
            })
        case GET_STACKING_POLICY_LIST_FAILURE:
            return Object.assign({}, state, {
                stakingPolicyData: null,
                stakingPolicyLoading: false,
                stakingPolicyError: true
            })

        // Handle Add Staking Policy Data method data
        case ADD_STACKING_POLICY:
            return Object.assign({}, state, {
                addStakingPolicyData: null,
                addStakingPolicyLoading: true
            })
        // Set Add Staking Policy Data success data
        case ADD_STACKING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                addStakingPolicyData: action.payload,
                addStakingPolicyLoading: false,
            })
        // Set Add Staking Policy Data failure data
        case ADD_STACKING_POLICY_FAILURE:
            return Object.assign({}, state, {
                addStakingPolicyData: null,
                addStakingPolicyLoading: false,
                addStakingPolicyError: true
            })

        // Handle Delete Staking Policy Data method data
        case DELETE_STACKING_POLICY:
            return Object.assign({}, state, {
                deleteStakingPolicyData: null,
                deleteStakingPolicyLoading: true
            })
        // Set Delete Staking Policy Data success data
        case DELETE_STACKING_POLICY_SUCCESS:
            return Object.assign({}, state, {
                deleteStakingPolicyData: action.payload,
                deleteStakingPolicyLoading: false,
            })
        // Set Delete Staking Policy Data failure data
        case DELETE_STACKING_POLICY_FAILURE:
            return Object.assign({}, state, {
                deleteStakingPolicyData: null,
                deleteStakingPolicyLoading: false,
                deleteStakingPolicyError: true
            })

        //get staking info by id
        case GETSTAKINGCONFIG:
            return Object.assign({}, state, { loading: true, stackDetails: {} })
        case GETSTAKINGCONFIG_SUCCESS:
            return Object.assign({}, state, { stackDetails: action.payload, loading: false })
        case GETSTAKINGCONFIG_FAILURE:
            return Object.assign({}, state, { stackDetails: action.payload, loading: false })

        default:
            return state
    }
}
