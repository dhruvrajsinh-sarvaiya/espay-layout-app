/**
 * Auther : Saloni Rathod
 * Created : 26/02/2019
 * User Reducer
 */

//Import action types form type.js
import {
    //Add User
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAILURE,

    //search user
    SEARCH_USER,
    SEARCH_USER_SUCCESS,
    SEARCH_USER_FAILURE,

    //Edit User
    EDIT_USER,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILURE,

    //Change User Status
    CHANGE_USER_STATUS,
    CHANGE_USER_STATUS_SUCCESS,
    CHANGE_USER_STATUS_FAILURE,

    //List User
    LIST_USER,
    LIST_USER_SUCCESS,
    LIST_USER_FAILURE,

    //Get By Id User   
    GET_USER_BY_ID,
    GET_USER_BY_ID_SUCCESS,
    GET_USER_BY_ID_FAILURE,

    //To Reinvite User  
    REINVITE_USER,
    REINVITE_USER_SUCCESS,
    REINVITE_USER_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData: [],
    listLoading: false,
    loading: false,
    getdata: [],
    link: [],
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        //Add User
        case ADD_USER:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_USER_SUCCESS:
            return {
                ...state, loading: false, data: action.payload
            };

        case ADD_USER_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit User
        case EDIT_USER:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_USER_SUCCESS:
            return {
                ...state, loading: false, data: action.payload
            };

        case EDIT_USER_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change  User Status
        case CHANGE_USER_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_USER_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_USER_STATUS_FAILURE:
            return {
                ...state, listLoading: false, chngStsData: action.payload,

            };

        //List  User
        case LIST_USER:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_USER_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_USER_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id  User
        case GET_USER_BY_ID:
            return { ...state, loading: true, getData: '' };

        case GET_USER_BY_ID_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_USER_BY_ID_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //Search User
        case SEARCH_USER:
            return { ...state, loading: true, list: '' };

        case SEARCH_USER_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case SEARCH_USER_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //Search User
        case REINVITE_USER:
            return { ...state, listLoading: true, link: '' };

        case REINVITE_USER_SUCCESS:
            return { ...state, listLoading: false, link: action.payload };

        case REINVITE_USER_FAILURE:
            return { ...state, listLoading: false, link: action.payload };

        default:
            return { ...state };
    }
};