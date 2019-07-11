/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 03-10-2018
    UpdatedDate : 31-10-2018
    Description : CRM Form Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    ADD_NEW_CRMFORM,
    ADD_NEW_CRMFORM_SUCCESS,
    ADD_NEW_CRMFORM_FAILURE
} from 'Actions/types';

// initial state
const INITIAL_STATE = {
    loading: false,
    data: [],
    errors: {}
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // add new CRM Form
        case ADD_NEW_CRMFORM:
            return { ...state, loading: true, data: [] };

        case ADD_NEW_CRMFORM_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, data: action.payload };

        case ADD_NEW_CRMFORM_FAILURE:
            return { ...state, loading: false, data: action.payload };

        default: return { ...state };
    }
}
