/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by  : Bharat Jogrna, 25 FEB 2019
 * Rule Tool Reducer
 */

//Import action types form type.js
import {
    //Add Rule Tool
    ADD_RULE_TOOL,
    ADD_RULE_TOOL_SUCCESS,
    ADD_RULE_TOOL_FAILURE,

    //Edit Rule Tool
    EDIT_RULE_TOOL,
    EDIT_RULE_TOOL_SUCCESS,
    EDIT_RULE_TOOL_FAILURE,

    //Change Rule Tool Status
    CHANGE_RULE_TOOL_STATUS,
    CHANGE_RULE_TOOL_STATUS_SUCCESS,
    CHANGE_RULE_TOOL_STATUS_FAILURE,

    //List Rule Tool
    LIST_RULE_TOOL,
    LIST_RULE_TOOL_SUCCESS,
    LIST_RULE_TOOL_FAILURE,

    //Get By Id Rule Tool    
    GET_BY_ID_RULE_TOOL,
    GET_BY_ID_RULE_TOOL_SUCCESS,
    GET_BY_ID_RULE_TOOL_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData : [],
    listLoading: false,
    loading: false,
    chngStsData: '',
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Add Rule Tool
        case ADD_RULE_TOOL:
            return { ...state, loading: true, data : '', getData : '', list : '' };

        case ADD_RULE_TOOL_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_RULE_TOOL_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Rule Tool
        case EDIT_RULE_TOOL:
            return { ...state, loading: true, data : '', getData : '', list : '' };

        case EDIT_RULE_TOOL_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_RULE_TOOL_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Added By Bharat Jograna variable getData to get change data
        //Change Rule Rule Tool Status
        case CHANGE_RULE_TOOL_STATUS:
        return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_RULE_TOOL_STATUS_SUCCESS:
            return { ...state, listLoading: true, chngStsData: action.payload };

        case CHANGE_RULE_TOOL_STATUS_FAILURE:
            return { ...state, listLoading: true, chngStsData: action.payload };

        //List Rule Rule Tool
        case LIST_RULE_TOOL:
            return { ...state, listLoading: true, list : '', chngStsData: '' };

        case LIST_RULE_TOOL_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_RULE_TOOL_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Rule Rule Tool
        case GET_BY_ID_RULE_TOOL:
            return { ...state, loading: true, getData : '', list : '' };

        case GET_BY_ID_RULE_TOOL_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_RULE_TOOL_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};