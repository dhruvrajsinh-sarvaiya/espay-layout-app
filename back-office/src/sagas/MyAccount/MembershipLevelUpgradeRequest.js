import { all, fork, put, takeEvery } from "redux-saga/effects";
import {
  LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST,
  GET_REQUEST_STATUS_APPROVED,
  GET_REQUEST_STATUS_DISAPPROVED,
  GET_REQUEST_STATUS_INREVIEW
} from "Actions/types";

// import functions from action
import {
  listMembershipLevelUpgradeRequestSuccess,
  listMembershipLevelUpgradeRequestFailure,
  getrequestStatusApprovedSuccess,
  getrequestStatusApprovedFailure,
  getrequestStatusDisapprovedSuccess,
  getrequestStatusDisapprovedFailure,
  getrequestStatusInReviewSuccess,
  getrequestStatusInReviewFailure
} from "Actions/MyAccount";

const listMembershipLevelRequestData = [
  {
    id: 1,
    name: "Kevin Ladani",
    email: "kevin@jbspl.com",
    exchange: "OHO Cash",
    currentLevel: "Standard",
    upgradeTo: "Premium",
    requestDate: "2018-06-26",
    requestStatus: "In Review"
  },
  {
    id: 2,
    name: "Sanjay Rathod",
    email: "sanjay@jbspl.com",
    exchange: "PARO Exchange",
    currentLevel: "Standard",
    upgradeTo: "Premium",
    requestDate: "2018-10-29",
    requestStatus: "Disapproved"
  },
  {
    id: 3,
    name: "Parth Jani",
    email: "parth@jbspl.com",
    exchange: "UNIQ Exchange",
    currentLevel: "Standard",
    upgradeTo: "Premium",
    requestDate: "2018-08-05",
    requestStatus: "In Review"
  }
];

//MembershipLevelUpgradeRequest
function* listMembershipLevelUpgradeRequestData() {
  try {
    yield put(
      listMembershipLevelUpgradeRequestSuccess(listMembershipLevelRequestData)
    );
  } catch (error) {
    yield put(listMembershipLevelUpgradeRequestFailure(error));
  }
}

//upgradeStatusApprovedData
function* upgradeStatusApprovedData({ payload }) {
  const upgradeStatusApproved = payload;
  try {
    yield put(getrequestStatusApprovedSuccess(upgradeStatusApproved));
  } catch (error) {
    yield put(getrequestStatusApprovedFailure(error));
  }
}

//upgradeStatus DisApprovedData
function* upgradeStatusDisApprovedData({ payload }) {
  const upgradeStatusDisApproved = payload;
  try {
    yield put(getrequestStatusDisapprovedSuccess(upgradeStatusDisApproved));
  } catch (error) {
    yield put(getrequestStatusDisapprovedFailure(error));
  }
}

//upgradeStatus InReviewData
function* upgradeStatusInReviewData({ payload }) {
  const upgradeStatusInReview = payload;
  try {
    yield put(getrequestStatusInReviewSuccess(upgradeStatusInReview));
  } catch (error) {
    yield put(getrequestStatusInReviewFailure(error));
  }
}

//MembershipLevelUpgradeRequest
function* listMembershipLevelUpgradeRequest() {
  yield takeEvery(
    LIST_MEMBERSHIP_LEVEL_UPGRADE_REQUEST,
    listMembershipLevelUpgradeRequestData
  );
}

//UpgradeRequest Approved
function* getrequestStatusApproved() {
  yield takeEvery(GET_REQUEST_STATUS_APPROVED, upgradeStatusApprovedData);
}

//UpgradeRequest DisApproved
function* getrequestStatusDisapproved() {
  yield takeEvery(GET_REQUEST_STATUS_DISAPPROVED, upgradeStatusDisApprovedData);
}

//UpgradeRequest InReview
function* getrequestStatusInReview() {
  yield takeEvery(GET_REQUEST_STATUS_INREVIEW, upgradeStatusInReviewData);
}

export default function* rootSaga() {
  yield all([
    fork(listMembershipLevelUpgradeRequest),
    fork(getrequestStatusApproved),
    fork(getrequestStatusDisapproved),
    fork(getrequestStatusInReview)
  ]);
}
