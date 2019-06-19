/* 
    Developer : Kevin Ladani
    Date : 28-09-2018
    FIle Comment : Profiles action method's saga implementation
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import api from 'Api';
import api from "Api";

// import types for Profiles
import {
  PROFILES,
  CREATE_PROFILES,
  USERS_PROFILE,
  UPDATE_PROFILES,
  UPDATE_PROFILES_PERMISSIONS,
  DELETE_PROFILES
} from "Actions/types";

// import functions from action
import {
  displayProfilesSuccess,
  displayProfilesFailure,
  createProfileSuccess,
  createProfileFailure,
  displayUsersProfileSuccess,
  displayUsersProfileFailure,
  updateProfileSuccess,
  updateProfileFailure,
  updateProfilePermissionsSuccess,
  updateProfilePermissionsFailure,
  deleteProfileSuccess,
  deleteProfileFailure
} from "Actions/MyAccount";

const ProfilesData = [
  {
    id: 1,
    profilename: "Administrator",
    description: "This Profile will have all the Permissions",
    exchange: "OHO Cash",
    createdat: "July 9, 2018 at 12:32PM",
    modifiedat: "August 9, 2018 at 12:32PM"
  },
  {
    id: 2,
    profilename: "Partner",
    description: "This Profile will not have administrative the Permissions",
    exchange: "UNIQ Exchange",
    createdat: "July 9, 2018 at 12:32PM",
    modifiedat: "August 9, 2018 at 12:32PM"
  },
  {
    id: 3,
    profilename: "Administrator",
    description: "This Profile will have all the Permissions",
    exchange: "PARO Exchange",
    createdat: "July 9, 2018 at 12:32PM",
    modifiedat: "August 9, 2018 at 12:32PM"
  },
  {
    id: 4,
    profilename: "Partner",
    description: "This Profile will not have administrative the Permissions",
    exchange: "UNIQ Exchange",
    createdat: "July 9, 2018 at 12:32PM",
    modifiedat: "August 9, 2018 at 12:32PM"
  },
  {
    id: 5,
    profilename: "Partner",
    description: "This Profile will have all the Permissions",
    exchange: "OHO Cash",
    createdat: "July 9, 2018 at 12:32PM",
    modifiedat: "August 9, 2018 at 12:32PM"
  }
];

const UsersProfileData = [
  {
    id: 1,
    name: "Sanjay Rathod",
    email: "sanjay@gmail.com",
    role: "Exchange Partner",
    status: "InActive"
  },
  {
    id: 2,
    name: "Kevin Ladani",
    email: "kevin@yahoo.co.in",
    role: "Exchange Partner",
    status: "Active"
  },
  {
    id: 3,
    name: "Parth Jani",
    email: "parth@gmail.com",
    role: "Exchange Partner",
    status: "InActive"
  },
  {
    id: 4,
    name: "Raj Kangad",
    email: "raj@jbspl.com",
    role: "Exchange Partner",
    status: "Active"
  },
  {
    id: 5,
    name: "Jayesh Kamani",
    email: "jayesh@jbspl.com",
    role: "Exchange Partner",
    status: "InActive"
  }
];

//

// Used for call function for get Profiles
function* getProfilesData() {
  try {
    if (ProfilesData !== "") yield put(displayProfilesSuccess(ProfilesData));
    else yield put(displayUsersProfileFailure("No data found"));
  } catch (error) {
    yield put(displayUsersProfileFailure(error));
  }
}

// Used for call function for get Profiles
function* getUsersProfilesData() {
  try {
    if (UsersProfileData !== "")
      yield put(displayUsersProfileSuccess(UsersProfileData));
    else yield put(displayProfilesFailure("No data found"));
  } catch (error) {
    yield put(displayProfilesFailure(error));
  }
}

// Used for call function for Create Profile
function* createProfilesData({ payload }) {
  const response = payload;
  try {
    if (response) yield put(createProfileSuccess(response));
    else yield put(createProfileFailure("No data found"));
  } catch (error) {
    yield put(createProfileFailure(error));
  }
}

// Used for call function for Create Profile
function* deleteProfilesData({ payload }) {
  const response = payload;
  try {
    if (response) yield put(deleteProfileSuccess(response));
    else yield put(deleteProfileFailure("No data found"));
  } catch (error) {
    yield put(deleteProfileFailure(error));
  }
}

// Used for call function for Update Profile
function* updateProfilesData({ payload }) {
  const response = payload;
  try {
    if (response) yield put(updateProfileSuccess(response));
    else yield put(updateProfileFailure("No data found"));
  } catch (error) {
    yield put(updateProfileFailure(error));
  }
}

// Used for call function for Update Profile
function* updateProfilePermissions({ payload }) {
  const response = payload;
  try {
    if (response) yield put(updateProfilePermissionsSuccess(response));
    else yield put(updateProfilePermissionsFailure("No data found"));
  } catch (error) {
    yield put(updateProfilePermissionsFailure(error));
  }
}

// dispatch action for get Profiles
function* getProfiles() {
  yield takeEvery(PROFILES, getProfilesData);
}

// dispatch action for create Profile
function* createProfile() {
  yield takeEvery(CREATE_PROFILES, createProfilesData);
}

// dispatch action for display User
function* displayUsersProfile() {
  yield takeEvery(USERS_PROFILE, getUsersProfilesData);
}

// dispatch action for Update Profile
function* updateProfile() {
  yield takeEvery(UPDATE_PROFILES, updateProfilesData);
}

// dispatch action for Update Profile
function* deleteProfile() {
  yield takeEvery(DELETE_PROFILES, deleteProfilesData);
}

// dispatch action for Update Profile Permission
function* updateProfilePermission() {
  yield takeEvery(UPDATE_PROFILES_PERMISSIONS, updateProfilePermissions);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
  yield all([
    fork(getProfiles),
    fork(createProfile),
    fork(displayUsersProfile),
    fork(updateProfile),
    fork(updateProfilePermission),
    fork(deleteProfile)
  ]);
}
