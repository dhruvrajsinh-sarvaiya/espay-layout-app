/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : handle State for Survey Action
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";

import {
    GET_SURVEY,
    GET_SURVEY_SUCCESS,
    GET_SURVEY_FAILURE,
    ADD_SURVEYRESULT,
    ADD_SURVEYRESULT_SUCCESS,
    ADD_SURVEYRESULT_FAILURE,
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    surveydata: {},
    data: [],
    loading: false,
    surveyresultsdetail: [],
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        // get Survey
        case GET_SURVEY:
            return { ...state, loading: true, surveydata: {}, data: [] };

        // get Survey success
        case GET_SURVEY_SUCCESS:
            return { ...state, loading: false, surveydata: action.payload };

        // get Survey failure
        case GET_SURVEY_FAILURE:
            return { ...state, loading: false, surveydata: {}, data: action.payload };

        // add Survey Result
        case ADD_SURVEYRESULT:
            return { ...state, loading: true, data: [] };

        // add Survey Result Success
        case ADD_SURVEYRESULT_SUCCESS:
            NotificationManager.success(<IntlMessages id="survey.submit.success" />);
            return { ...state, loading: false, data: action.payload };

        // add Survey Result Failure
        case ADD_SURVEYRESULT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //For Get Survey Results By Id
        case GET_SURVEY_RESULTS_BY_ID:
            return { ...state, loading: true, data: [], surveydata: {}, updatestatus: '', surveyresultsdetail: [] };

        case GET_SURVEY_RESULTS_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], surveyresultsdetail: action.payload };

        case GET_SURVEY_RESULTS_BY_ID_FAILURE:
            return { ...state, loading: false, data: action.payload, surveyresultsdetail: [] };

        default: return { ...state };
    }
}
