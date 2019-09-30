import {

    // Reinvite USer
    REINVITE_USER,
    REINVITE_USER_SUCCESS,
    REINVITE_USER_FAILURE,

    //get user list
    GET_USERS_LIST,
    GET_USERS_LIST_SUCCESS,
    GET_USERS_LIST_FAILURE,

    //get change user status
    CHANGE_USER_STATUS,
    CHANGE_USER_STATUS_SUCCESS,
    CHANGE_USER_STATUS_FAILURE,

    //get group list
    GET_GROUP_LIST,
    GET_GROUP_LIST_SUCCESS,
    GET_GROUP_LIST_FAILURE,

    //add user data
    ADD_USER_DATA,
    ADD_USER_DATA_SUCCESS,
    ADD_USER_DATA_FAILURE,

    //edit user data
    EDIT_USER_DATA,
    EDIT_USER_DATA_SUCCESS,
    EDIT_USER_DATA_FAILURE,

    // unlock User
    UNLOCK_USER,
    UNLOCK_USER_SUCCESS,
    UNLOCK_USER_FAILURE,

    // disable two fa User
    TWO_FA_DISABLE,
    TWO_FA_DISABLE_SUCCESS,
    TWO_FA_DISABLE_FAILURE,

    //clear data
    ACTION_LOGOUT,

    // Clear reducer data
    CLEAR_USER_LIST_DATA,

    // clear user data
    CLEAR_USER_DATA
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    //Reinvite USer
    reinviteData: null,
    reinviteDataFetching: false,

    // for users list
    UsersListData: null,
    UsersListLoading: false,
    UsersListError: false,

    // for changing user status
    ChangeUserStatus: null,
    ChangeUserStatusLoading: false,
    ChangeUserStatusError: false,

    // for group list
    GroupListData: null,
    GroupListLoading: false,
    GroupListError: false,

    // for adding user data
    AddUserRespone: null,
    AddUserLoading: false,
    AddUserError: false,

    // for editing user data
    EditUserResponse: null,
    EditUserLoading: false,
    EditUserError: true,

    // for unlock user data
    unlockUserResponse: null,
    unlockUserFetching: false,
    unlockUserError: false,

    // for editing user data
    twoFaDisableResponse: null,
    twoFaDisableFetching: false,
    twoFaDisableError: false,
}

export default function UserListReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_USER_LIST_DATA:
            return INITIAL_STATE

        //reinvite user 
        case REINVITE_USER:
            return { ...state, reinviteDataFetching: true, reinviteData: null };
        //reinvite user success
        case REINVITE_USER_SUCCESS:
            return { ...state, reinviteDataFetching: false, reinviteData: action.payload };
        //reinvite user failure
        case REINVITE_USER_FAILURE:
            return { ...state, reinviteDataFetching: false, reinviteData: action.payload };

        // Handle user list method data
        case GET_USERS_LIST:
            return Object.assign({}, state, {
                UsersListData: null,
                UsersListLoading: true
            })
        // Set user list success data
        case GET_USERS_LIST_SUCCESS:
        // Set user list failure data
        case GET_USERS_LIST_FAILURE:
            return Object.assign({}, state, {
                UsersListData: action.data,
                UsersListLoading: false,
            })

        // Handle change user status method data
        case CHANGE_USER_STATUS:
            return Object.assign({}, state, {
                ChangeUserStatus: null,
                ChangeUserStatusLoading: true
            })
        // Set change user status success data
        case CHANGE_USER_STATUS_SUCCESS:
        // Set change user status failure data
        case CHANGE_USER_STATUS_FAILURE:
            return Object.assign({}, state, {
                ChangeUserStatus: action.data,
                ChangeUserStatusLoading: false,
            })

        // Handle group list method data
        case GET_GROUP_LIST:
            return Object.assign({}, state, {
                GroupListData: null,
                GroupListLoading: true
            })
        // Set group list success data
        case GET_GROUP_LIST_SUCCESS:
        // Set group list failure data
        case GET_GROUP_LIST_FAILURE:
            return Object.assign({}, state, {
                GroupListData: action.data,
                GroupListLoading: false,
            })

        // Handle add user method data
        case ADD_USER_DATA:
            return Object.assign({}, state, {
                AddUserRespone: null,
                AddUserLoading: true
            })
        // Set add user success data
        case ADD_USER_DATA_SUCCESS:
        // Set add user failure data
        case ADD_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                AddUserRespone: action.data,
                AddUserLoading: false,
            })

        // Handle edit user method data
        case EDIT_USER_DATA:
            return Object.assign({}, state, {
                EditUserResponse: null,
                EditUserLoading: true
            })

        // Set edit user success data
        case EDIT_USER_DATA_SUCCESS:
        // Set edit user failure data
        case EDIT_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                EditUserResponse: action.data,
                EditUserLoading: false,
            })

        // Handle unlock user method data
        case UNLOCK_USER:
            return Object.assign({}, state, {
                unlockUserResponse: null,
                unlockUserFetching: true
            })

        // Set unlock user success data
        case UNLOCK_USER_SUCCESS:
        // Set unlock user failure data
        case UNLOCK_USER_FAILURE:
            return Object.assign({}, state, {
                unlockUserResponse: action.payload,
                unlockUserFetching: false,
            })

        // Handle disbale two fa method data
        case TWO_FA_DISABLE:
            return Object.assign({}, state, {
                twoFaDisableResponse: null,
                twoFaDisableFetching: true
            })

        // Set disbale two fa success data
        case TWO_FA_DISABLE_SUCCESS:
        // Set disbale two fa failure data
        case TWO_FA_DISABLE_FAILURE:
            return Object.assign({}, state, {
                twoFaDisableResponse: action.payload,
                twoFaDisableFetching: false,
            })

        // Set clear user data
        case CLEAR_USER_DATA:
            return Object.assign({}, state, {
                EditUserResponse: null,
                AddUserRespone: null
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}