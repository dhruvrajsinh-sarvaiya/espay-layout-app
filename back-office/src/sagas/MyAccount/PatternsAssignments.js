import { all, fork, put, takeEvery } from "redux-saga/effects";

import {
  DISPALY_PATTERNS_ASSIGNMENTS,
  DELETE_PATTERNS_ASSIGNMENTS,
  ADD_PATTERNS_ASSIGNMENTS,
  EDIT_PATTERNS_ASSIGNMENTS
} from "Actions/types";

// import functions from action
import {
  displayPatternsAssignmentsSuccess,
  displayPatternsAssignmentsFailure,
  deletePatternsAssignmentsSuccess,
  deletePatternsAssignmentsFailure,
  addPatternsAssignmentsSuccess,
  addPatternsAssignmentsFailure,
  editPatternsAssignmentsSuccess,
  editPatternsAssignmentsFailure
} from "Actions/MyAccount";

const PatternsAssignmentsData = [
  { id: 1, exchange: "OHO Cash", membership: "Basic", feeslimits: "Basic", referalpattern: "Basic", remark: "Beacon Systems Test Data", assignedby: "Indar Tiwari on July 9, 2018 at 03:12 PM", modifiedby: "Indar Tiwari on July 9, 2018 at 03:12 PM" },
  { id: 2, exchange: "PARO Exchange", membership: "Premium", feeslimits: "Basic", referalpattern: "Basic", remark: "Beacon Systems Test Data", assignedby: "Indar Tiwari on July 9, 2018 at 03:12 PM", modifiedby: "Jayesh Tiwari on July 9, 2018 at 03:12 PM" },
  { id: 3, exchange: "OHO Cash", membership: "Standard", feeslimits: "Basic", referalpattern: "Basic", remark: "Beacon Systems Test Data", assignedby: "Indar Tiwari on July 9, 2018 at 03:12 PM", modifiedby: "Mahesh Tiwari on July 9, 2018 at 03:12 PM" }
]

//Display Patterns Assignments
function* displayPatternsAssignmentsData() {
  try {
    yield put(displayPatternsAssignmentsSuccess(PatternsAssignmentsData));
  } catch (error) {
    yield put(displayPatternsAssignmentsFailure(error));
  }
}

//Delete Patterns Assignments
function* deletePatternsAssignmentsData({ payload }) {
  try {
    yield put(deletePatternsAssignmentsSuccess(PatternsAssignmentsData));
  } catch (error) {
    yield put(deletePatternsAssignmentsFailure(error));
  }
}

//Add Patterns Assignments
function* addPatternsAssignmentsData({ payload }) {
  try {
    yield put(addPatternsAssignmentsSuccess(payload));
  } catch (error) {
    yield put(addPatternsAssignmentsFailure(error));
  }
}

//Edit Patterns Assignments
function* editPatternsAssignmentsData({ payload }) {

  try {
    yield put(editPatternsAssignmentsSuccess(payload));
  } catch (error) {
    yield put(editPatternsAssignmentsFailure(error));
  }
}

//Display Patterns Assignments
function* displayPatternsAssignmentsDataReport() {
  yield takeEvery(DISPALY_PATTERNS_ASSIGNMENTS, displayPatternsAssignmentsData);
}

//Delete Patterns Assignments
function* deletePatternsAssignmentsDataReport() {
  yield takeEvery(DELETE_PATTERNS_ASSIGNMENTS, deletePatternsAssignmentsData);
}

//Add Patterns Assignments
function* addPatternsAssignmentsDataReport() {
  yield takeEvery(ADD_PATTERNS_ASSIGNMENTS, addPatternsAssignmentsData);
}

//Add Patterns Assignments
function* editPatternsAssignmentsDataReport() {
  yield takeEvery(EDIT_PATTERNS_ASSIGNMENTS, editPatternsAssignmentsData);
}

export default function* rootSaga() {
  yield all([
    fork(displayPatternsAssignmentsDataReport),
    fork(deletePatternsAssignmentsDataReport),
    fork(addPatternsAssignmentsDataReport),
    fork(editPatternsAssignmentsDataReport)
  ]);
}
