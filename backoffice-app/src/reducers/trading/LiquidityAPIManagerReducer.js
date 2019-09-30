// LiquidityAPIManagerReducer
import {
    //liquidity api manager list
    GET_LIQUIDITY_API_MANAGER_LIST,
    GET_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    GET_LIQUIDITY_API_MANAGER_LIST_FAILURE,

    //liquidity api manager add
    ADD_LIQUIDITY_API_MANAGER_LIST,
    ADD_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    ADD_LIQUIDITY_API_MANAGER_LIST_FAILURE,
    ADD_LIQUIDITY_API_MANAGER_LIST_CLEAR,

    //liquidity api manager update
    UPDATE_LIQUIDITY_API_MANAGER_LIST,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_FAILURE,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_CLEAR,

    //provider list
    GET_PROVIDERS_LIST,
    GET_PROVIDERS_LIST_SUCCESS,
    GET_PROVIDERS_LIST_FAILURE,

    //limit data
    GET_LIMIT_DATA,
    GET_LIMIT_DATA_SUCCESS,
    GET_LIMIT_DATA_FAILURE,

    //service provider
    GET_SERVICE_PROVIDER,
    GET_SERVICE_PROVIDER_SUCCESS,
    GET_SERVICE_PROVIDER_FAILURE,

    //daemon config
    GET_DAEMON_CONFIG,
    GET_DAEMON_CONFIG_SUCCESS,
    GET_DAEMON_CONFIG_FAILURE,

    //service config
    GET_SERVICE_CONFIG,
    GET_SERVICE_CONFIG_SUCCESS,
    GET_SERVICE_CONFIG_FAILURE,

    //provider type
    GET_PROVIDER_TYPE,
    GET_PROVIDER_TYPE_SUCCESS,
    GET_PROVIDER_TYPE_FAILURE,

    //transaction type
    GET_TRANSACTION_TYPE,
    GET_TRANSACTION_TYPE_SUCCESS,
    GET_TRANSACTION_TYPE_FAILURE,

    //clear data
    ACTION_LOGOUT,
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of LiquidityAPIManager
    isLiquidityAPIManagerFetch: false,
    LiquidityAPIManagerDataget: null,
    LiquidityAPIManagerdataFetch: true,

    // for add data in LiquidityAPIManager
    isAddLiquidityAPIManager: false,
    AddLiquidityAPIManagerdata: null,
    AddedLiquidityAPIManagerdata: true,

    // for edit LiquidityAPIManager
    isEditLiquidityAPIManager: false,
    EditLiquidityAPIManagerdata: null,
    EditedLiquidityAPIManagerdata: true,

    // for get Apiproviderlist
    isApiproviderlistFetch: true,
    Apiproviderlistdata: null,
    Apiproviderlistget: true,

    // For get LimitList
    isLimitListFetch: true,
    LimitListdata: null,
    LimitListget: true,

    // For ServiceProviderList
    isServiceProviderListFetch: true,
    ServiceProviderListdata: null,
    ServiceProviderListget: true,

    // for DaemonConfigurationlist
    isDaemonConfigurationlistFetch: true,
    DaemonConfigurationlistdata: null,
    DaemonConfigurationlistget: true,

    // for ProviderConfigurationlist
    isProviderConfigurationlistFetch: true,
    ProviderConfigurationlistdata: null,
    ProviderConfigurationlistget: true,

    // for Providertypelist
    isProvidertypelistFetch: true,
    Providertypelistdata: null,
    Providertypelistget: true,

    // for Transactionypelist
    isTransactiontypelistFetch: true,
    Transactiontypelistdata: null,
    Transactiontypelistget: true,

}

