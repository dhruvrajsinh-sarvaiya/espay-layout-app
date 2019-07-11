/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-11-2018
    UpdatedDate : 27-11-2018
    Description : Function for Get CMS Dashboard Data Action
    Added seprate APIs by dhara gajera 17/1/2019
*/
import {
    //Added by dhara gajera 17/1/2019
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

    //Added By Sanjay 
    GET_DASHBOARD_HTMLBLOCKS_COUNT,
    GET_DASHBOARD_HTMLBLOCKS_COUNT_SUCCESS,
    GET_DASHBOARD_HTMLBLOCKS_COUNT_FAILURE,

    GET_DASHBOARD_IMAGESLIDERS_COUNT,
    GET_DASHBOARD_IMAGESLIDERS_COUNT_SUCCESS,
    GET_DASHBOARD_IMAGESLIDERS_COUNT_FAILURE,

    //Action Type For Get Count Of Advance HTML Blocks Added By Sanjay
    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT,
    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_SUCCESS,
    GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_FAILURE

} from 'Actions/types';

/**
 * Function for Get CMS Dashboard pages count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardPagesCount = () => ({
    type: GET_DASHBOARD_PAGE_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard pages count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardPagesCountSuccess = (response) => ({
    type: GET_DASHBOARD_PAGE_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard pages count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardPagesCountFailure = (error) => ({
    type: GET_DASHBOARD_PAGE_COUNT_FAILURE,
    payload: error
});
/**
 * Function for Get CMS Dashboard faq categories and question count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardFaqCount = () => ({
    type: GET_DASHBOARD_FAQ_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard faq categories and question count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardFaqCountSuccess = (response) => ({
    type: GET_DASHBOARD_FAQ_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard faq categories and question count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardFaqCountFailure = (error) => ({
    type: GET_DASHBOARD_FAQ_COUNT_FAILURE,
    payload: error
});
/**
 * Function for Get CMS Dashboard news count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardNewsCount = () => ({
    type: GET_DASHBOARD_NEWS_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard news count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardNewsCountSuccess = (response) => ({
    type: GET_DASHBOARD_NEWS_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard news count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardNewsCountFailure = (error) => ({
    type: GET_DASHBOARD_NEWS_COUNT_FAILURE,
    payload: error
});

/**
 * Function for Get CMS Dashboard contactus count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardContactusCount = () => ({
    type: GET_DASHBOARD_CONTACTUS_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard contactus count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardContactusCountSuccess = (response) => ({
    type: GET_DASHBOARD_CONTACTUS_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard contactus count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardContactusCountFailure = (error) => ({
    type: GET_DASHBOARD_CONTACTUS_COUNT_FAILURE,
    payload: error
});

/**
 * Function for Get CMS Dashboard SURVEYS count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardSurveysCount = () => ({
    type: GET_DASHBOARD_SURVEYS_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard SURVEYS count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardSurveysCountSuccess = (response) => ({
    type: GET_DASHBOARD_SURVEYS_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard SURVEYS count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardSurveysCountFailure = (error) => ({
    type: GET_DASHBOARD_SURVEYS_COUNT_FAILURE,
    payload: error
});
/**
 * Function for Get CMS Dashboard region count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardRegionsCount = () => ({
    type: GET_DASHBOARD_REGIONS_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard region count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardRegionsCountSuccess = (response) => ({
    type: GET_DASHBOARD_REGIONS_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard region count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardRegionsCountFailure = (error) => ({
    type: GET_DASHBOARD_REGIONS_COUNT_FAILURE,
    payload: error
});
/**
 * Function for Get CMS Dashboard HELPMENUAL count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardHelpMenualCount = () => ({
    type: GET_DASHBOARD_HELPMENUAL_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard HELPMENUAL count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardHelpMenualCountSuccess = (response) => ({
    type: GET_DASHBOARD_HELPMENUAL_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard HELPMENUAL count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardHelpMenualCountFailure = (error) => ({
    type: GET_DASHBOARD_HELPMENUAL_COUNT_FAILURE,
    payload: error
});
/**
 * Function for Get CMS Dashboard coin list fields and request count  Action,Added by dhara gajera 17/1/2019
 */
export const getCmsDashboardCoinListCount = () => ({
    type: GET_DASHBOARD_COINLIST_COUNT,
    payload:{}
});

/* 
* Function for Get CMS Dashboard coin list fields and request count success Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardCoinListCountSuccess = (response) => ({
    type: GET_DASHBOARD_COINLIST_COUNT_SUCCESS,
    payload: response
});

/* 
*  Function for Get CMS Dashboard coin list fields and request count fail Action,Added by dhara gajera 17/1/2019
*/
export const getCmsDashboardCoinListCountFailure = (error) => ({
    type: GET_DASHBOARD_COINLIST_COUNT_FAILURE,
    payload: error
});


/**
 * Added By Sanjay Rathod On 27-05-2019
 * Actions For Get Dashboard Card Count For HTML Blocks 
 */

export const getCmsDashboardHTMLBlocksCount = () => ({
    type: GET_DASHBOARD_HTMLBLOCKS_COUNT    
});

export const getCmsDashboardHTMLBlocksCountSuccess = (response) => ({
    type: GET_DASHBOARD_HTMLBLOCKS_COUNT_SUCCESS,
    payload: response
});

export const getCmsDashboardHTMLBlocksCountFailure = (error) => ({
    type: GET_DASHBOARD_HTMLBLOCKS_COUNT_FAILURE,
    payload: error
});


/**
 * Added By Sanjay Rathod On 29-05-2019
 * Actions For Get Dashboard Card Count For Image Sliders
 */

export const getCmsDashboardImageSlidersCount = () => ({
    type: GET_DASHBOARD_IMAGESLIDERS_COUNT    
});

export const getCmsDashboardImageSlidersCountSuccess = (response) => ({
    type: GET_DASHBOARD_IMAGESLIDERS_COUNT_SUCCESS,
    payload: response
});

export const getCmsDashboardImageSlidersCountFailure = (error) => ({
    type: GET_DASHBOARD_IMAGESLIDERS_COUNT_FAILURE,
    payload: error
});

/**
 * Added By Sanjay Rathod On 04-06-2019
 * Actions For Get Dashboard Card Count For Advance HTML Blocks
 */

export const getCmsDashboardAdvanceHTMLBlocksCount = () => ({
    type: GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT    
});

export const getCmsDashboardAdvanceHTMLBlocksCountSuccess = (response) => ({
    type: GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_SUCCESS,
    payload: response
});

export const getCmsDashboardAdvanceHTMLBlocksCountFailure = (error) => ({
    type: GET_DASHBOARD_ADVANCE_HTMLBLOCKS_COUNT_FAILURE,
    payload: error
});