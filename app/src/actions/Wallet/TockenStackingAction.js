import {
  // Fetch Slab List
  FETCH_SLAB_LIST,

  // Fetching Token Stacking History Data
  FETCHING_TOKEN_STACKING_HISTORY_DATA,

  //get pre confirmation details...
  PRECONFIRMATIONDETAILS,
  PRECONFIRMATIONDETAILS_SUCCESS,
  PRECONFIRMATIONDETAILS_FAILURE,

  //stak request
  STAKREQUEST,
  STAKREQUEST_SUCCESS,
  STAKREQUEST_FAILURE,
  DropdownChange,

  //For Unstaking
  UNSTAKING_REQUEST,
  UNSTAKING_REQUEST_SUCCESS,
  UNSTAKING_REQUEST_FAILURE,

  // unstaking pre confirmation
  UNSTAKPRECONFIRMATION,
  UNSTAKPRECONFIRMATION_SUCCESS,
  UNSTAKPRECONFIRMATION_FAILURE,
} from "../ActionTypes";
import { action } from '../GlobalActions';

// Redux action For Slab List From Token Stacking
export function GetSlabList(request) {
  return action(FETCH_SLAB_LIST, { request })
}

// Redux action For Token Stacking History Data
export function onTokenStackingHistory(stakingHistoryRequest) {
  return action(FETCHING_TOKEN_STACKING_HISTORY_DATA, { stakingHistoryRequest })
}

// Redux action to Get pre confirmation details
export const getPreConfirmationDetails = (request) => ({
  type: PRECONFIRMATIONDETAILS,
  request: request
})

// Redux action to Get pre confirmation details success
export const getPreConfirmationDetailsSuccess = (response) => ({
  type: PRECONFIRMATIONDETAILS_SUCCESS,
  payload: response
})

// Redux action to Get pre confirmation details failure
export const getPreConfirmationDetailsFailure = (error) => ({
  type: PRECONFIRMATIONDETAILS_FAILURE,
  error: error
})

// Redux action to post staking request
export const postStackRequest = (request) => ({
  type: STAKREQUEST,
  request: request
})

// Redux action to post staking request success
export const postStackRequestSuccess = (response) => ({
  type: STAKREQUEST_SUCCESS,
  payload: response
})

// Redux action to post staking request failure
export const postStackRequestFailure = (error) => ({
  type: STAKREQUEST_FAILURE,
  error: error
})

//on Dropdown coin or address selection
export function OnDropdownChange() {
  return action(DropdownChange)
}

// Redux action to UnStacking request
export const onUnstacking = (request) => ({
  type: UNSTAKING_REQUEST,
  request: request
})

// Redux action to UnStacking request success
export const UnstackingRequestSuccess = (response) => ({
  type: UNSTAKING_REQUEST_SUCCESS,
  payload: response
})

// Redux action to UnStacking request failure
export const UnstackingRequestFailure = (error) => ({
  type: UNSTAKING_REQUEST_FAILURE,
  error: error
})

// Redux action to unstaking pre confirmation
export const getUnstakingPreConfirmation = (request) => ({
  type: UNSTAKPRECONFIRMATION,
  request: request
})

// Redux action to unstaking pre confirmation success
export const getUnstakingPreConfirmationSuccess = (response) => ({
  type: UNSTAKPRECONFIRMATION_SUCCESS,
  payload: response
})

// Redux action to unstaking pre confirmation failure
export const getUnstakingPreConfirmationFailure = (error) => ({
  type: UNSTAKPRECONFIRMATION_FAILURE,
  payload: error
})