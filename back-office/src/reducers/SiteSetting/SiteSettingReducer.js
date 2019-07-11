/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-10-2018
    UpdatedDate : 11-10-2018
    Description : Site Setting Reducer action manager
*/
import { NotificationManager } from 'react-notifications';
import {
    GET_SITESETTINGINFO,
    GET_SITESETTINGINFO_SUCCESS,
    GET_SITESETTINGINFO_FAILURE,
    POST_SITESETTINGINFO,
    POST_SITESETTINGINFO_SUCCESS,
    POST_SITESETTINGINFO_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    SiteSettingInfo: {},
    SiteSettingInfosuccess:0,
    updatestatus:'',
    errors:{},
    localebit:1,
    data:[]
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {

        case GET_SITESETTINGINFO:
            return { ...state, loading: true,localebit:0,SiteSettingInfosuccess:0,data:[]};

        case GET_SITESETTINGINFO_SUCCESS:
            return {...state,loading: false, SiteSettingInfo: action.payload,localebit:0,SiteSettingInfosuccess:1};

        case GET_SITESETTINGINFO_FAILURE:
            return { ...state, loading: false,data: action.payload,localebit:0,SiteSettingInfosuccess:0};

        case POST_SITESETTINGINFO:
            return { ...state, loading: true,localebit:0,data:[]};
        
        case POST_SITESETTINGINFO_SUCCESS:
            NotificationManager.success('Updated Successfully!');
            return { ...state, loading: false,data: action.payload,SiteSettingInfo:action.payload.data,SiteSettingInfosuccess:1,localebit:0};
        
        case POST_SITESETTINGINFO_FAILURE:
            return { ...state, loading: false,data: action.payload,localebit:0};

        default:
            return { ...state };
    }
};