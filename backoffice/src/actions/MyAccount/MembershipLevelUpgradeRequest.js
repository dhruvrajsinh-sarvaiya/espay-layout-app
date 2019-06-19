/**
 *MembershipLevelUpgradeRequest Actions
 */
import {
  //For MembershipLevelUpgradeRequest
  LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST,
  LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_SUCCESS,
  LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_FAILURE,
  GET_REQUEST_STATUS_APPROVED,
  GET_REQUEST_STATUS_APPROVED_SUCCESS,
  GET_REQUEST_STATUS_APPROVED_FAILURE,
  GET_REQUEST_STATUS_DISAPPROVED,
  GET_REQUEST_STATUS_DISAPPROVED_SUCCESS,
  GET_REQUEST_STATUS_DISAPPROVED_FAILURE,
  GET_REQUEST_STATUS_INREVIEW,
  GET_REQUEST_STATUS_INREVIEW_SUCCESS,
  GET_REQUEST_STATUS_INREVIEW_FAILURE
} from "../types";

//For MembershipLevelUpgradeRequest

/**
 * Redux Action To MembershipLevelUpgradeRequest
 */

export const listMembershipLevelUpgradeRequest = () => ({
  type: LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST
});

/**
 * Redux Action To MembershipLevelUpgradeRequest Success
 */
export const listMembershipLevelUpgradeRequestSuccess = response => ({
  type: LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_SUCCESS,
  payload: response
});

/**
 * Redux Action To MembershipLevelUpgradeRequest Failure
 */
export const listMembershipLevelUpgradeRequestFailure = error => ({
  type: LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_FAILURE,
  payload: error
});

/**
 * Redux Action To requestStatusApproved
 */

export const getrequestStatusApproved = user => ({
  type: GET_REQUEST_STATUS_APPROVED,
  payload: user
});

/**
 * Redux Action To requestStatusApproved Success
 */
export const getrequestStatusApprovedSuccess = response => ({
  type: GET_REQUEST_STATUS_APPROVED_SUCCESS,
  payload: response
});

/**
 * Redux Action To requestStatusApproved Failure
 */
export const getrequestStatusApprovedFailure = error => ({
  type: GET_REQUEST_STATUS_APPROVED_FAILURE,
  payload: error
});

/**
 * Redux Action To requestStatusDisapproved
 */

export const getrequestStatusDisapproved = user => ({
  type: GET_REQUEST_STATUS_DISAPPROVED,
  payload: user
});

/**
 * Redux Action To requestStatusDisapproved Success
 */
export const getrequestStatusDisapprovedSuccess = response => ({
  type: GET_REQUEST_STATUS_DISAPPROVED_SUCCESS,
  payload: response
});

/**
 * Redux Action To requestStatusDisapproved Failure
 */
export const getrequestStatusDisapprovedFailure = error => ({
  type: GET_REQUEST_STATUS_DISAPPROVED_FAILURE,
  payload: error
});

/**
 * Redux Action To requestStatusInReview
 */

export const getrequestStatusInReview = user => ({
  type: GET_REQUEST_STATUS_INREVIEW,
  payload: user
});

/**
 * Redux Action To requestStatusInReview Success
 */
export const getrequestStatusInReviewSuccess = response => ({
  type: GET_REQUEST_STATUS_INREVIEW_SUCCESS,
  payload: response
});

/**
 * Redux Action To requestStatusInReview Failure
 */
export const getrequestStatusInReviewFailure = error => ({
  type: GET_REQUEST_STATUS_INREVIEW_FAILURE,
  payload: error
});
