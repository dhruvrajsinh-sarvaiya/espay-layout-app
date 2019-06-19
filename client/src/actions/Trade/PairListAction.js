// Actions For Get Pair list By Tejas Date :14/9/2018

// import types
import {
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,
  GET_VOLUME_DATA,
  GET_VOLUME_DATA_SUCCESS,
  GET_VOLUME_DATA_FAILURE,
  GET_FAVOURITE_PAIR_LIST,
  GET_FAVOURITE_PAIR_LIST_SUCCESS,
  GET_FAVOURITE_PAIR_LIST_FAILED,
  ADD_PAIR_TO_FAVOURITE_PAIR,
  ADD_PAIR_TO_FAVOURITE_PAIR_SUCCESS,
  ADD_PAIR_TO_FAVOURITE_PAIR_FAILED,
  REMOVE_PAIR_FROM_FAVOURITE_PAIR,
  REMOVE_PAIR_FROM_FAVOURITE_PAIR_SUCCESS,
  REMOVE_PAIR_FROM_FAVOURITE_PAIR_FAILED,
} from "Actions/types";

//action for get pair list and set type for reducers
export const getPairList = Pair => ({
  type: GET_PAIR_LIST,
  payload: Pair
});

//action for set Success and data to  pair list and set type for reducers
export const getPairListSuccess = response => ({
  type: GET_PAIR_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to  pair list and set type for reducers
export const getPairListFailure = error => ({
  type: GET_PAIR_LIST_FAILURE,
  payload: error
});

//action for get Volume Data and set type for reducers
export const getVolumeData = BasePair => ({
  type: GET_VOLUME_DATA,
  payload: { BasePair }
});

//action for set Success and data to  pair list and set type for reducers
export const getVolumeDataSuccess = response => ({
  type: GET_VOLUME_DATA_SUCCESS,
  payload: response.response
});

//action for set failure and error to  pair list and set type for reducers
export const getVolumeDataFailure = error => ({
  type: GET_VOLUME_DATA_FAILURE,
  payload: error
});

//get favourite pair list
export const getFavouritePairList = PairList => ({
  type: GET_FAVOURITE_PAIR_LIST,
  payload: PairList
});

//get favourite pair list success
export const getFavouritePairListSuccess = response => ({
  type: GET_FAVOURITE_PAIR_LIST_SUCCESS,
  payload: response.response
});

//get favourite pair list failed
export const getFavouritePairListFailure = error => ({
  type: GET_FAVOURITE_PAIR_LIST_FAILED,
  payload: error
});

//Add favourite pair 
export const addToFavouritePairList = PairList => ({
  type: ADD_PAIR_TO_FAVOURITE_PAIR,
  payload: PairList
});

//Add favourite pair  success
export const addToFavouritePairListSuccess = response => ({
  type: ADD_PAIR_TO_FAVOURITE_PAIR_SUCCESS,
  payload: response
});

//Add favourite pair  failed
export const addToFavouritePairListFailure = error => ({
  type: ADD_PAIR_TO_FAVOURITE_PAIR_FAILED,
  payload: error
});

//Add favourite pair 
export const removeFromFavouritePairList = PairList => ({
  type: REMOVE_PAIR_FROM_FAVOURITE_PAIR,
  payload: PairList
});

//Add favourite pair  success
export const removeFromFavouritePairListSuccess = response => ({
  type: REMOVE_PAIR_FROM_FAVOURITE_PAIR_SUCCESS,
  payload: response
});

//Add favourite pair  failed
export const removeFromFavouritePairListFailure = error => ({
  type: REMOVE_PAIR_FROM_FAVOURITE_PAIR_FAILED,
  payload: error
});