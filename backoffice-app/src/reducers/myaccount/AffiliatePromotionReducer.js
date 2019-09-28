import {
    //Add Affiliate Promotion
    ADD_AFFILIATE_PROMOTION,
    ADD_AFFILIATE_PROMOTION_SUCCESS,
    ADD_AFFILIATE_PROMOTION_FAILURE,

    //Edit Affiliate Promotion
    EDIT_AFFILIATE_PROMOTION,
    EDIT_AFFILIATE_PROMOTION_SUCCESS,
    EDIT_AFFILIATE_PROMOTION_FAILURE,

    //Change Affiliate Promotion Status
    CHANGE_AFFILIATE_PROMOTION_STATUS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE,

    //List Affiliate Promotion
    LIST_AFFILIATE_PROMOTION,
    LIST_AFFILIATE_PROMOTION_SUCCESS,
    LIST_AFFILIATE_PROMOTION_FAILURE,

    //clear data
    CLEAR_AFFILIATE_PROMOTION,

    //Log Out Clear data
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

/**
 * initial data
 */
const INITIAL_STATE = {
    //Add Affiliate Promotion
    addData: null,
    addLoading: false,

    //Edit Affiliate Promotion
    editData: null,
    editLoading: false,

    //List Affiliate Promotion
    list: null,
    listLoading: false,

    //Change Affiliate Promotion Status
    chngStsData: null,
    changeStatusLoading: false
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //Add Affiliate Promotion
        case ADD_AFFILIATE_PROMOTION:
            return Object.assign({}, state, {
                addLoading: true,
                addData: null
            })
        //Add Affiliate Promotion success
        case ADD_AFFILIATE_PROMOTION_SUCCESS:
        //Add Affiliate Promotion failure
        case ADD_AFFILIATE_PROMOTION_FAILURE:
            return Object.assign({}, state, {
                addLoading: false,
                addData: action.payload
            })


        //Edit Affiliate Promotion
        case EDIT_AFFILIATE_PROMOTION:
            return Object.assign({}, state, {
                editLoading: true,
                editData: null
            })
        //Edit Affiliate Promotion success
        case EDIT_AFFILIATE_PROMOTION_SUCCESS:
        //Edit Affiliate Promotion failure
        case EDIT_AFFILIATE_PROMOTION_FAILURE:
            return Object.assign({}, state, {
                editLoading: false,
                editData: action.payload
            })


        //Change Affiliate Promotion Status
        case CHANGE_AFFILIATE_PROMOTION_STATUS:
            return Object.assign({}, state, {
                changeStatusLoading: true,
                chngStsData: null
            })
        //Change Affiliate Promotion Status success
        case CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS:
        //Change Affiliate Promotion Status failure
        case CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE:
            return Object.assign({}, state, {
                changeStatusLoading: false,
                chngStsData: action.payload
            })

        //List Affiliate Promotion
        case LIST_AFFILIATE_PROMOTION:
            return Object.assign({}, state, {
                listLoading: true,
                list: null
            })
        //List Affiliate Promotion success
        case LIST_AFFILIATE_PROMOTION_SUCCESS:
        //List Affiliate Promotion failure
        case LIST_AFFILIATE_PROMOTION_FAILURE:
            return Object.assign({}, state, {
                listLoading: false,
                list: action.payload
            })
       
        //Clear data
        case CLEAR_AFFILIATE_PROMOTION:
            return INITIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};