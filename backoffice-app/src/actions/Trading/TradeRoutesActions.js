import { action } from '../GlobalActions';
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
    CLEAN_TRADE_ROUTES_DATA
} from "../ActionTypes";

//To clean add/update trade routes
export function cleanAddUpdateTradeRoutes() { return action(CLEAN_ADD_UPDATE_TRADE_ROUTES_CONFIGURATION); }

//Redux action To get trade routes
export function getTradeRoutes() { return action(GET_TRADE_ROUTES); }
//Redux action To get trade routes success
export function getTradeRoutesSuccess(payload) { return action(GET_TRADE_ROUTES_SUCCESS, { payload }); }
//Redux action To get trade routes failure
export function getTradeRoutesFailure() { return action(GET_TRADE_ROUTES_FAILURE); }

//Redux action To add trade route configuration
export function addTradeRoutesConfiguration(payload) { return action(ADD_TRADE_ROUTES_CONFIGURATION, { payload }); }
//Redux action To add trade route configuration success
export function addTradeRoutesConfigurationSuccess(payload) { return action(ADD_TRADE_ROUTES_CONFIGURATION_SUCCESS, { payload }); }
//Redux action To add trade route configuration failure
export function addTradeRoutesConfigurationFailure() { return action(ADD_TRADE_ROUTES_CONFIGURATION_FAILURE); }

//Redux action To update trade route configuration
export function updateTradeRoutesConfiguration(payload) { return action(UPDATE_TRADE_ROUTES_CONFIGURATION, { payload }); }
//Redux action To update trade route configuration success
export function updateTradeRoutesConfigurationSuccess(payload) { return action(UPDATE_TRADE_ROUTES_CONFIGURATION_SUCCESS, { payload }); }
//Redux action To update trade route configuration failure
export function updateTradeRoutesConfigurationFailure() { return action(UPDATE_TRADE_ROUTES_CONFIGURATION_FAILURE); }

//Redux action To get order types
export function getOrderTypes() { return action(GET_ORDER_TYPES); }
//Redux action To get order types success
export function getOrderTypesSuccess(payload) { return action(GET_ORDER_TYPES_SUCCESS, { payload }); }
//Redux action To get order types failure
export function getOrderTypesFailure() { return action(GET_ORDER_TYPES_FAILURE); }

//Redux action To get available trade routes
export function getAvailableTradeRoutes(payload) { return action(GET_AVAILABLE_TRADE_ROUTES, { payload }); }
//Redux action To get available trade routes success
export function getAvailableTradeRoutesSuccess(payload) { return action(GET_AVAILABLE_TRADE_ROUTES_SUCCESS, { payload }); }
//Redux action To get available trade routes failure
export function getAvailableTradeRoutesFailure() { return action(GET_AVAILABLE_TRADE_ROUTES_FAILURE); }

//clear data
export function clearTradeRouteData() { return action(CLEAN_TRADE_ROUTES_DATA); }