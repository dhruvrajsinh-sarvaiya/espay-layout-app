/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 11-10-2018
    UpdatedDate : 11-10-2018
    Description : Function for Get SiteSetting Data Action
*/
import {
    GET_SITESETTINGINFO,
    GET_SITESETTINGINFO_SUCCESS,
    GET_SITESETTINGINFO_FAILURE,
    POST_SITESETTINGINFO,
    POST_SITESETTINGINFO_SUCCESS,
    POST_SITESETTINGINFO_FAILURE,
} from "../types";

//Function for Get Sitesetting Data Action
export const getSiteSettingInfo = (siteid) => ({
    type: GET_SITESETTINGINFO,
    payload: siteid
});

//Function for Get Sitesetting Data Action success
export const getSiteSettingInfoSuccess = (response) => ({
    type: GET_SITESETTINGINFO_SUCCESS,
    payload: response
});
//Function for Get Sitesetting Data Action failure
export const getSiteSettingInfoFailure = (error) => ({
    type: GET_SITESETTINGINFO_FAILURE,
    payload: error
});

//Function for Post Sitesetting Data Action
export const postSiteSettingInfo = (data) => ({
    type: POST_SITESETTINGINFO,
    payload: data
});
//Function for Post Sitesetting Data Action Success
export const postSiteSettingInfoSuccess = (response) => ({
    type: POST_SITESETTINGINFO_SUCCESS,
    payload: response
});
//Function for Post Sitesetting Data Action Failure
export const postSiteSettingInfoFailure = (error) => ({
    type: POST_SITESETTINGINFO_FAILURE,
    payload: error
});