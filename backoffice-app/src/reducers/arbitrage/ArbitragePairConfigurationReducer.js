import {
    //getLpChargeConfigList
    ARBITRAGE_PAIR_LIST_CONFIGURATION,
    ARBITRAGE_PAIR_LIST_CONFIGURATION_SUCCESS,
    ARBITRAGE_PAIR_LIST_CONFIGURATION_FAILURE,

    //base market
    ARBITRGAE_BASE_MARKET,
    ARBITRGAE_BASE_MARKET_SUCCESS,
    ARBITRGAE_BASE_MARKET_FAILURE,

    //serviceConfigbase
    ARBITRGAE_SERVICE_CONFIG_BASE,
    ARBITRGAE_SERVICE_CONFIG_BASE_SUCCESS,
    ARBITRGAE_SERVICE_CONFIG_BASE_FAILURE,

    //add pair config
    ADD_ARBITRAGE_PAIR_CONFIGURATION,
    ADD_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    ADD_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,

    //updateArbiPairConfig
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION,
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,

    //clear data
    ACTION_LOGOUT,

    // Clear Arbitrage Pair Configuration Data
    CLEAR_ARBITRAGE_PAIR_CONFIGURATION_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //getLpChargeConfigList
    pairConfigListData: null,
    pairConfigListFetching: false,

    //base market
    baseMarketData: null,
    baseMarketFetching: false,

    //serviceConfigbase
    serviceConfigbaseData: null,
    serviceConfigbaseFetching: false,

    //add pair config
    pairConfigAddData: null,
    pairConfigAddDataFetching: false,

    //update pair config
    pairConfigUpdateData: null,
    pairConfigUpdateDataFetching: false,
}

export default function ArbitragePairConfigurationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_ARBITRAGE_PAIR_CONFIGURATION_DATA:
            return INITIAL_STATE

        //LpChargeConfigList
        case ARBITRAGE_PAIR_LIST_CONFIGURATION:
            return { ...state, pairConfigListFetching: true, pairConfigListData: null };
        //LpChargeConfigList success
        case ARBITRAGE_PAIR_LIST_CONFIGURATION_SUCCESS:
            return { ...state, pairConfigListFetching: false, pairConfigListData: action.payload };
        //LpChargeConfigList failure
        case ARBITRAGE_PAIR_LIST_CONFIGURATION_FAILURE:
            return { ...state, pairConfigListFetching: false, pairConfigListData: action.payload };

        //base market
        case ARBITRGAE_BASE_MARKET:
            return { ...state, baseMarketFetching: true, baseMarketData: null };
        //base market success
        case ARBITRGAE_BASE_MARKET_SUCCESS:
            return { ...state, baseMarketFetching: false, baseMarketData: action.payload };
        //base market failure
        case ARBITRGAE_BASE_MARKET_FAILURE:
            return { ...state, baseMarketFetching: false, baseMarketData: action.payload };

        //base market
        case ARBITRGAE_SERVICE_CONFIG_BASE:
            return { ...state, serviceConfigbaseFetching: true, serviceConfigbaseData: null };
        //base market success
        case ARBITRGAE_SERVICE_CONFIG_BASE_SUCCESS:
            return { ...state, serviceConfigbaseFetching: false, serviceConfigbaseData: action.payload };
        //base market failure
        case ARBITRGAE_SERVICE_CONFIG_BASE_FAILURE:
            return { ...state, serviceConfigbaseFetching: false, serviceConfigbaseData: action.payload };

        //add pair config
        case ADD_ARBITRAGE_PAIR_CONFIGURATION:
            return { ...state, pairConfigAddDataFetching: true, pairConfigAddData: null };
        //add pair config success
        case ADD_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS:
            return { ...state, pairConfigAddDataFetching: false, pairConfigAddData: action.payload };
        //add pair config failure
        case ADD_ARBITRAGE_PAIR_CONFIGURATION_FAILURE:
            return { ...state, pairConfigAddDataFetching: false, pairConfigAddData: action.payload };

        //update pair config
        case UPDATE_ARBITRAGE_PAIR_CONFIGURATION:
            return { ...state, pairConfigUpdateDataFetching: true, pairConfigUpdateData: null };
        //update pair config success
        case UPDATE_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS:
            return { ...state, pairConfigUpdateDataFetching: false, pairConfigUpdateData: action.payload };
        //update pair config failure
        case UPDATE_ARBITRAGE_PAIR_CONFIGURATION_FAILURE:
            return { ...state, pairConfigUpdateDataFetching: false, pairConfigUpdateData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}