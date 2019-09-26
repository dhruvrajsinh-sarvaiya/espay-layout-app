// Action types for Leverage Configuration Report
import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Leverage Config List
    GET_LEVERAGE_CONFIG_LIST,
    GET_LEVERAGE_CONFIG_LIST_SUCCESS,
    GET_LEVERAGE_CONFIG_LIST_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Delete Leverage Config Data
    DELETE_LEVERAGE_CONFIG_DATA,
    DELETE_LEVERAGE_CONFIG_DATA_SUCCESS,
    DELETE_LEVERAGE_CONFIG_DATA_FAILURE,

    // Clear Leverage Config Data
    CLEAR_LEVERAGE_CONFIG_DATA,

    // Add Leverage Configuration Data
    ADD_LEVERAGE_CONFIG_DATA,
    ADD_LEVERAGE_CONFIG_DATA_SUCCESS,
    ADD_LEVERAGE_CONFIG_DATA_FAILURE,
} from "../../actions/ActionTypes";

// Initial State for Leverage Configuration Report
const INITIAL_STATE = {
    // for leverage config list
    LeverageConfigList: null,
    LeverageConfigListLoading: false,
    LeverageConfigListError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false,

    // for delete leverage config data
    DelLeverageConfigData: null,
    DelLeverageConfigLoading: false,
    DelLeverageConfigError: false,

    // Add/Edit Leverage Config Data
    AddLeverageConfigData: null,
    AddLeverageConfigLoading: false,
    AddLeverageConfigError: false,
}

export default function LeverageConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get Leverage Config List method data
        case GET_LEVERAGE_CONFIG_LIST:
            return Object.assign({}, state, {
                LeverageConfigList: null,
                LeverageConfigListLoading: true
            })
        // Set Get Leverage Config List success data
        case GET_LEVERAGE_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                LeverageConfigList: action.data,
                LeverageConfigListLoading: false,
            })
        // Set Get Leverage Config List failure data
        case GET_LEVERAGE_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                LeverageConfigList: null,
                LeverageConfigListLoading: false,
                LeverageConfigListError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // Handle Delete Leverage Config Data method data
        case DELETE_LEVERAGE_CONFIG_DATA:
            return Object.assign({}, state, {
                DelLeverageConfigData: null,
                DelLeverageConfigLoading: true
            })
        // Set Delete Leverage Config Data success data
        case DELETE_LEVERAGE_CONFIG_DATA_SUCCESS:
            return Object.assign({}, state, {
                DelLeverageConfigData: action.data,
                DelLeverageConfigLoading: false,
            })
        // Set Delete Leverage Config Data failure data
        case DELETE_LEVERAGE_CONFIG_DATA_FAILURE:
            return Object.assign({}, state, {
                DelLeverageConfigData: null,
                DelLeverageConfigLoading: false,
                DelLeverageConfigError: true
            })

        // Handle Add/Edit Leverage Config Data method data
        case ADD_LEVERAGE_CONFIG_DATA:
            return Object.assign({}, state, {
                AddLeverageConfigData: null,
                AddLeverageConfigLoading: true
            })
        // Set Add/Edit Leverage Config Data success data
        case ADD_LEVERAGE_CONFIG_DATA_SUCCESS:
            return Object.assign({}, state, {
                AddLeverageConfigData: action.data,
                AddLeverageConfigLoading: false,
            })
        // Set Add/Edit Leverage Config Data failure data
        case ADD_LEVERAGE_CONFIG_DATA_FAILURE:
            return Object.assign({}, state, {
                AddLeverageConfigData: null,
                AddLeverageConfigLoading: false,
                AddLeverageConfigError: true
            })

        // Handle Clear Leverage Config Data method data
        case CLEAR_LEVERAGE_CONFIG_DATA:
            return Object.assign({}, state, {
                DelLeverageConfigData: null,
                AddLeverageConfigData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}