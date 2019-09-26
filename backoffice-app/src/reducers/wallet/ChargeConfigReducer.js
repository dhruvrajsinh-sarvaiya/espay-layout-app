import {
    // Clear Data
    ACTION_LOGOUT,
    CLEAR_CHARGE_CONFIG_DATA,

    // Get Charge Configuration List
    GET_CHARGE_CONFIG_LIST,
    GET_CHARGE_CONFIG_LIST_SUCCESS,
    GET_CHARGE_CONFIG_LIST_FAILURE,

    // Delete Charge Configuration Data
    DELETE_CHARGE_CONFIG_DATA,
    DELETE_CHARGE_CONFIG_DATA_SUCCESS,
    DELETE_CHARGE_CONFIG_DATA_FAILURE,

    // Add Charge Configuration
    ADD_CHARGECONFIGURATION,
    ADD_CHARGECONFIGURATION_SUCCESS,
    ADD_CHARGECONFIGURATION_FAILURE,

    // Update Charge Configuration
    UPDATE_CHARGECONFIGURATION,
    UPDATE_CHARGECONFIGURATION_SUCCESS,
    UPDATE_CHARGECONFIGURATION_FAILURE,

    // Get Wallet Transaction Type
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Get Charge Configuration Detail
    GET_CHARGE_CONFIG_DETAIL,
    GET_CHARGE_CONFIG_DETAIL_SUCCESS,
    GET_CHARGE_CONFIG_DETAIL_FAILURE,

    // Update Charge Configuration Detail
    UPDATE_CHARGECONFIGURATION_DETAIL,
    UPDATE_CHARGECONFIGURATION_DETAIL_SUCCESS,
    UPDATE_CHARGECONFIGURATION_DETAIL_FAILURE,

    // Add Charge Configuration Detail
    ADD_CHARGECONFIGURATION_DETAIL,
    ADD_CHARGECONFIGURATION_DETAIL_SUCCESS,
    ADD_CHARGECONFIGURATION_DETAIL_FAILURE,
} from "../../actions/ActionTypes";

// Initial State for Charge Configuration Report
const INITIAL_STATE = {
    // Charge Config List
    ChargeConfigList: null,
    ChargeConfigLoading: false,
    ChargeConfigError: false,

    // Delete Charge Config Data
    DelChargeConfigData: null,
    DelChargeConfigLoading: false,
    DelChargeConfigError: false,

    // add Charge Config Data
    addLoading: false,
    addData: null,

    // update Charge Config Data
    updateLoading: false,
    updateData: null,

    //for wallet data
    walletData: null,

    //for transactionType data
    transactionTypeData: null,

    // Charge Config detail
    ChargeConfigDetail: null,
    ChargeConfigDetailLoading: false,

    // add Charge Config detail Data
    addDetailLoading: false,
    addDetailData: null,

    // update Charge Config detail Data
    updateDetailLoading: false,
    updateDetailData: null,
}

export default function ChargeConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get Charge Config List method data
        case GET_CHARGE_CONFIG_LIST:
            return Object.assign({}, state, {
                ChargeConfigList: null,
                ChargeConfigLoading: true
            })
        // Set Get Charge Config List success data
        case GET_CHARGE_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                ChargeConfigList: action.data,
                ChargeConfigLoading: false,
            })
        // Set Get Charge Config List failure data
        case GET_CHARGE_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                ChargeConfigList: null,
                ChargeConfigLoading: false,
                ChargeConfigError: true
            })

        // Handle Delete Charge Config Data method data
        case DELETE_CHARGE_CONFIG_DATA:
            return Object.assign({}, state, {
                DelChargeConfigData: null,
                DelChargeConfigLoading: true
            })
        // Set Delete Charge Config Data success data
        case DELETE_CHARGE_CONFIG_DATA_SUCCESS:
            return Object.assign({}, state, {
                DelChargeConfigData: action.data,
                DelChargeConfigLoading: false,
            })
        // Set Delete Charge Config Data failure data
        case DELETE_CHARGE_CONFIG_DATA_FAILURE:
            return Object.assign({}, state, {
                DelChargeConfigData: null,
                DelChargeConfigLoading: false,
                DelChargeConfigError: true
            })

        // Handle all Charge Config Data method data
        case CLEAR_CHARGE_CONFIG_DATA: {
            return INITIAL_STATE;
        }

        // Handle add Charge Config Data method data
        case ADD_CHARGECONFIGURATION:
            return Object.assign({}, state, { addLoading: true, addData: null, })

        // Set add Charge Config Data success data
        case ADD_CHARGECONFIGURATION_SUCCESS:
            return Object.assign({}, state, { addLoading: false, addData: action.payload, })

        // Set add Charge Config Data failure data
        case ADD_CHARGECONFIGURATION_FAILURE:
            return Object.assign({}, state, { addLoading: false, addData: action.payload, })

        // Handle update Charge Config Data method data
        case UPDATE_CHARGECONFIGURATION:
            return Object.assign({}, state, { updateLoading: true, updateData: null, })

        // Set update Charge Config Data success data
        case UPDATE_CHARGECONFIGURATION_SUCCESS:
            return Object.assign({}, state, { updateLoading: false, updateData: action.payload, })

        // Set update Charge Config Data failure data
        case UPDATE_CHARGECONFIGURATION_FAILURE:
            return Object.assign({}, state, { updateLoading: false, updateData: action.payload, })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null })

        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload })

        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload })


        // Handle Get Wallet Data method data
        case GET_WALLET_TRANSACTION_TYPE:
            return Object.assign({}, state, { transactionTypeData: null })

        // Set Get Wallet Data success data
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return Object.assign({}, state, { transactionTypeData: action.payload })

        // Set Get Wallet Data failure data
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, { transactionTypeData: action.payload })

        // Handle Get Charge Config List method data
        case GET_CHARGE_CONFIG_DETAIL:
            return Object.assign({}, state, {
                ChargeConfigDetail: null,
                ChargeConfigDetailLoading: true
            })
        // Set Get Charge Config List success data
        case GET_CHARGE_CONFIG_DETAIL_SUCCESS:
        // Set Get Charge Config List failure data
        case GET_CHARGE_CONFIG_DETAIL_FAILURE:
            return Object.assign({}, state, {
                ChargeConfigDetail: action.payload,
                ChargeConfigDetailLoading: false,
            })
      
        // Handle update Charge Config Data method data
        case UPDATE_CHARGECONFIGURATION_DETAIL:
            return Object.assign({}, state, { updateDetailLoading: true, updateDetailData: null, })

        // Set update Charge Config Data success data
        case UPDATE_CHARGECONFIGURATION_DETAIL_SUCCESS:
            return Object.assign({}, state, { updateDetailLoading: false, updateDetailData: action.payload, })

        // Set update Charge Config Data failure data
        case UPDATE_CHARGECONFIGURATION_DETAIL_FAILURE:
            return Object.assign({}, state, { updateDetailLoading: false, updateDetailData: action.payload, })

        // Handle add Charge Config Data method data
        case ADD_CHARGECONFIGURATION_DETAIL:
            return Object.assign({}, state, { addDetailLoading: true, addDetailData: null, })

        // Set add Charge Config Data success data
        case ADD_CHARGECONFIGURATION_DETAIL_SUCCESS:
            return Object.assign({}, state, { addDetailLoading: false, addDetailData: action.payload })

        // Set add Charge Config Data failure data
        case ADD_CHARGECONFIGURATION_DETAIL_FAILURE:
            return Object.assign({}, state, { addDetailLoading: false, addDetailData: action.payload, })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}