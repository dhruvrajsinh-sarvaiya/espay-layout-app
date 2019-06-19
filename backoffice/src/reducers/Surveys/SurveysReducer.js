/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 03-10-2018
    UpdatedDate : 31-10-2018
    Description : Surveys Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_SURVEYS,
    GET_SURVEYS_SUCCESS,
    GET_SURVEYS_FAILURE,
    ADD_NEW_SURVEY,
    ADD_NEW_SURVEY_SUCCESS,
    ADD_NEW_SURVEY_FAILURE,
    UPDATE_SURVEY,
    UPDATE_SURVEY_SUCCESS,
    UPDATE_SURVEY_FAILURE,
    DELETE_SURVEY,
    GET_SURVEY_BY_ID,
    GET_SURVEY_BY_ID_SUCCESS,
    GET_SURVEY_BY_ID_FAILURE,
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    surveys_list:[],
    loading: false,
    data:[],
    surveydetail:{},
    surveyresultsdetail:[],
    updatestatus:'',
    errors:{},
    localebit:1,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // get Surveys List
        case GET_SURVEYS:
            return { ...state,loading:true,data:[],localebit:0};

        // get Surveys List success
        case GET_SURVEYS_SUCCESS:
            return { ...state, loading: false,data:[],surveys_list:action.payload,localebit:0};

        // get Surveys List failure
        case GET_SURVEYS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

         // add new Survey
         case ADD_NEW_SURVEY:
            return { ...state, loading: true,data:[],localebit:0};
     
        case ADD_NEW_SURVEY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false,data:action.payload,localebit:0};

        case ADD_NEW_SURVEY_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false, data:action.payload, localebit:0};

        // Update Survey Data
        case UPDATE_SURVEY:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};
 
        case UPDATE_SURVEY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload,updatestatus:action.payload.status,localebit:0};

        case UPDATE_SURVEY_FAILURE:
            NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        //For Get Survey By Id
        case GET_SURVEY_BY_ID:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};

        case GET_SURVEY_BY_ID_SUCCESS:
            return { ...state, loading: false,data:[],surveydetail: action.payload,localebit:0};

        case GET_SURVEY_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        //For Get Survey Results By Id
        case GET_SURVEY_RESULTS_BY_ID:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};

        case GET_SURVEY_RESULTS_BY_ID_SUCCESS:
            return { ...state, loading: false,data:[],surveyresultsdetail: action.payload,localebit:0};

        case GET_SURVEY_RESULTS_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

         // delete Survey
        case DELETE_SURVEY:
            return {...state, loading: false};

        default: return { ...state };
    }
}
