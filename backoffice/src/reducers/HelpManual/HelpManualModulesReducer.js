/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Help manual data Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_HELPMANUAL_MODULES,
    GET_HELPMANUAL_MODULES_SUCCESS,
    GET_HELPMANUAL_MODULES_FAILURE,
    ADD_HELPMANUAL_MODULES,
    ADD_HELPMANUAL_MODULES_SUCCESS,
    ADD_HELPMANUAL_MODULES_FAILURE,
    UPDATE_HELPMANUAL_MODULES,
    UPDATE_HELPMANUAL_MODULES_SUCCESS,
    UPDATE_HELPMANUAL_MODULES_FAILURE,
    DELETE_HELPMANUAL_MODULES,
    DELETE_HELPMANUAL_MODULES_SUCCESS,
    DELETE_HELPMANUAL_MODULES_FAILURE,
    GET_HELPMANUAL_MODULES_BY_ID,
    GET_HELPMANUAL_MODULES_BY_ID_SUCCESS,
    GET_HELPMANUAL_MODULES_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    help_module_list:[],
    helpmoduledetail:{},
    data:[],
    loading: false,
    errors:{},
    localebit:1,
    deleteevent:0
};

export default (state = INIT_STATE, action) => {
    // console.log("helpmanualreducer",action);
    switch (action.type) {
        // get Help Manual
        case GET_HELPMANUAL_MODULES:
            return { ...state,loading:true,data:[],localebit:0,deleteevent:0};

        // get Help Manual success
        case GET_HELPMANUAL_MODULES_SUCCESS:
            return { ...state, loading: false,data:[],help_module_list:action.payload,localebit:0};

        // get Help Manual failure
        case GET_HELPMANUAL_MODULES_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

         // add new Help Manual
        case ADD_HELPMANUAL_MODULES:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};
     
        case ADD_HELPMANUAL_MODULES_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.addhelpmodule_success" />);
            return { ...state, loading: false,data:action.payload, localebit:0};

        case ADD_HELPMANUAL_MODULES_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload, localebit:0};

        // Update Help Manual
        case UPDATE_HELPMANUAL_MODULES:
            return { ...state, loading: false,data:[],localebit:0,deleteevent:0};
 
        case UPDATE_HELPMANUAL_MODULES_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.edithelpmodule_success" />);
            return { ...state, loading: false,data: action.payload,localebit:0};

        case UPDATE_HELPMANUAL_MODULES_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data: action.payload,localebit:0};

        // delete Help Manual
        case DELETE_HELPMANUAL_MODULES:
            return {...state, loading: true,data:[],localebit:0,deleteevent:0};

        case DELETE_HELPMANUAL_MODULES_SUCCESS:
            NotificationManager.success(<IntlMessages id="helpmanualform.deletehelpmodule_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0,deleteevent:1};

        case DELETE_HELPMANUAL_MODULES_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        //For Get Help Manual By Id
        case GET_HELPMANUAL_MODULES_BY_ID:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};

        case GET_HELPMANUAL_MODULES_BY_ID_SUCCESS:
            return { ...state, loading: false, data:[], helpmoduledetail: action.payload,localebit:0};

        case GET_HELPMANUAL_MODULES_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        default: return { ...state };
    }
}
