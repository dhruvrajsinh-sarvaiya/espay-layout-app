import {
    //Pair Configuration List 
    GET_PAIR_CONFIGURATION_LIST,
    GET_PAIR_CONFIGURATION_LIST_SUCCESS,
    GET_PAIR_CONFIGURATION_LIST_FAILURE,

    //Market Currency List 
    GET_MARKET_CURRENCY,
    GET_MARKET_CURRENCY_SUCCESS,
    GET_MARKET_CURRENCY_FAILURE,

    //Pair Currency List
    GET_PAIR_CURRENCY,
    GET_PAIR_CURRENCY_SUCCESS,
    GET_PAIR_CURRENCY_FAILURE,

    //Add Pair Cofiguration
    ADD_PAIR_CONFIGURATION,
    ADD_PAIR_CONFIGURATION_SUCCESS,
    ADD_PAIR_CONFIGURATION_FAILURE,

    //Edit Pair Cofiguration
    EDIT_PAIR_CONFIGURATION,
    EDIT_PAIR_CONFIGURATION_SUCCESS,
    EDIT_PAIR_CONFIGURATION_FAILURE,
    CLEAR_PAIRCONFIGURATION_DATA,

    //clear data
    ACTION_LOGOUT,
    CLEAR_PAIR_DATA,
} from "../../actions/ActionTypes";

// Set Initial State
const INITIAL_STATE = {

    /* Pair Configuration List for Flatlist */
    pairConfigurationData: null,
    pairConfigurationLoading: false,
    pairConfigurationError: false,

    /* Market Currency List  */
    marketCurrencyData: null,
    marketCurrencyLoading: false,
    marketCurrencyError: false,

    /* Pair Currency List */
    pairCurrencyData: null,
    pairCurrencyLoading: false,
    pairCurrencyError: false,

    /* Add Pair Cofiguration */
    addPairSuccessData: null,
    addPairSuccessLoading: false,
    addPairSuccessError: false,

    /* Edit Pair Cofiguration */
    editPairSuccessData: null,
    editPairSuccessLoading: false,
    editPairSuccessError: false,
}

export default function pairConfigurationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logoutF
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // To reset initial state on clear data
        case CLEAR_PAIRCONFIGURATION_DATA:
            return INITIAL_STATE;

        //Handle pair configuration list method data
        case GET_PAIR_CONFIGURATION_LIST:
            return Object.assign({}, state, {
                pairConfigurationData: null,
                pairConfigurationLoading: true
            })
        //Set pair configuration list method success data
        case GET_PAIR_CONFIGURATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                pairConfigurationData: action.data,
                pairConfigurationLoading: false
            })
        //Set pair configuration list method failure data
        case GET_PAIR_CONFIGURATION_LIST_FAILURE:
            return Object.assign({}, state, {
                pairConfigurationData: null,
                pairConfigurationLoading: false,
                pairConfigurationError: true
            })

        //Handle market currency method data
        case GET_MARKET_CURRENCY:
            return Object.assign({}, state, {
                marketCurrencyData: null,
                marketCurrencyLoading: true
            })
        //Set market currency method success data
        case GET_MARKET_CURRENCY_SUCCESS:
            return Object.assign({}, state, {
                marketCurrencyData: action.data,
                marketCurrencyLoading: false
            })
        //Set market currency method failure data
        case GET_MARKET_CURRENCY_FAILURE:
            return Object.assign({}, state, {
                marketCurrencyData: null,
                marketCurrencyLoading: false,
                marketCurrencyError: true
            })

        //Handle pair currency method data
        case GET_PAIR_CURRENCY:
            return Object.assign({}, state, {
                pairCurrencyData: null,
                pairCurrencyLoading: true
            })
        //Set pair currency method success data
        case GET_PAIR_CURRENCY_SUCCESS:
            return Object.assign({}, state, {
                pairCurrencyData: action.data,
                pairCurrencyLoading: false
            })
        //Set pair currency method failure data
        case GET_PAIR_CURRENCY_FAILURE:
            return Object.assign({}, state, {
                pairCurrencyData: null,
                pairCurrencyLoading: false,
                pairCurrencyError: true
            })

        //Handle add pair configuration method data
        case ADD_PAIR_CONFIGURATION:
            return Object.assign({}, state, {
                addPairSuccessData: null,
                addPairSuccessLoading: true
            })
        //Set add pair configuration method success data
        case ADD_PAIR_CONFIGURATION_SUCCESS:
            return Object.assign({}, state, {
                addPairSuccessData: action.data,
                addPairSuccessLoading: false
            })
        //Set add pair configuration method failure data
        case ADD_PAIR_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                addPairSuccessData: null,
                addPairSuccessLoading: false,
                addPairSuccessError: true
            })

        //Handle edit pair configuration method data
        case EDIT_PAIR_CONFIGURATION:
            return Object.assign({}, state, {
                editPairSuccessData: null,
                editPairSuccessLoading: true
            })
        //Set edit pair configuration method success data
        case EDIT_PAIR_CONFIGURATION_SUCCESS:
            return Object.assign({}, state, {
                editPairSuccessData: action.data,
                editPairSuccessLoading: false
            })
        //Set edit pair configuration method failure data
        case EDIT_PAIR_CONFIGURATION_FAILURE:
            return Object.assign({}, state, {
                editPairSuccessData: null,
                editPairSuccessLoading: false,
                editPairSuccessError: true
            })

        //clear data
        case CLEAR_PAIR_DATA:
            return Object.assign({}, state, {
                addPairSuccessLoading: false,
                addPairSuccessData: null,
                editPairSuccessLoading: false,
                editPairSuccessData: null
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}