export default function liquidityAPIManagerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        //Handle LiquidityAPIManager List method data
        case GET_LIQUIDITY_API_MANAGER_LIST:
            return Object.assign({}, state, {
                isLiquidityAPIManagerFetch: true,
                LiquidityAPIManagerDataget: null,
                LiquidityAPIManagerdataFetch: true
            })
        //Handle LiquidityAPIManager List method success data
        case GET_LIQUIDITY_API_MANAGER_LIST_SUCCESS:
        //Set LiquidityAPIManager List method failure data
        case GET_LIQUIDITY_API_MANAGER_LIST_FAILURE:
            return Object.assign({}, state, {
                isLiquidityAPIManagerFetch: false,
                LiquidityAPIManagerDataget: action.data,
                LiquidityAPIManagerdataFetch: false,
            })

        //Handle LiquidityAPIManager add method data
        case ADD_LIQUIDITY_API_MANAGER_LIST:
            return Object.assign({}, state, {
                isAddLiquidityAPIManager: true,
                AddLiquidityAPIManagerdata: null,
                AddedLiquidityAPIManagerdata: true,
            })
        //Set LiquidityAPIManager add method success data
        case ADD_LIQUIDITY_API_MANAGER_LIST_SUCCESS:
        //Set LiquidityAPIManager add method failure data
        case ADD_LIQUIDITY_API_MANAGER_LIST_FAILURE:
            return Object.assign({}, state, {
                isAddLiquidityAPIManager: false,
                AddLiquidityAPIManagerdata: action.data,
                AddedLiquidityAPIManagerdata: false,
            })

        // for clear 
        case ADD_LIQUIDITY_API_MANAGER_LIST_CLEAR:
            return Object.assign({}, state, {
                isAddLiquidityAPIManager: false,
                AddLiquidityAPIManagerdata: null,
                AddedLiquidityAPIManagerdata: true,
            })

        //Handle LiquidityAPIManager update method data
        case UPDATE_LIQUIDITY_API_MANAGER_LIST:
            return Object.assign({}, state, {
                isEditLiquidityAPIManager: true,
                EditLiquidityAPIManagerdata: null,
                EditedLiquidityAPIManagerdata: true,
            })
        //Set LiquidityAPIManager update method success data
        case UPDATE_LIQUIDITY_API_MANAGER_LIST_SUCCESS:
        //Set LiquidityAPIManager update method failure data
        case UPDATE_LIQUIDITY_API_MANAGER_LIST_FAILURE:
            return Object.assign({}, state, {
                isEditLiquidityAPIManager: false,
                EditLiquidityAPIManagerdata: action.data,
                EditedLiquidityAPIManagerdata: false,
            })

        // for clear
        case UPDATE_LIQUIDITY_API_MANAGER_LIST_CLEAR:
            return Object.assign({}, state, {
                isEditLiquidityAPIManager: false,
                EditLiquidityAPIManagerdata: null,
                EditedLiquidityAPIManagerdata: true,
            })

        //Handle provider list method data
        case GET_PROVIDERS_LIST:
            return Object.assign({}, state, {
                isApiproviderlistFetch: true,
                Apiproviderlistdata: null,
                Apiproviderlistget: true,
            })
        //Set provider list method success data
        case GET_PROVIDERS_LIST_SUCCESS:
        //Set provider list method failure data
        case GET_PROVIDERS_LIST_FAILURE:
            return Object.assign({}, state, {
                isApiproviderlistFetch: false,
                Apiproviderlistdata: action.data,
                Apiproviderlistget: false,
            });


        //Handle limit method data
        case GET_LIMIT_DATA:
            return Object.assign({}, state, {
                isLimitListFetch: true,
                LimitListdata: null,
                LimitListget: true,
            })
        //Set limit method success data
        case GET_LIMIT_DATA_SUCCESS:
        //Set limit method failure data
        case GET_LIMIT_DATA_FAILURE:
            return Object.assign({}, state, {
                isLimitListFetch: false,
                LimitListdata: action.data,
                LimitListget: false,
            })


        //Handle service provider method data
        case GET_SERVICE_PROVIDER:
            return Object.assign({}, state, {
                isServiceProviderListFetch: true,
                ServiceProviderListdata: null,
                ServiceProviderListget: true,
            })
        //Set service provider method success data
        case GET_SERVICE_PROVIDER_SUCCESS:
        //Set service provider method failure data
        case GET_SERVICE_PROVIDER_FAILURE:
            return Object.assign({}, state, {
                isServiceProviderListFetch: false,
                ServiceProviderListdata: action.data,
                ServiceProviderListget: false,
            })

        //Handle daemon config method data
        case GET_DAEMON_CONFIG:
            return Object.assign({}, state, {
                isDaemonConfigurationlistFetch: true,
                DaemonConfigurationlistdata: null,
                DaemonConfigurationlistget: true,
            })
        //Set daemon config method success data
        case GET_DAEMON_CONFIG_SUCCESS:
        //Set daemon config method failure data
        case GET_DAEMON_CONFIG_FAILURE:
            return Object.assign({}, state, {
                isDaemonConfigurationlistFetch: false,
                DaemonConfigurationlistdata: action.data,
                DaemonConfigurationlistget: false,
            })

        //Handle service config method data
        case GET_SERVICE_CONFIG:
            return Object.assign({}, state, {
                isProviderConfigurationlistFetch: true,
                ProviderConfigurationlistdata: null,
                ProviderConfigurationlistget: true,
            })
        //Set service config method success data
        case GET_SERVICE_CONFIG_SUCCESS:
        //Set service config method failure data
        case GET_SERVICE_CONFIG_FAILURE:
            return Object.assign({}, state, {
                isProviderConfigurationlistFetch: false,
                ProviderConfigurationlistdata: action.data,
                ProviderConfigurationlistget: false,
            })

        //Handle provider type method data
        case GET_PROVIDER_TYPE:
            return Object.assign({}, state, {
                isProvidertypelistFetch: true,
                Providertypelistdata: null,
                Providertypelistget: true,
            })
        //Set provider type method success data
        case GET_PROVIDER_TYPE_SUCCESS:
        //Set provider type method failure data
        case GET_PROVIDER_TYPE_FAILURE:
            return Object.assign({}, state, {
                isProvidertypelistFetch: false,
                Providertypelistdata: action.data,
                Providertypelistget: false,
            })

        //Handle transaction type method data
        case GET_TRANSACTION_TYPE:
            return Object.assign({}, state, {
                isTransactiontypelistFetch: true,
                Transactiontypelistdata: null,
                Transactiontypelistget: true,
            })
        //Set transaction type method success data
        case GET_TRANSACTION_TYPE_SUCCESS:
        //Set transaction type method failure data
        case GET_TRANSACTION_TYPE_FAILURE:
            return Object.assign({}, state, {
                isTransactiontypelistFetch: false,
                Transactiontypelistdata: action.data,
                Transactiontypelistget: false,
            })
   
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}