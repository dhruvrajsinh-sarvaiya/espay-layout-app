/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 01-10-2018
    UpdatedDate : 01-10-2018
    Description : Faq Question data Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_FAQ_QUESTIONS,
    GET_FAQ_QUESTIONS_SUCCESS,
    GET_FAQ_QUESTIONS_FAILURE,
    ADD_FAQ_QUESTION,
    ADD_FAQ_QUESTION_SUCCESS,
    ADD_FAQ_QUESTION_FAILURE,
    UPDATE_FAQ_QUESTION,
    UPDATE_FAQ_QUESTION_SUCCESS,
    UPDATE_FAQ_QUESTION_FAILURE,
    DELETE_FAQ_QUESTION,
    DELETE_FAQ_QUESTION_SUCCESS,
    DELETE_FAQ_QUESTION_FAILURE,
    GET_FAQ_QUESTION_BY_ID,
    GET_FAQ_QUESTION_BY_ID_SUCCESS,
    GET_FAQ_QUESTION_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    faqs_questions_list:[],
    loading: false,
    questiondetail:{},
    data:[],
    errors:{},
    localebit:1,
    deleteevent:0
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        // get Faq Question
        case GET_FAQ_QUESTIONS:
            return { ...state,loading:true,data:[],localebit:0,deleteevent:0};

        // get Faq Question success
        case GET_FAQ_QUESTIONS_SUCCESS:
            return { ...state, loading: false,data:[],faqs_questions_list:action.payload,localebit:0};

        // get Faq Question failure
        case GET_FAQ_QUESTIONS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

         // add new Faq Question
         case ADD_FAQ_QUESTION:
            return { ...state, loading: false,data:[],localebit:0,deleteevent:0};
     
        case ADD_FAQ_QUESTION_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.questionform.addquestion_success" />);
            return { ...state, loading: false,data:action.payload, localebit:0};

        case ADD_FAQ_QUESTION_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload, localebit:0};

        // Update Faq Question
        case UPDATE_FAQ_QUESTION:
            return { ...state, loading: false,data:[],localebit:0,deleteevent:0};
 
        case UPDATE_FAQ_QUESTION_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.questionform.editquestion_success" />);
            return { ...state, loading: false,data: action.payload,localebit:0};

        case UPDATE_FAQ_QUESTION_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data: action.payload,localebit:0};

        // delete Faq Question
        case DELETE_FAQ_QUESTION:
            return {...state, loading: true,data:[],localebit:0,deleteevent:0};

        case DELETE_FAQ_QUESTION_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.questionform.deletequestion_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0,deleteevent:1};

        case DELETE_FAQ_QUESTION_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        //For Get Faq QUESTION By Id
        case GET_FAQ_QUESTION_BY_ID:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};

        case GET_FAQ_QUESTION_BY_ID_SUCCESS:
            return { ...state, loading: false, data:[], questiondetail: action.payload,localebit:0};

        case GET_FAQ_QUESTION_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        default: return { ...state };
    }
}
