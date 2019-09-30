import {
    // Reinvite User
    REINVITE_USER,
    REINVITE_USER_SUCCESS,
    REINVITE_USER_FAILURE,

    // unlock User
    UNLOCK_USER,
    UNLOCK_USER_SUCCESS,
    UNLOCK_USER_FAILURE,

    // disable two fa User
    TWO_FA_DISABLE,
    TWO_FA_DISABLE_SUCCESS,
    TWO_FA_DISABLE_FAILURE,

    //clear data
    CLEAR_USER_LIST_DATA
} from "../ActionTypes";

//Redux action get reinvite user
export const reinviteUserApi = (request) => ({
    type: REINVITE_USER,
    payload: request
});
//Redux action get reinvite user Success
export const reinviteUserApiSuccess = (response) => ({
    type: REINVITE_USER_SUCCESS,
    payload: response
});
//Redux action get reinvite user Failure
export const reinviteUserApiFailure = (error) => ({
    type: REINVITE_USER_FAILURE,
    payload: error
});

//Redux action get unlock user
export const unlockUserApi = (request) => ({
    type: UNLOCK_USER,
    payload: request
});
//Redux action get unlock user Success
export const unlockUserApiSuccess = (response) => ({
    type: UNLOCK_USER_SUCCESS,
    payload: response
});
//Redux action get unlock user Failure
export const unlockUserApiFailure = (error) => ({
    type: UNLOCK_USER_FAILURE,
    payload: error
});

//Redux action get disable twofa user
export const disableTwoFaApi = (request) => ({
    type: TWO_FA_DISABLE,
    payload: request
});
//Redux action get disable twofa user Success
export const disableTwoFaApiSuccess = (response) => ({
    type: TWO_FA_DISABLE_SUCCESS,
    payload: response
});
//Redux action get disable twofa user Failure
export const disableTwoFaApiFailure = (error) => ({
    type: TWO_FA_DISABLE_FAILURE,
    payload: error
});

//Redux action for clear response
export const clearUserListData = () => ({
    type: CLEAR_USER_LIST_DATA,
});

