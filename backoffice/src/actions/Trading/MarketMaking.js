/* created by : Palak
   date: 04.06.2019
   File :Action file for Market Making List Component
   */
// import types
import {
    GET_MARKET_MAKING,
    GET_MARKET_MAKING_SUCCESS,
    GET_MARKET_MAKING_FAILURE,

    UPDATE_MARKET_MAKING,
    UPDATE_MARKET_MAKING_SUCCESS,
    UPDATE_MARKET_MAKING_FAILURE,
} from "Actions/types";

// Redux Action To Get List Market Making
export const getMarketMaking = () => ({
    type: GET_MARKET_MAKING,
})

// Redux Action To Get List Market Making success
export const getMarketMakingSuccess = (data) => ({
    type: GET_MARKET_MAKING_SUCCESS,
    payload: data
});

// Redux Action To Get List Market Making failure
export const getMarketMakingFailure = (error) => ({
    type: GET_MARKET_MAKING_FAILURE,
    payload: error
});

// Redux Action To Update Market Making
export const updateMarketMaking = (data) => ({
    type: UPDATE_MARKET_MAKING,
    payload: data
});

// Redux Action To Update Market Making success
export const updateMarketMakingSuccess = (data) => ({
    type: UPDATE_MARKET_MAKING_SUCCESS,
    payload: data
});

// Redux Action To Update Market Making failure
export const updateMarketMakingFailure = (error) => ({
    type: UPDATE_MARKET_MAKING_FAILURE,
    payload: error
});