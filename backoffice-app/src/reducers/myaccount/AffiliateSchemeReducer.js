import {
    //Add Affiliate Scheme
    ADD_AFFILIATE_SCHEME,
    ADD_AFFILIATE_SCHEME_SUCCESS,
    ADD_AFFILIATE_SCHEME_FAILURE,

    //Edit Affiliate Scheme
    EDIT_AFFILIATE_SCHEME,
    EDIT_AFFILIATE_SCHEME_SUCCESS,
    EDIT_AFFILIATE_SCHEME_FAILURE,

    //Change Affiliate Scheme Status
    CHANGE_AFFILIATE_SCHEME_STATUS,
    CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE,

    //List Affiliate Scheme
    LIST_AFFILIATE_SCHEME,
    LIST_AFFILIATE_SCHEME_SUCCESS,
    LIST_AFFILIATE_SCHEME_FAILURE,

    //clear data
    CLEAR_LIST_AFFILIATE_SCHEME,
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

/**
 * initial data
 */
const INIT_STATE = {
    //Add Affiliate Scheme
    addLoading: false, addData: null,

    //edit Affiliate Scheme
    editLoading: false, editData: null,

    //change status Affiliate Scheme
    changeStatusLoading: false, chngStsData: null,

    //list Affiliate Scheme
    listLoading: false, list: null
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        //Add Affiliate Scheme
        case ADD_AFFILIATE_SCHEME:
            return Object.assign({}, state, { addLoading: true, addData: null })
        //Add Affiliate Scheme success
        case ADD_AFFILIATE_SCHEME_SUCCESS:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })
        //Add Affiliate Scheme failure
        case ADD_AFFILIATE_SCHEME_FAILURE:
            return Object.assign({}, state, { addLoading: false, addData: action.payload })

        //Edit Affiliate Scheme
        case EDIT_AFFILIATE_SCHEME:
            return Object.assign({}, state, { editLoading: true, editData: null })
        //Edit Affiliate Scheme success
        case EDIT_AFFILIATE_SCHEME_SUCCESS:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })
        //Edit Affiliate Scheme failure
        case EDIT_AFFILIATE_SCHEME_FAILURE:
            return Object.assign({}, state, { editLoading: false, editData: action.payload })

        //Change Affiliate Scheme Status
        case CHANGE_AFFILIATE_SCHEME_STATUS:
            return Object.assign({}, state, { changeStatusLoading: true, chngStsData: null })
        //Change Affiliate Scheme Status 
        case CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS:
            return Object.assign({}, state, { changeStatusLoading: false, chngStsData: action.payload })
        //Change Affiliate Scheme failure
        case CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE:
            return Object.assign({}, state, { changeStatusLoading: false, chngStsData: action.payload })

        //List Affiliate Scheme
        case LIST_AFFILIATE_SCHEME:
            return Object.assign({}, state, { listLoading: true, list: null })
        //List Affiliate Scheme success
        case LIST_AFFILIATE_SCHEME_SUCCESS:
            return Object.assign({}, state, { listLoading: false, list: action.payload })
        //List Affiliate Scheme failure
        case LIST_AFFILIATE_SCHEME_FAILURE:
            return Object.assign({}, state, { listLoading: false, list: action.payload })

        //clear data
        case CLEAR_LIST_AFFILIATE_SCHEME:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};