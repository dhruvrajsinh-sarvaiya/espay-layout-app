/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * API Setting Reducers
 */
import {
    API_SETTING_CREATE, 
    API_SETTING_CREATE_SUCCESS, 
    API_SETTING_CREATE_FAILURE,
    API_SETTING_SAVE, 
    API_SETTING_SAVE_SUCCESS, 
    API_SETTING_SAVE_FAILURE,
    API_SETTING_EDIT, 
    API_SETTING_EDIT_SUCCESS, 
    API_SETTING_EDIT_FAILURE,
    API_SETTING_DELETE, 
    API_SETTING_DELETE_SUCCESS, 
    API_SETTING_DELETE_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    new_api_key : '',
    data : []
}

//Check Action for API Setting...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case API_SETTING_CREATE:
            return { ...state, loading : true };

        case API_SETTING_CREATE_SUCCESS:
            return { ...state, loading : true, new_api_key : action.payload };

        case API_SETTING_CREATE_FAILURE:
            return { ...state, loading : false, error : action.payload };

        case API_SETTING_SAVE:
            return { ...state, loading : true };

        case API_SETTING_SAVE_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case API_SETTING_SAVE_FAILURE:
            return { ...state, loading : false, error : action.payload };

        case API_SETTING_EDIT:
            return { ...state, loading : true };

        case API_SETTING_EDIT_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case API_SETTING_EDIT_FAILURE:
            return { ...state, loading : false, error : action.payload };

        case API_SETTING_DELETE:
            return { ...state, loading : true };

        case API_SETTING_DELETE_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case API_SETTING_DELETE_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}