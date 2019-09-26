import {
    //trade routes list
    GET_TRADE_ROUTES,
    GET_TRADE_ROUTES_SUCCESS,
    GET_TRADE_ROUTES_FAILURE,

    //trade routes add
    ADD_TRADE_ROUTES_CONFIGURATION,
    ADD_TRADE_ROUTES_CONFIGURATION_SUCCESS,
    ADD_TRADE_ROUTES_CONFIGURATION_FAILURE,

    //trade routes edit
    UPDATE_TRADE_ROUTES_CONFIGURATION,
    UPDATE_TRADE_ROUTES_CONFIGURATION_SUCCESS,
    UPDATE_TRADE_ROUTES_CONFIGURATION_FAILURE,

    //order types
    GET_ORDER_TYPES,
    GET_ORDER_TYPES_SUCCESS,
    GET_ORDER_TYPES_FAILURE,

    //available trade routes
    GET_AVAILABLE_TRADE_ROUTES,
    GET_AVAILABLE_TRADE_ROUTES_SUCCESS,
    GET_AVAILABLE_TRADE_ROUTES_FAILURE,

    //clear data
    CLEAN_ADD_UPDATE_TRADE_ROUTES_CONFIGURATION,
    CLEAN_TRADE_ROUTES_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {

    //Get Trade Routes
    tradeRoutes: null,
    isLoadingTradeRoutes: false,
    tradeRoutesError: false,

    //Add Trade Routes
    addTradeRoutes: null,
    isAddingTradeRoutes: false,
    addTradeRoutesError: false,

    //Update Trade Routes
    updateTradeRoutes: null,
    isUpdatingTradeRoutes: false,
    updateTradeRoutesError: false,

    //Get Order Types
    orderTypes: null,
    isLoadingOrderTypes: false,
    orderTypesError: false,

    //Get Available Trade Routes
    availableTradeRoutes: null,
    isLoadingAvailableTradeRoutes: false,
    availableTradeRoutesError: false,
}

export default function tradeRoutesBOReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAN_TRADE_ROUTES_DATA:
            return initialState

        //Clean add update trade routes response
        case CLEAN_ADD_UPDATE_TRADE_ROUTES_CONFIGURATION: {
            return Object.assign({}, state, {
                addTradeRoutes: null,
                updateTradeRoutes: null,
            })
        }

        //Handle Get Trade Routes method data
        case GET_TRADE_ROUTES: {
            return Object.assign({}, state, {
                tradeRoutes: null,
                isLoadingTradeRoutes: true,
                tradeRoutesError: false,
            })
        }
        //Set Get Trade Routes method success data
        case GET_TRADE_ROUTES_SUCCESS: {
            return Object.assign({}, state, {
                tradeRoutes: action.payload,
                isLoadingTradeRoutes: false,
                tradeRoutesError: false
            })
        }
        //Set Get Trade Routes method failure data
        case GET_TRADE_ROUTES_FAILURE: {
            return Object.assign({}, state, {
                tradeRoutes: null,
                isLoadingTradeRoutes: false,
                tradeRoutesError: true
            })
        }

        //Handle Add Trade Route Configuration method data        
        case ADD_TRADE_ROUTES_CONFIGURATION: {
            return Object.assign({}, state, {
                addTradeRoutes: null,
                isAddingTradeRoutes: true,
                addTradeRoutesError: false,
            })
        }
        //Set Add Trade Route Configuration method succcess data 
        case ADD_TRADE_ROUTES_CONFIGURATION_SUCCESS: {
            return Object.assign({}, state, {
                addTradeRoutes: action.payload,
                isAddingTradeRoutes: false,
                addTradeRoutesError: false
            })
        }
        //Set Add Trade Route Configuration method failure data 
        case ADD_TRADE_ROUTES_CONFIGURATION_FAILURE: {
            return Object.assign({}, state, {
                addTradeRoutes: null,
                isAddingTradeRoutes: false,
                addTradeRoutesError: true
            })
        }

        //Handle Update Trade Route Configuration method data
        case UPDATE_TRADE_ROUTES_CONFIGURATION: {
            return Object.assign({}, state, {
                updateTradeRoutes: null,
                isUpdatingTradeRoutes: true,
                updateTradeRoutesError: false,
            })
        }
        //Set Update Trade Route Configuration method success data
        case UPDATE_TRADE_ROUTES_CONFIGURATION_SUCCESS: {
            return Object.assign({}, state, {
                updateTradeRoutes: action.payload,
                isUpdatingTradeRoutes: false,
                updateTradeRoutesError: false
            })
        }
        //Set Update Trade Route Configuration method failure data
        case UPDATE_TRADE_ROUTES_CONFIGURATION_FAILURE: {
            return Object.assign({}, state, {
                updateTradeRoutes: null,
                isUpdatingTradeRoutes: false,
                updateTradeRoutesError: true
            })
        }

        //Handle Get Order Type method data
        case GET_ORDER_TYPES: {
            return Object.assign({}, state, {
                orderTypes: null,
                isLoadingOrderTypes: true,
                orderTypesError: false,
            })
        }
        //Set Get Order Type method success data
        case GET_ORDER_TYPES_SUCCESS: {
            return Object.assign({}, state, {
                orderTypes: action.payload,
                isLoadingOrderTypes: false,
                orderTypesError: false
            })
        }
        //Set Get Order Type method failure data
        case GET_ORDER_TYPES_FAILURE: {
            return Object.assign({}, state, {
                orderTypes: null,
                isLoadingOrderTypes: false,
                orderTypesError: true
            })
        }

        //Handle Get Available Trade Routes method data
        case GET_AVAILABLE_TRADE_ROUTES: {
            return Object.assign({}, state, {
                availableTradeRoutes: null,
                isLoadingAvailableTradeRoutes: true,
                availableTradeRoutesError: false,
            })
        }
        //Set Get Available Trade Routes method success data
        case GET_AVAILABLE_TRADE_ROUTES_SUCCESS: {
            return Object.assign({}, state, {
                availableTradeRoutes: action.payload,
                isLoadingAvailableTradeRoutes: false,
                availableTradeRoutesError: false
            })
        }
        //Set Get Available Trade Routes method failure data
        case GET_AVAILABLE_TRADE_ROUTES_FAILURE: {
            return Object.assign({}, state, {
                availableTradeRoutes: null,
                isLoadingAvailableTradeRoutes: false,
                availableTradeRoutesError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}