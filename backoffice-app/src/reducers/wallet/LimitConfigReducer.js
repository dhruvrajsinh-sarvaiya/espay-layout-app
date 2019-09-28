import {

    // Get limit configuration List
    GET_LIMIT_CONFIGURATION,
    GET_LIMIT_CONFIGURATION_SUCCESS,
    GET_LIMIT_CONFIGURATION_FAILURE,

    // add limit configuration 
    ADD_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION_SUCCESS,
    ADD_LIMIT_CONFIGURATION_FAILURE,

    // update limit configuration 
    UPDATE_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    UPDATE_LIMIT_CONFIGURATION_FAILURE,

    // for delete limit configuration 
    CHANGE_LIMIT_CONFIGURATION,
    CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    CHANGE_LIMIT_CONFIGURATION_FAILURE,

    //clear limit config data
    CLEAR_LIMIT_CONFIGURATION,

    // Action Logout 
    ACTION_LOGOUT,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,
} from '../../actions/ActionTypes';

// initial state
const INIT_STATE = {

    //for limit configuration List
    configureedLimitsLoading: false,
    configureedLimitsData: null,

    // for delete limit configuration 
    deleteLoading: false,
    deleteData: null,

    // for add limit configuration 
    addLoading: false,
    addData: null,

    // for Update limit configuration 
    updateLoading: false,
    updateData: null,

    //for wallet data
    walletData: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        //clear limit config data
        case CLEAR_LIMIT_CONFIGURATION: {
            return INIT_STATE
        }

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INIT_STATE;
        }

        // Handle Get limit configuration method data
        case GET_LIMIT_CONFIGURATION:
            return Object.assign({}, state, {
                configureedLimitsLoading: true,
                configureedLimitsData: null,
            })

        // Set Get limit configuration List success data
        case GET_LIMIT_CONFIGURATION_SUCCESS:
        // Set Get limit configuration List failure data
        case GET_LIMIT_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                configureedLimitsLoading: false,
                configureedLimitsData: action.payload,
            })

        //handle get Delete Limit Confuguration Method
        case CHANGE_LIMIT_CONFIGURATION:
            return Object.assign({}, state, {
                deleteLoading: true,
                deleteData: null,
            })

        //handle set Delete Limit Confuguration Method Success Data
        case CHANGE_LIMIT_CONFIGURATION_SUCCESS:
        //handle set Delete Limit Confuguration Method Failure Data
        case CHANGE_LIMIT_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                deleteLoading: false,
                deleteData: action.payload
            })

        // handle Add Limit Configuration Method Data
        case ADD_LIMIT_CONFIGURATION:
            return Object.assign({}, state, {
                addLoading: true,
                addData: null,
            })

        // set Add Limit Configuration Method Success Data
        case ADD_LIMIT_CONFIGURATION_SUCCESS:
        // set Add Limit Configuration Method Failure Data
        case ADD_LIMIT_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                addLoading: false,
                addData: action.payload,
            })


        // handle Update Limit Configuration Method Data
        case UPDATE_LIMIT_CONFIGURATION:
            return Object.assign({}, state, {
                updateLoading: true,
                updateData: null,
            })

        // set Update Limit Configuration Method Success Data
        case UPDATE_LIMIT_CONFIGURATION_SUCCESS:
        // set Update Limit Configuration Method Failure Data
        case UPDATE_LIMIT_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                updateLoading: false,
                updateData: action.payload,
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null })

        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload })

        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
