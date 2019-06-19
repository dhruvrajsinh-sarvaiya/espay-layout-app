/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-11-2018
    UpdatedDate : 27-11-2018
    Description : CMS Dashboard Reducer action manager
    Added seprate APIs by dhara gajera 17/1/2019
*/
import React from 'react';
// action types
import {
    //Added by dhara gajera  17/1/2019
    GET_DASHBOARD_PAGE_COUNT,
    GET_DASHBOARD_PAGE_COUNT_SUCCESS,
    GET_DASHBOARD_PAGE_COUNT_FAILURE,

    GET_DASHBOARD_FAQ_COUNT,
    GET_DASHBOARD_FAQ_COUNT_SUCCESS,
    GET_DASHBOARD_FAQ_COUNT_FAILURE,

    GET_DASHBOARD_NEWS_COUNT,
    GET_DASHBOARD_NEWS_COUNT_SUCCESS,
    GET_DASHBOARD_NEWS_COUNT_FAILURE,

    GET_DASHBOARD_CONTACTUS_COUNT,
    GET_DASHBOARD_CONTACTUS_COUNT_SUCCESS,
    GET_DASHBOARD_CONTACTUS_COUNT_FAILURE,

    GET_DASHBOARD_SURVEYS_COUNT,
    GET_DASHBOARD_SURVEYS_COUNT_SUCCESS,
    GET_DASHBOARD_SURVEYS_COUNT_FAILURE,

    GET_DASHBOARD_REGIONS_COUNT,
    GET_DASHBOARD_REGIONS_COUNT_SUCCESS,
    GET_DASHBOARD_REGIONS_COUNT_FAILURE,

    GET_DASHBOARD_HELPMENUAL_COUNT,
    GET_DASHBOARD_HELPMENUAL_COUNT_SUCCESS,
    GET_DASHBOARD_HELPMENUAL_COUNT_FAILURE,

    GET_DASHBOARD_COINLIST_COUNT,
    GET_DASHBOARD_COINLIST_COUNT_SUCCESS,
    GET_DASHBOARD_COINLIST_COUNT_FAILURE,

    //Addec By Sanjay
    GET_DASHBOARD_HTMLBLOCKS_COUNT,
    GET_DASHBOARD_HTMLBLOCKS_COUNT_SUCCESS,
    GET_DASHBOARD_HTMLBLOCKS_COUNT_FAILURE,

    GET_DASHBOARD_IMAGESLIDERS_COUNT,
    GET_DASHBOARD_IMAGESLIDERS_COUNT_SUCCESS,
    GET_DASHBOARD_IMAGESLIDERS_COUNT_FAILURE,

    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT,
    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_SUCCESS,
    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_FAILURE

} from 'Actions/types';

// initial state
const INIT_STATE = {
    data: [],
    loading: false,
    errors: {},
    pagesCount: {},
    faqCount: {},
    newsCount: {},
    contactusCount: {},
    surveysCount: {},
    regionsCount: {},
    helpMenual: {},
    coinList: {},
    htmlBlocksCount: {},
    advancehtmlBlocksCount: {},
    imageSlidersCount: {}
};

export default (state = INIT_STATE, action) => {
    // console.log("CMSDashboard",action);
    switch (action.type) {

        //Get CMS Dashboard pages and policymanegement count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_PAGE_COUNT:
            return { ...state, loading: true, data: [], pagesCount: {} };

        // Get CMS Dashboard pages and policymanegement count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_PAGE_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], pagesCount: action.payload };

        //Get CMS Dashboard pages and policymanegement count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_PAGE_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard faq categories and question count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_FAQ_COUNT:
            return { ...state, loading: true, data: [], faqCount: {} };

        // Get CMS Dashboard faq categories and question count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_FAQ_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], faqCount: action.payload };

        //Get CMS Dashboard faq categories and question count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_FAQ_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard news count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_NEWS_COUNT:
            return { ...state, loading: true, data: [], newsCount: {} };

        // Get CMS Dashboard news count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_NEWS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], newsCount: action.payload };

        //Get CMS Dashboard news count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_NEWS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard contactus count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_CONTACTUS_COUNT:
            return { ...state, loading: true, data: [], contactusCount: {} };

        // Get CMS Dashboard contactus count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_CONTACTUS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], contactusCount: action.payload };

        //Get CMS Dashboard contactus count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_CONTACTUS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard surveys count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_SURVEYS_COUNT:
            return { ...state, loading: true, data: [], surveysCount: {} };

        // Get CMS Dashboard surveys count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_SURVEYS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], surveysCount: action.payload };

        //Get CMS Dashboard surveys count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_SURVEYS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard region count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_REGIONS_COUNT:
            return { ...state, loading: true, data: [], regionsCount: {} };

        // Get CMS Dashboard region count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_REGIONS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], regionsCount: action.payload };

        //Get CMS Dashboard region count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_REGIONS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard help menual count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_HELPMENUAL_COUNT:
            return { ...state, loading: true, data: [], helpMenual: {} };

        // Get CMS Dashboard help menual count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_HELPMENUAL_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], helpMenual: action.payload };

        //Get CMS Dashboard help menual count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_HELPMENUAL_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get CMS Dashboard coin list count,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_COINLIST_COUNT:
            return { ...state, loading: true, data: [], coinList: {} };

        // Get CMS Dashboard coin list count success,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_COINLIST_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], coinList: action.payload };

        //Get CMS Dashboard coin list count failure,Added by dhara gajera 17/1/2019
        case GET_DASHBOARD_COINLIST_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Added By Sanjay ON 27-05-2019 For Get Count Of HTML Blocks
        case GET_DASHBOARD_HTMLBLOCKS_COUNT:
            return { ...state, loading: true, data: [] };

        case GET_DASHBOARD_HTMLBLOCKS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], htmlBlocksCount: action.payload };

        case GET_DASHBOARD_HTMLBLOCKS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Added By Sanjay ON 29-05-2019 For Get Count Of Image Sliders
        case GET_DASHBOARD_IMAGESLIDERS_COUNT:
            return { ...state, loading: true, data: [] };

        case GET_DASHBOARD_IMAGESLIDERS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], imageSlidersCount: action.payload };

        case GET_DASHBOARD_IMAGESLIDERS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Added By Sanjay ON 04-06-2019 For Get Count Of Advance HTML Blocks
        case GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT:
            return { ...state, loading: true, data: [] };

        case GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_SUCCESS:
            return { ...state, loading: false, data: [], advancehtmlBlocksCount: action.payload };

        case GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default: return { ...state };
    }
}