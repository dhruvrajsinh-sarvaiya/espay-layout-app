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
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //1 For MembershipLevelUpgradeRequest
    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST:
      return { ...state, loading: true };

    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        membershipLevelUpgradeRequestList: action.payload
      };

    case LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST_FAILURE:
      return { ...state, loading: false };

    //2 For requestStatusApproved
    case GET_REQUEST_STATUS_APPROVED:
      return { ...state, loading: true };

    case GET_REQUEST_STATUS_APPROVED_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };

    case GET_REQUEST_STATUS_APPROVED_FAILURE:
      return { ...state, loading: false };

    //3 For requestStatusDisapproved
    case GET_REQUEST_STATUS_DISAPPROVED:
      return { ...state, loading: true };

    case GET_REQUEST_STATUS_DISAPPROVED_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };

    case GET_REQUEST_STATUS_DISAPPROVED_FAILURE:
      return { ...state, loading: false };

    //4 For requestStatusInReview
    case GET_REQUEST_STATUS_INREVIEW:
      return { ...state, loading: true };

    case GET_REQUEST_STATUS_INREVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };

    case GET_REQUEST_STATUS_INREVIEW_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
