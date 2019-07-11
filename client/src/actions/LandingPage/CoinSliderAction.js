// code added by devang parekh 26-12-2018
// Code for make action for handle coin slider request response and failure case

import {
    COIN_SLIDER_LIST,
    COIN_SLIDER_LIST_SUCCESS,
    COIN_SLIDER_LIST_FAILURE
} from 'Actions/types';


export const getCoinSliderList = (coinSliderRequest) => ({
    type: COIN_SLIDER_LIST,
    payload: coinSliderRequest
});


export const getCoinSliderListSuccess = (coinSliderList) => ({
    type: COIN_SLIDER_LIST_SUCCESS,
    payload: coinSliderList
});


export const getCoinSliderListFailure = (error) => ({
    type: COIN_SLIDER_LIST_FAILURE,
    payload: error
});