/**
 * MembershipLevelUpgradeRequest Reducer
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
} from "Actions/types";

/**
 * initial MembershipLevelUpgradeRequest
 */
const INIT_STATE = {
  membershipLevelUpgradeRequestList: [],
  loading: false,
  success: ''
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }
  switch (action.type) {
    //1 For MembershipLevelUpgradeRequest
    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST:
    case GET_REQUEST_STATUS_APPROVED:
    case GET_REQUEST_STATUS_DISAPPROVED:
    case GET_REQUEST_STATUS_INREVIEW:
      return { ...state, loading: true };

    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        membershipLevelUpgradeRequestList: action.payload
      };

    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_FAILURE:
    case GET_REQUEST_STATUS_APPROVED_FAILURE:
    case GET_REQUEST_STATUS_DISAPPROVED_FAILURE:
    case GET_REQUEST_STATUS_INREVIEW_FAILURE:
      return { ...state, loading: false };

    //2 For requestStatusApproved
    case GET_REQUEST_STATUS_APPROVED_SUCCESS:
    //3 For requestStatusDisapproved
    case GET_REQUEST_STATUS_DISAPPROVED_SUCCESS:
    //4 For requestStatusInReview
    case GET_REQUEST_STATUS_INREVIEW_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    default:
      return { ...state };
  }
};
