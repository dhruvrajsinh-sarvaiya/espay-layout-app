/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by  : Bharat Jogrna, 25 FEB 2019, Saloni Rathod(11/03/2019)
 * Rule Sub Module Reducer
 */

//Import action types form type.js
import {
    //Add Sub Module
    ADD_RULE_SUB_MODULE,
    ADD_RULE_SUB_MODULE_SUCCESS,
    ADD_RULE_SUB_MODULE_FAILURE,

    //Edit Sub Module
    EDIT_RULE_SUB_MODULE,
    EDIT_RULE_SUB_MODULE_SUCCESS,
    EDIT_RULE_SUB_MODULE_FAILURE,

    //Change Sub Module Status
    CHANGE_RULE_SUB_MODULE_STATUS,
    CHANGE_RULE_SUB_MODULE_STATUS_SUCCESS,
    CHANGE_RULE_SUB_MODULE_STATUS_FAILURE,

    //List Sub Module
    LIST_RULE_SUB_MODULE,
    LIST_RULE_SUB_MODULE_SUCCESS,
    LIST_RULE_SUB_MODULE_FAILURE,

    //Get By Id Sub Module    
    GET_BY_ID_RULE_SUB_MODULE,
    GET_BY_ID_RULE_SUB_MODULE_SUCCESS,
    GET_BY_ID_RULE_SUB_MODULE_FAILURE,

    //List Sub Module for Parentid Added by Saloni Rathod
    LIST_RULE_SUB_MODULE_FOR_PARENTID,
    LIST_RULE_SUB_MODULE_FOR_PARENTID_SUCCESS,
    LIST_RULE_SUB_MODULE_FOR_PARENTID_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData: [],
    listLoading: false,
    loading: false,
    chngStsData: '',
    plist: [], //Added by Saloni Rathod
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Add Sub Module
        case ADD_RULE_SUB_MODULE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_RULE_SUB_MODULE_SUCCESS:
        case ADD_RULE_SUB_MODULE_FAILURE:
        case EDIT_RULE_SUB_MODULE_SUCCESS:
       case EDIT_RULE_SUB_MODULE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Sub Module
        case EDIT_RULE_SUB_MODULE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        // Added By Bharat Jograna variable chngStsData to get change data
        //Change Rule Sub Module Status
        case CHANGE_RULE_SUB_MODULE_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_RULE_SUB_MODULE_STATUS_SUCCESS:
        case CHANGE_RULE_SUB_MODULE_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Rule Sub Module
        case LIST_RULE_SUB_MODULE:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_RULE_SUB_MODULE_SUCCESS:
        case LIST_RULE_SUB_MODULE_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Rule Sub Module
        case GET_BY_ID_RULE_SUB_MODULE:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_RULE_SUB_MODULE_SUCCESS:
        case GET_BY_ID_RULE_SUB_MODULE_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        //List Parent Rule Sub Module Added by Saloni Rathod
        case LIST_RULE_SUB_MODULE_FOR_PARENTID:
            return { ...state, loading: true, plist: '', chngStsData: '' };

        case LIST_RULE_SUB_MODULE_FOR_PARENTID_SUCCESS:
        case LIST_RULE_SUB_MODULE_FOR_PARENTID_FAILURE:
            return { ...state, loading: false, plist: action.payload };

        default:
            return { ...state };
    }
};