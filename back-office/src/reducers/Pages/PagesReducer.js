/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 03-10-2018
    UpdatedDate : 31-10-2018
    Description : CMS PAGES Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_PAGES,
    GET_PAGES_SUCCESS,
    GET_PAGES_FAILURE,
    ADD_NEW_PAGE,
    ADD_NEW_PAGE_SUCCESS,
    ADD_NEW_PAGE_FAILURE,
    UPDATE_PAGE,
    UPDATE_PAGE_SUCCESS,
    UPDATE_PAGE_FAILURE,
    DELETE_PAGE,
    GET_PAGE_BY_ID,
    GET_PAGE_BY_ID_SUCCESS,
    GET_PAGE_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    cms_pages_list: [],
    loading: false,
    data: [],
    pagedetail: {},
    updatestatus: '',
    errors: {},
    localebit: 1,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {
        // get Pages List
        case GET_PAGES:
            return { ...state, loading: true, data: [], localebit: 0 };

        // get Pages List success
        case GET_PAGES_SUCCESS:
            return { ...state, loading: false, data: [], cms_pages_list: action.payload, localebit: 0 };

        // get pages List failure
        case GET_PAGES_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        // add new Page
        case ADD_NEW_PAGE:
            return { ...state, loading: true, data: [], localebit: 0 };

        case ADD_NEW_PAGE_SUCCESS:
            NotificationManager.success(<IntlMessages id="cmspage.pageform.addpage_success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case ADD_NEW_PAGE_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        // Update Page Data
        case UPDATE_PAGE:
            return { ...state, loading: true, data: [], updatestatus: '', localebit: 0 };

        case UPDATE_PAGE_SUCCESS:
            NotificationManager.success(<IntlMessages id="cmspage.pageform.editpage_success" />);
            return { ...state, loading: false, data: action.payload, updatestatus: action.payload.status, localebit: 0 };

        case UPDATE_PAGE_FAILURE:
            // NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        //For Get Page By Id
        case GET_PAGE_BY_ID:
            return { ...state, loading: true, data: [], updatestatus: '', localebit: 0 };

        case GET_PAGE_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], pagedetail: action.payload, localebit: 0 };

        case GET_PAGE_BY_ID_FAILURE:
            return { ...state, loading: false, data: [], localebit: 0 };

        // delete page
        case DELETE_PAGE:
            return { ...state, loading: false };

        default: return { ...state };
    }
}
