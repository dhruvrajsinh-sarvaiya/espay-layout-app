// Reducer for Chart Detail Data By Tejas Date: 25/9/2018

import {
    GET_CHART_DATA,
    GET_CHART_DATA_SUCCESS,
    GET_CHART_DATA_FAILURE,
    GET_MARKET_DEPTH,
    GET_MARKET_DEPTH_SUCCESS,
    GET_MARKET_DEPTH_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    chartData: [],
    loading: false,
    marketDepth: [],
    depthLoading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {

        // get Chart Detail
        case GET_CHART_DATA:
            return { ...state, loading: true };

        // set Data Of  Chart Detail
        case GET_CHART_DATA_SUCCESS:
            return { ...state, chartData: action.payload, loading: false };

        // Display Error for Chart Detail failure
        case GET_CHART_DATA_FAILURE:
            return { ...state, loading: false, chartData: [] };

        // get Market Depth Data By Tejas Date : 12/1/2019
        case GET_MARKET_DEPTH:
            return { ...state, depthLoading: true };

        // set Data Of  Market Depth Data By Tejas Date : 12/1/2019
        case GET_MARKET_DEPTH_SUCCESS:
            return { ...state, marketDepth: action.payload, depthLoading: false };

        // Display Error for Market Depth Data failure By Tejas Date : 12/1/2019
        case GET_MARKET_DEPTH_FAILURE:
            return { ...state, depthLoading: false, marketDepth: [] };

        default: return { ...state };

    }
}