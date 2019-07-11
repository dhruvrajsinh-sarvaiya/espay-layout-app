// Actions For Top Losers Data By Tejas

// import types
import {
  GET_TOP_LOSERS_DATA,
  GET_TOP_LOSERS_DATA_SUCCESS,
  GET_TOP_LOSERS_DATA_FAILURE
} from "Actions/types";

//action for ge Top Losers and set type for reducers
export const getTopLosersData = Data => ({
  type: GET_TOP_LOSERS_DATA,
  payload: { Data }
});

//action for set Success and Top Losers and set type for reducers
export const getTopLosersSuccess = response => ({
  type: GET_TOP_LOSERS_DATA_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Top Losers and set type for reducers
export const getTopLosersFailure = error => ({
  type: GET_TOP_LOSERS_DATA_FAILURE,
  payload: error
});
