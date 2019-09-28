import {
    // get list of stores records
    GET_WITHDRAWROUTELIST,
    GET_WITHDRAWROUTELIST_SUCCESS,
    GET_WITHDRAWROUTELIST_FAILURE,

    // delete routes
    DELETE_WITHDRAWROUTE,
    DELETE_WITHDRAWROUTE_SUCCESS,
    DELETE_WITHDRAWROUTE_FAILURE,

    //get currency list
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,

    //get routes
    GET_WITHDRAWROUTEINFO,
    GET_WITHDRAWROUTEINFO_SUCCESS,
    GET_WITHDRAWROUTEINFO_FAILURE,

    //add address genration
    ADD_ADDRESS_GENRATION_ROUTE,
    ADD_ADDRESS_GENRATION_ROUTE_SUCCESS,
    ADD_ADDRESS_GENRATION_ROUTE_FAIL,

    //Update address genration
    UPDATE_ADDRESS_GENRATION_ROUTE,
    UPDATE_ADDRESS_GENRATION_ROUTE_SUCCESS,
    UPDATE_ADDRESS_GENRATION_ROUTE_FAIL,

    //Action Logout 
    ACTION_LOGOUT,

    //clear reducer data
    CLEAR_WITHDRAWROUTE,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {
    //for list
    withdrawRouteList: null,
    loading: false,

    //delete
    deleteRoute: null,
    deleteRouteFetching: false,

    //routeid loading
    routeIdLoading: false,
    routeInfo: null,

    //for available Route
    loadingAvailableRoute: false,
    availableRoute: null,

    //for currency
    pairCurrencyLoading: false,
    pairCurrencyList: null,

    // add Charge Config detail Data
    addAddressGenrationLoading: false,
    addAddressGenrationData: null,

    // update Charge Config detail Data
    updateAddressGenrationLoading: false,
    updateAddressGenrationData: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //for clear reducer data on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        //for clear reducer data
        case CLEAR_WITHDRAWROUTE: {
            return INITIAL_STATE;
        }

        // Handle Withdraw Route List method data
        case GET_WITHDRAWROUTELIST:
            return Object.assign({}, state, { loading: true, withdrawRouteList: null, })

        // Set Withdraw List success data
        case GET_WITHDRAWROUTELIST_SUCCESS:
            return Object.assign({}, state, { loading: false, withdrawRouteList: action.payload, })

        // Set Withdraw List failure data
        case GET_WITHDRAWROUTELIST_FAILURE:
            return Object.assign({}, state, { loading: false, withdrawRouteList: action.payload, })

        // Handle delete withdraw route method data
        case DELETE_WITHDRAWROUTE:
            return Object.assign({}, state, { deleteRouteFetching: true, deleteRoute: null })

        // Set delete withdraw route success data
        case DELETE_WITHDRAWROUTE_SUCCESS:
            return Object.assign({}, state, { deleteRouteFetching: false, deleteRoute: action.payload })

        // Set delete withdraw route failure data
        case DELETE_WITHDRAWROUTE_FAILURE:
            return Object.assign({}, state, { deleteRouteFetching: false, deleteRoute: action.payload })

        // Handle available route method data
        case GET_WITHDRAWROUTEINFO:
            return Object.assign({}, state, { availableRoute: null, loadingAvailableRoute: true, })

        // Set available route success data
        case GET_WITHDRAWROUTEINFO_SUCCESS:
            return Object.assign({}, state, { availableRoute: action.payload, loadingAvailableRoute: false })

        // Set available route failure data
        case GET_WITHDRAWROUTEINFO_FAILURE:
            return Object.assign({}, state, { availableRoute: action.payload, loadingAvailableRoute: false })

        // Handle get currency list method data
        case GET_CURRENCY_LIST:
            return Object.assign({}, state, { pairCurrencyList: null, pairCurrencyLoading: true })

        // Set currency list success data
        case GET_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, { pairCurrencyList: action.payload, pairCurrencyLoading: false })

        // Set currency list failure data
        case GET_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, { pairCurrencyList: action.payload, pairCurrencyLoading: false })

        // Handle update Charge Config Data method data
        case UPDATE_ADDRESS_GENRATION_ROUTE:
            return Object.assign({}, state, { updateAddressGenrationLoading: true, updateAddressGenrationData: null, })

        // Set update Charge Config Data success data
        case UPDATE_ADDRESS_GENRATION_ROUTE_SUCCESS:
            return Object.assign({}, state, { updateAddressGenrationLoading: false, updateAddressGenrationData: action.payload, })

        // Set update Charge Config Data failure data
        case UPDATE_ADDRESS_GENRATION_ROUTE_FAIL:
            return Object.assign({}, state, { updateAddressGenrationLoading: false, updateAddressGenrationData: action.payload, })

        // Handle add Charge Config Data method data
        case ADD_ADDRESS_GENRATION_ROUTE:
            return Object.assign({}, state, { addAddressGenrationLoading: true, addAddressGenrationData: null, })

        // Set add Charge Config Data success data
        case ADD_ADDRESS_GENRATION_ROUTE_SUCCESS:
            return Object.assign({}, state, { addAddressGenrationLoading: false, addAddressGenrationData: action.payload, })

        // Set add Charge Config Data failure data
        case ADD_ADDRESS_GENRATION_ROUTE_FAIL:
            return Object.assign({}, state, { addAddressGenrationLoading: false, addAddressGenrationData: action.payload, })

        default:
            return state
    }
};
