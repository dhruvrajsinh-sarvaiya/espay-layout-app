/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-12-2018
    UpdatedDate : 29-12-2018
    Description : EmailTemplates Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_EMAILTEMPLATES,
    GET_EMAILTEMPLATES_SUCCESS,
    GET_EMAILTEMPLATES_FAILURE,
    GET_LISTTEMPLATES,
    GET_LISTTEMPLATES_SUCCESS,
    GET_LISTTEMPLATES_FAILURE,
    ADD_NEW_EMAILTEMPLATE,
    ADD_NEW_EMAILTEMPLATE_SUCCESS,
    ADD_NEW_EMAILTEMPLATE_FAILURE,
    UPDATE_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE_SUCCESS,
    UPDATE_EMAILTEMPLATE_FAILURE,
    GET_EMAILTEMPLATE_BY_ID,
    GET_EMAILTEMPLATE_BY_ID_SUCCESS,
    GET_EMAILTEMPLATE_BY_ID_FAILURE,
    UPDATE_TEMPLATE_STATUS,
    UPDATE_TEMPLATE_STATUS_SUCCESS,
    UPDATE_TEMPLATE_STATUS_FAILURE,
    GET_EMAILTEMPLATES_BY_CATEGORY,
    GET_EMAILTEMPLATES_BY_CATEGORY_SUCCESS,
    GET_EMAILTEMPLATES_BY_CATEGORY_FAILURE,
    GET_EMAILTEMPLATES_PARAMETERS,
    GET_EMAILTEMPLATES_PARAMETERS_SUCCESS,
    GET_EMAILTEMPLATES_PARAMETERS_FAILURE,
    UPDATE_EMAILTEMPLATECONFIG,
    UPDATE_EMAILTEMPLATECONFIG_SUCCESS,
    UPDATE_EMAILTEMPLATECONFIG_FAILURE,
    GET_LISTTEMPLATES_BYSERVICETYPE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    templates_list:[],
    parameters_list:[],
    templates_listing:[],
    all_templates_listing:[],
    loading: false,
    data:[],
    templatedetail:{},
    category_templates:{},
    updatestatus:'',
    errors:{},
    statusResponse:{}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    
    switch (action.type) {
        // get Email Templates List
        case GET_EMAILTEMPLATES:
            return { ...state,loading:true,data:[],templates_list:[],statusResponse:{}, errors:{}};

        // get Email Templates List success
        case GET_EMAILTEMPLATES_SUCCESS:
            return { ...state, loading: false,data:[],templates_list:action.payload,statusResponse:{}, errors:{}};

        // get Email Templates List failure
        case GET_EMAILTEMPLATES_FAILURE:
            return {...state, loading: false,data:action.payload,templates_list:[]};

         // get Email Templates Parameters List
         case GET_EMAILTEMPLATES_PARAMETERS:
            return { ...state,loading:true,data:[],parameters_list:[]};

        // get Email Templates Parameters success
        case GET_EMAILTEMPLATES_PARAMETERS_SUCCESS:
            return { ...state, loading: false,data:[],parameters_list:action.payload};

        // get Email Templates Parameters failure
        case GET_EMAILTEMPLATES_PARAMETERS_FAILURE:
            return {...state, loading: false,data:action.payload,parameters_list:[]};

         // get Email List Templates List
         case GET_LISTTEMPLATES:
            return { ...state,loading:true,data:[],statusResponse:{},};

         // get Email List Templates List success
         case GET_LISTTEMPLATES_SUCCESS:
            return { ...state, loading: false,data:[],all_templates_listing:action.payload,templates_listing:[],statusResponse:{}};

         // get Email List Templates List failure
         case GET_LISTTEMPLATES_FAILURE:
            return {...state, loading: false,data:action.payload};

         // add new Email Template
         case ADD_NEW_EMAILTEMPLATE:
            return { ...state, loading: true,data:[],templates_list:[]};
     
        case ADD_NEW_EMAILTEMPLATE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false,data:action.payload,templates_list:[]};

        case ADD_NEW_EMAILTEMPLATE_FAILURE:
            return {...state, loading: false, data:action.payload,templates_list:[]};

        // Update Email Template Data
        case UPDATE_EMAILTEMPLATE:
            return { ...state, loading: true,data:[],updatestatus:'',templates_list:[]};
 
        case UPDATE_EMAILTEMPLATE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload,updatestatus:action.payload.status,templates_list:[]};

        case UPDATE_EMAILTEMPLATE_FAILURE:
            return {...state, loading: false,data:action.payload,templates_list:[]};

        //For Get Email Template By Id
        case GET_EMAILTEMPLATE_BY_ID:
            return { ...state, loading: true,data:[],templatedetail:{},updatestatus:''};

        case GET_EMAILTEMPLATE_BY_ID_SUCCESS:
            return { ...state, loading: false,data:[],templatedetail: action.payload};

        case GET_EMAILTEMPLATE_BY_ID_FAILURE:
            return { ...state, loading: false,data:[]};

        //For Get Email Template By Category
        case GET_EMAILTEMPLATES_BY_CATEGORY:
            return { ...state, loading: true,data:[],updatestatus:''};

        case GET_EMAILTEMPLATES_BY_CATEGORY_SUCCESS:
            return { ...state, loading: false,data:[],category_templates: action.payload};

        case GET_EMAILTEMPLATES_BY_CATEGORY_FAILURE:
            return { ...state, loading: false,data:[]};

        //Added by Dharaben 
        case UPDATE_TEMPLATE_STATUS:
            return { ...state, Loading: true, data:[], errors:{}, statusResponse:{}};

        case UPDATE_TEMPLATE_STATUS_SUCCESS:
            return { ...state, Loading: false, data:[], errors:{}, statusResponse: action.payload };

        case UPDATE_TEMPLATE_STATUS_FAILURE:
            return { ...state, Loading: false, data:[], errors: action.payload };

        // Update Email Template Config Data
        case UPDATE_EMAILTEMPLATECONFIG:
            return { ...state, loading: true,data:[],updatestatus:'',category_templates:[]};
 
        case UPDATE_EMAILTEMPLATECONFIG_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload,updatestatus:action.payload.status,category_templates:[]};

        case UPDATE_EMAILTEMPLATECONFIG_FAILURE:
            return {...state, loading: false,data:action.payload,category_templates:[]};

        // on search faq
        case GET_LISTTEMPLATES_BYSERVICETYPE:        
            if (action.payload === '') {  
                return { ...state, loading: false ,all_templates_listing:state.all_templates_listing,templates_listing:[]}; 
            } else {                
                //make filtered templatelist array
                var TakeFileredTemplates=[];
                if(typeof state.all_templates_listing.Result != 'undefined')
                {
                    state.all_templates_listing.Result.forEach(cat => {
                        if(cat.ServiceType == action.payload){
                            TakeFileredTemplates.push(cat);
                        }   
                    });
                }
                //to take unique category
                var uniqueTemplateArray = TakeFileredTemplates.filter(function(item, pos){
                    return TakeFileredTemplates.indexOf(item) === pos; 
                });
                return { ...state, all_templates_listing: state.all_templates_listing, loading: false,templates_listing:uniqueTemplateArray }
            }
        default: return { ...state };
    }
}
