import {
    // LIST CURRENCY
    LISTCURRENCY,
    LISTCURRENCY_SUCCESS,
    LISTCURRENCY_FAIL,
    // get list of stores records
    GET_WITHDRAWROUTELIST,
    GET_WITHDRAWROUTELIST_SUCCESS,
    GET_WITHDRAWROUTELIST_FAILURE,
    // delete routes
    DELETE_WITHDRAWROUTE,
    DELETE_WITHDRAWROUTE_SUCCESS,
    DELETE_WITHDRAWROUTE_FAILURE,
    // get available route list
    GET_WITHDRAWROUTEINFO,
    GET_WITHDRAWROUTEINFO_SUCCESS,
    GET_WITHDRAWROUTEINFO_FAILURE,
    // post info
    POST_WITHDRAWROUTEINFO,
    POST_WITHDRAWROUTEINFO_SUCCESS,
    POST_WITHDRAWROUTEINFO_FAILURE,
    //get route by id
    GETROUTEBYID,
    GETROUTEBYID_SUCCESS,
    GETROUTEBYID_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    errors: {},
    routeInfo: {},
    currencyList: [],
    withdrawRouteList: [],
    availableRouteList: [],
    addResponse: {},
    delResponse: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // list currency
        case LISTCURRENCY:
            return { ...state, errors: {}, routeInfo: {}, currencyList: [], availableRouteList: [], addResponse: {}, delResponse: {}, loading: true }
        case LISTCURRENCY_SUCCESS:
            return { ...state, currencyList: action.payload, errors: {}, routeInfo: {}, availableRouteList: [], addResponse: {}, loading: false }
        case LISTCURRENCY_FAIL:
            return { ...state, loading: false, errors: action.payload, currencyList: [], routeInfo: {}, availableRouteList: [], addResponse: {} }

        // added routes list
        case GET_WITHDRAWROUTELIST:
            return { ...state, loading: true, errors: {}, withdrawRouteList: [], addResponse: {}, delResponse: {} };
        case GET_WITHDRAWROUTELIST_SUCCESS:
            return { ...state, loading: false, errors: {}, withdrawRouteList: action.payload, addResponse: {} };
        case GET_WITHDRAWROUTELIST_FAILURE:
            return { ...state, loading: false, errors: action.payload, withdrawRouteList: [], addResponse: {} };

        //on delete withdraw route
        case DELETE_WITHDRAWROUTE:
            return { ...state, loading: true, delResponse: {}, addResponse: {} };
        case DELETE_WITHDRAWROUTE_SUCCESS:
        case DELETE_WITHDRAWROUTE_FAILURE:
            return { ...state, loading: false, delResponse: action.payload };

        //get info
        case GET_WITHDRAWROUTEINFO:
            return { ...state, loading: true, errors: {}, addResponse: {} };
        case GET_WITHDRAWROUTEINFO_SUCCESS:
            return { ...state, loading: false, availableRouteList: action.payload, errors: {} };
        case GET_WITHDRAWROUTEINFO_FAILURE:
            return { ...state, loading: false, errors: action.payload, availableRouteList: [] };

        // post info
        case POST_WITHDRAWROUTEINFO:
            return { ...state, loading: true, addResponse: {} };
        case POST_WITHDRAWROUTEINFO_SUCCESS:
        case POST_WITHDRAWROUTEINFO_FAILURE:
            return { ...state, loading: false, addResponse: action.payload, routeInfo: {} };

        //get route by id
        case GETROUTEBYID:
            return { ...state, loading: true, routeInfo: {}, addResponse: {} };
        case GETROUTEBYID_SUCCESS:
            return { ...state, loading: false, routeInfo: action.payload };
        case GETROUTEBYID_FAILURE:
            return { ...state, loading: false, errors: action.payload };

        default:
            return { ...state };
    }
};