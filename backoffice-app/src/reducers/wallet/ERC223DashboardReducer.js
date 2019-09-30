import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Increase Decrease Token Supply
    GET_INCRE_DECRE_TOKEN_SUPPLY,
    GET_INCRE_DECRE_TOKEN_SUPPLY_SUCCESS,
    GET_INCRE_DECRE_TOKEN_SUPPLY_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Add Increase Token
    ADD_INCREASE_TOKEN,
    ADD_INCREASE_TOKEN_SUCCESS,
    ADD_INCREASE_TOKEN_FAILURE,

    // Clear Increase Token
    CLEAR_INCREASE_TOKEN,

    // Add Decrease Token
    ADD_DECREASE_TOKEN,
    ADD_DECREASE_TOKEN_SUCCESS,
    ADD_DECREASE_TOKEN_FAILURE,

    // Get Destroy BlackFund List
    GET_DESTROY_BLACKFUND_LIST,
    GET_DESTROY_BLACKFUND_LIST_SUCCESS,
    GET_DESTROY_BLACKFUND_LIST_FAILURE,

    // Get Transfer Fee List
    GET_TRANSFER_FEE_LIST,
    GET_TRANSFER_FEE_LIST_SUCCESS,
    GET_TRANSFER_FEE_LIST_FAILURE,

    // Add Transfer Fee
    ADD_TRANSFER_FEE,
    ADD_TRANSFER_FEE_SUCCESS,
    ADD_TRANSFER_FEE_FAILURE,
    CLEAR_TRANSFER_FEE_DATA
} from "../../actions/ActionTypes";

// Initial State for ERC223 Module
const INITIAL_STATE = {
    // Increase Decrease Token Supply List
    IncreDecreTokenSupply: null,
    IncreDecreTokenSupplyLoading: false,
    IncreDecreTokenSupplyError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false,

    // Add Increase Token
    AddIncreaseToken: null,
    AddIncreaseTokenLoading: false,
    AddIncreaseTokenError: false,

    // Destroy Black Fund List
    DestroyBlackFund: null,
    DestroyBlackFundLoading: false,
    DestroyBlackFundError: false,

    // Transfer Fee List
    TransferFeeList: null,
    TransferFeeLoading: false,
    TransferFeeError: false,

    // Add Transfer Fee
    AddTransferFee: null,
    AddTransferFeeLoading: false,
    AddTransferFeeError: false,
}

export default function ERC223DashboardReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Add Transfer Fee method data
        case CLEAR_TRANSFER_FEE_DATA:
            return Object.assign({}, state, {
                AddTransferFee: null,
                TransferFeeList: null
            })

        // Handle Add Transfer Fee method data
        case ADD_TRANSFER_FEE:
            return Object.assign({}, state, {
                AddTransferFee: null,
                AddTransferFeeLoading: true
            })
        // Set Add Transfer Fee success data
        case ADD_TRANSFER_FEE_SUCCESS:
            return Object.assign({}, state, {
                AddTransferFee: action.data,
                AddTransferFeeLoading: false,
            })
        // Set Add Transfer Fee failure data
        case ADD_TRANSFER_FEE_FAILURE:
            return Object.assign({}, state, {
                AddTransferFee: null,
                AddTransferFeeLoading: false,
                AddTransferFeeError: true
            })

        // Handle Transfer Fee List method data
        case GET_TRANSFER_FEE_LIST:
            return Object.assign({}, state, {
                TransferFeeList: null,
                TransferFeeLoading: true
            })
        // Set Transfer Fee List success data
        case GET_TRANSFER_FEE_LIST_SUCCESS:
            return Object.assign({}, state, {
                TransferFeeList: action.data,
                TransferFeeLoading: false,
            })
        // Set Transfer Fee List failure data
        case GET_TRANSFER_FEE_LIST_FAILURE:
            return Object.assign({}, state, {
                TransferFeeList: null,
                TransferFeeLoading: false,
                TransferFeeError: true
            })

        // Handle Destroy Black Fund List method data
        case GET_DESTROY_BLACKFUND_LIST:
            return Object.assign({}, state, {
                DestroyBlackFund: null,
                DestroyBlackFundLoading: true
            })
        // Set Destroy Black Fund List success data
        case GET_DESTROY_BLACKFUND_LIST_SUCCESS:
            return Object.assign({}, state, {
                DestroyBlackFund: action.data,
                DestroyBlackFundLoading: false,
            })
        // Set Destroy Black Fund List failure data
        case GET_DESTROY_BLACKFUND_LIST_FAILURE:
            return Object.assign({}, state, {
                DestroyBlackFund: null,
                DestroyBlackFundLoading: false,
                DestroyBlackFundError: true
            })

        // Handle Increase Decrease Token Supply List method data
        case GET_INCRE_DECRE_TOKEN_SUPPLY:
            return Object.assign({}, state, {
                IncreDecreTokenSupply: null,
                IncreDecreTokenSupplyLoading: true
            })
        // Set Increase Decrease Token Supply List success data
        case GET_INCRE_DECRE_TOKEN_SUPPLY_SUCCESS:
            return Object.assign({}, state, {
                IncreDecreTokenSupply: action.data,
                IncreDecreTokenSupplyLoading: false,
            })
        // Set Increase Decrease Token Supply List failure data
        case GET_INCRE_DECRE_TOKEN_SUPPLY_FAILURE:
            return Object.assign({}, state, {
                IncreDecreTokenSupply: null,
                IncreDecreTokenSupplyLoading: false,
                IncreDecreTokenSupplyError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // Handle Add Increase Token Data method data
        case ADD_INCREASE_TOKEN:
            return Object.assign({}, state, {
                AddIncreaseToken: null,
                AddIncreaseTokenLoading: true
            })
        // Set Add Increase Tokent Data success data
        case ADD_INCREASE_TOKEN_SUCCESS:
            return Object.assign({}, state, {
                AddIncreaseToken: action.data,
                AddIncreaseTokenLoading: false,
            })
        // Set Add Increase Token Data failure data
        case ADD_INCREASE_TOKEN_FAILURE:
            return Object.assign({}, state, {
                AddIncreaseToken: null,
                AddIncreaseTokenLoading: false,
                AddIncreaseTokenError: true
            })

        // Handle Add Decrease Token Data method data
        case ADD_DECREASE_TOKEN:
            return Object.assign({}, state, {
                AddDecreaseToken: null,
                AddDecreaseTokenLoading: true
            })
        // Set Add Decrease Tokent Data success data
        case ADD_DECREASE_TOKEN_SUCCESS:
            return Object.assign({}, state, {
                AddDecreaseToken: action.data,
                AddDecreaseTokenLoading: false,
            })
        // Set Add Decrease Token Data failure data
        case ADD_DECREASE_TOKEN_FAILURE:
            return Object.assign({}, state, {
                AddDecreaseToken: null,
                AddDecreaseTokenLoading: false,
                AddDecreaseTokenError: true
            })

        // Handle Add Increase Token Data method data
        case CLEAR_INCREASE_TOKEN:
            return Object.assign({}, state, {
                AddIncreaseToken: null,
                AddDecreaseToken: null,
                IncreDecreTokenSupply: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}