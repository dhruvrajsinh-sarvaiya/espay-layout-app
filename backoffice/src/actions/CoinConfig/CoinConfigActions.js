/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    File Comment : Coin Config File actions list, edit , update, & delete
*/
import {
  // get list
  GET_COINLIST,
  GET_COINLIST_SUCCESS,
  GET_COINLIST_FAILURE,
  // add coin
  ADD_COIN,
  ADD_COIN_SUCCESS,
  ADD_COIN_FAILURE,
  // get coin details for edit
  GET_COINDETAILS,
  GET_COINDETAILS_SUCCESS,
  GET_COINDETAILS_FAILURE,
  // update coin
  UPDATE_COIN,
  UPDATE_COIN_SUCCESS,
  UPDATE_COIN_FAILURE,
  // delete coin
  DELETE_COIN,
  DELETE_COIN_SUCCESS,
  DELETE_COIN_FAILURE
} from "../types";

// get coin list methods
export const getCoinList = () => ({
  type: GET_COINLIST
});
export const getCoinListSuccess = response => ({
  type: GET_COINLIST_SUCCESS,
  payload: response
});
export const getCoinListFailure = error => ({
  type: GET_COINLIST_FAILURE,
  payload: error
});

// add coin methods
export const addCoin = request => ({
  type: ADD_COIN,
  request: request
});
export const addCoinSuccess = response => ({
  type: ADD_COIN_SUCCESS,
  payload: response
});
export const addCoinFailure = error => ({
  type: ADD_COIN_FAILURE,
  payload: error
});

// get coin details methods
export const getCoinDetails = coinId => ({
  type: GET_COINDETAILS,
  coinId: coinId
});
export const getCoinDetailsSuccess = response => ({
  type: GET_COINDETAILS_SUCCESS,
  payload: response
});
export const getCoinDetailsFailure = error => ({
  type: GET_COINDETAILS_FAILURE,
  payload: error
});

// update coin methods
export const updateCoin = request => ({
  type: UPDATE_COIN,
  request: request
});
export const updateCoinSuccess = response => ({
  type: UPDATE_COIN_SUCCESS,
  payload: response
});
export const updateCoinFailure = error => ({
  type: UPDATE_COIN_FAILURE,
  payload: error
});

// delete coin methods
export const deleteCoin = coinId => ({
  type: DELETE_COIN,
  coinId: coinId
});
export const deleteCoinSuccess = response => ({
  type: DELETE_COIN_SUCCESS,
  payload: response
});
export const deleteCoinFailure = error => ({
  type: DELETE_COIN_FAILURE,
  payload: error
});
