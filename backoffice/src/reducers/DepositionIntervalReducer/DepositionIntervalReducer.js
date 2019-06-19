/**
 *   Developer : Parth Andhariya
 *   Date : 22-03-2019
 *   Component: Deposition Interval reducer
 */
import {
    GET_DEPOSIT_INTERVAL,
    GET_DEPOSIT_INTERVAL_SUCCESS,
    GET_DEPOSIT_INTERVAL_FAILURE,
    ADD_UPDATE_DEPOSIT_INTERVAL,
    ADD_UPDATE_DEPOSIT_INTERVAL_SUCCESS,
    ADD_UPDATE_DEPOSIT_INTERVAL_FAILURE
} from "Actions/types";

// initial state
const INIT_STATE = {
    loading: false,
    DepositionIntervalList: [],
    Data: ""
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //List Charge Configuration
        case GET_DEPOSIT_INTERVAL:
            return {
                ...state,
                loading: true,
                DepositionIntervalList: [],
                Data: ""
            };
        case GET_DEPOSIT_INTERVAL_SUCCESS:
            return {
                ...state,
                loading: false,
                DepositionIntervalList: action.payload
            };
        case GET_DEPOSIT_INTERVAL_FAILURE:
            return {
                ...state,
                loading: false,
                DepositionIntervalList: action.payload
            };
        //Add Charge Configuration
        case ADD_UPDATE_DEPOSIT_INTERVAL:
            return { ...state, loading: true, Data: "", DepositionIntervalList: [] };
        case ADD_UPDATE_DEPOSIT_INTERVAL_SUCCESS:
            return { ...state, loading: false, Data: action.payload };
        case ADD_UPDATE_DEPOSIT_INTERVAL_FAILURE:
            return {
                ...state,
                loading: false,
                Data: action.payload
            };
        default:
            return { ...state };
    }
};
