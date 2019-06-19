/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Language data Reducer action manager
	Updated by Jayesh Pathak 26-10-2018 for adding language module listing/add/edit
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_LANGUAGE,
    GET_LANGUAGE_SUCCESS,
    GET_LANGUAGE_FAILURE,
	GET_ALL_LANGUAGE,
	GET_ALL_LANGUAGE_SUCCESS,
	GET_ALL_LANGUAGE_FAILURE,
	ADD_NEW_LANGUAGE,
	ADD_NEW_LANGUAGE_SUCCESS,
	ADD_NEW_LANGUAGE_FAILURE,
	UPDATE_LANGUAGE,
	UPDATE_LANGUAGE_SUCCESS,
	UPDATE_LANGUAGE_FAILURE,
	GET_LANGUAGE_BY_ID,
	GET_LANGUAGE_BY_ID_SUCCESS,
    GET_LANGUAGE_BY_ID_FAILURE,
    GET_LANGUAGE_CONFIG,
    GET_LANGUAGE_CONFIG_SUCCESS,
    GET_LANGUAGE_CONFIG_FAILURE,
    UPDATE_LANGUAGE_CONFIG,
    UPDATE_LANGUAGE_CONFIG_SUCCESS,
    UPDATE_LANGUAGE_CONFIG_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    language:[],
    loading: false,
    localebit:1,
	language_list:[],  // three parameter added by Jayesh 
	data:[],
    addUpdateStatus:[],
    languageconfigdata:[], // For Configuration
};

export default (state = INIT_STATE, action) => {
    // console.log("Language",action);
    switch (action.type) {

        // get Language Data
        case GET_LANGUAGE:
            return { ...state,loading:true,localebit:1};

        // get Language Data success
        case GET_LANGUAGE_SUCCESS:
            return { ...state, loading: false, language:action.payload,localebit:1};

        // get get Language Data failure
        case GET_LANGUAGE_FAILURE:
            return {...state, loading: false,localebit:0};
			
		 // get Language List
        case GET_ALL_LANGUAGE:
            return { ...state,loading:true, addUpdateStatus:[],data:[]};

        // get Language List success
        case GET_ALL_LANGUAGE_SUCCESS:        
	        // console.log('GET_ALL_LANGUAGE_SUCCESS',action.payload);
            return { ...state, loading: false,language_list:action.payload};

        // get Language List failure
        case GET_ALL_LANGUAGE_FAILURE:
           // NotificationManager.error(action.payload)
            return {...state, loading: false};

         // add Language
         case ADD_NEW_LANGUAGE:
            return { ...state, loading: true};
     
        case ADD_NEW_LANGUAGE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, addUpdateStatus:action.payload};

        case ADD_NEW_LANGUAGE_FAILURE:
           // NotificationManager.error(action.payload)
            return {...state, loading: false, data : action.payload };

        // Update Language Data
        case UPDATE_LANGUAGE:
        return { ...state, loading: true, addUpdateStatus:[],data:[]};
 
        case UPDATE_LANGUAGE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, addUpdateStatus: action.payload};

        case UPDATE_LANGUAGE_FAILURE:
           // NotificationManager.error(action.payload)
            return {...state, loading: false, data : action.payload};

		//For Get Language By Id
        case GET_LANGUAGE_BY_ID:
            return { ...state, loading: true, data : action.payload};

        case GET_LANGUAGE_BY_ID_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case GET_LANGUAGE_BY_ID_FAILURE:
            return { ...state, loading: false };

        
        // get Language Config Data
        case GET_LANGUAGE_CONFIG:
            return { ...state,loading:true,localebit:1,data:[],languageconfigdata:[]};

        // get Language Config Data success
        case GET_LANGUAGE_CONFIG_SUCCESS:
            return { ...state, loading: false, languageconfigdata:action.payload,localebit:1};

        // get get Language Config Data failure
        case GET_LANGUAGE_CONFIG_FAILURE:
            return {...state, loading: false,localebit:0};

        // Update Language Data
        case UPDATE_LANGUAGE_CONFIG:
        return { ...state, loading: true, data:[]};
 
        case UPDATE_LANGUAGE_CONFIG_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload};

        case UPDATE_LANGUAGE_CONFIG_FAILURE:
           // NotificationManager.error(action.payload)
            return {...state, loading: false, data : action.payload};

        default: return { ...state };
    }
}