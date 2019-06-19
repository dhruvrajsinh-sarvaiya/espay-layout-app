// Reducers for Get Trade Route Report list  By : Tejas 25/3/219

// import action types for Trade Route
import {
    GET_TRADE_ROUTING_REPORT_LIST,
    GET_TRADE_ROUTING_REPORT_LIST_SUCCESS,
    GET_TRADE_ROUTING_REPORT_LIST_FAILURE,
} from "Actions/types";

// set initial state
const INITIAL_STATE = {
    tradeRouteReportList: [],
    tradeRoutingLoading: false,
    tradeRoutingError: [],   
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get trade route list
        case GET_TRADE_ROUTING_REPORT_LIST:

            return { ...state, tradeRoutingLoading: true,tradeRouteReportList:[],tradeRoutingError: [] };

        // set trade route list Success
        case GET_TRADE_ROUTING_REPORT_LIST_SUCCESS:

            return { ...state, tradeRoutingLoading: false, tradeRouteReportList: action.payload, tradeRoutingError: [] };

        // set trade route list failure
        case GET_TRADE_ROUTING_REPORT_LIST_FAILURE:

            return { ...state, tradeRoutingLoading: false, tradeRouteReportList: [], tradeRoutingError: action.payload };

        default:
            return { ...state };
    }
};
