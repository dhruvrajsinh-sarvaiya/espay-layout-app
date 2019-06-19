/**
 * Auther : Salim Deraiya
 * Created : 23-01-2019
 * Historical Performance Reducers
 */

import {
    //Edit Profile
    GET_HISTORICAL_PERFORMANCE_CHART_DATA,
    GET_HISTORICAL_PERFORMANCE_CHART_DATA_SUCCESS,
    GET_HISTORICAL_PERFORMANCE_CHART_DATA_FAILURE,
} from 'Actions/types';

/**
 * initial Historical Performance
 */
const INIT_STATE = {
    chartData: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) 
    {
        //Edit Profile
        case GET_HISTORICAL_PERFORMANCE_CHART_DATA:
            return { ...state, loading: true, chartData: '' };

        case GET_HISTORICAL_PERFORMANCE_CHART_DATA_SUCCESS:
            return { ...state, loading: false, chartData: action.payload };

        case GET_HISTORICAL_PERFORMANCE_CHART_DATA_FAILURE:
            return { ...state, loading: false, chartData: action.payload };

        default:
            return { ...state };
    }
}