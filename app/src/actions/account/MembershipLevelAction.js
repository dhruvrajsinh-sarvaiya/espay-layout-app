import {
  // Get Memebership Level
  GET_MEMBERSHIP_LEVEL,
  GET_MEMBERSHIP_LEVEL_SUCCESS,
  GET_MEMBERSHIP_LEVEL_FAILURE
} from "../ActionTypes";

// Redux Action to Get Membership Level
export const getMembershipLevel = () => ({
  type: GET_MEMBERSHIP_LEVEL
});
// Redux Action to Get Membership Level Success
export const getMembershipLevelSuccess = (response) => ({
  type: GET_MEMBERSHIP_LEVEL_SUCCESS,
  payload: response
});
// Redux Action to Get Membership Level Failure
export const getMembershipLevelFailure = error => ({
  type: GET_MEMBERSHIP_LEVEL_FAILURE,
  payload: error
});

