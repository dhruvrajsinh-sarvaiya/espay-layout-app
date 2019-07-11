/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Help Manual data Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_HELPMANUALS,
    GET_HELPMANUALS_SUCCESS,
    GET_HELPMANUALS_FAILURE,
    ADD_HELPMANUAL,
    ADD_HELPMANUAL_SUCCESS,
    ADD_HELPMANUAL_FAILURE,
    UPDATE_HELPMANUAL,
    UPDATE_HELPMANUAL_SUCCESS,
    UPDATE_HELPMANUAL_FAILURE,
    DELETE_HELPMANUAL,
    DELETE_HELPMANUAL_SUCCESS,
    DELETE_HELPMANUAL_FAILURE,
    GET_HELPMANUAL_BY_ID,
    GET_HELPMANUAL_BY_ID_SUCCESS,
    GET_HELPMANUAL_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    help_manual_list:[],
    loading: false,
    helpmanualdetail:{},
    data:[],
    errors:{},
    localebit:1,
    deleteevent:0
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }

    switch (action.type) {
        // get Help Manual
        case GET_HELPMANUALS:
            return { ...state,loading:true,data:[],localebit:0,deleteevent:0};

        // get Help Manual success
        case GET_HELPMANUALS_SUCCESS:
            return { ...state, loading: false,data:[],help_manual_list:action.payload,localebit:0};

        // get Help Manual failure
        case GET_HELPMANUALS_FAILURE:
        case DELETE_HELPMANUAL_FAILURE:
            return {...state, loading: false,data:action.payload,localebit:0};

        // add new Help Manual
        case ADD_HELPMANUAL:
        case UPDATE_HELPMANUAL:
            return { ...state, loading: false,data:[],localebit:0,deleteevent:0};
     
        case ADD_HELPMANUAL_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.addhelpmanual_success" />);
            return { ...state, loading: false,data:action.payload, localebit:0};

        case ADD_HELPMANUAL_FAILURE:
            return {...state, loading: false,data:action.payload, localebit:0};
 
        case UPDATE_HELPMANUAL_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.edithelpmanual_success" />);
            return { ...state, loading: false,data: action.payload,localebit:0};

        case UPDATE_HELPMANUAL_FAILURE:
            return {...state, loading: false,data: action.payload,localebit:0};

        // delete Help Manual
        case DELETE_HELPMANUAL:
            return {...state, loading: true,data:[],localebit:0,deleteevent:0};

        case DELETE_HELPMANUAL_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.deletehelpmanual_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0,deleteevent:1};

        //For Get Help Manual By Id
        case GET_HELPMANUAL_BY_ID:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};

        case GET_HELPMANUAL_BY_ID_SUCCESS:
            return { ...state, loading: false, data:[], helpmanualdetail: action.payload,localebit:0};

        case GET_HELPMANUAL_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        default: return { ...state };
    }
}
