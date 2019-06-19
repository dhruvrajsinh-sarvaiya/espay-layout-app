// Actions For Market Details Data By Tejas

// import types
import {
  GET_MARKET_DETAIL_DATA,
  GET_MARKET_DETAIL_DATA_SUCCESS,
  GET_MARKET_DETAIL_DATA_FAILURE
} from "Actions/types";

//action for ge MarketDetail Data and set type for reducers
export const getMarketDetailData = Pair => ({
  type: GET_MARKET_DETAIL_DATA,
  payload: { Pair }
});

//action for set Success and MarketDetail Data and set type for reducers
export const getMArketDetailDataSuccess = response => ({
  type: GET_MARKET_DETAIL_DATA_SUCCESS,
  payload: response.data
});

//action for set failure and error to MarketDetail Data and set type for reducers
export const getMArketDetailDataFailure = error => ({
  type: GET_MARKET_DETAIL_DATA_FAILURE,
  payload: error
});
