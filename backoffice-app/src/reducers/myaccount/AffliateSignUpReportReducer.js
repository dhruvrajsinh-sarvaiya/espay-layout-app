import {
    //For Display Affiliate Report
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_SIGNUP_REPORT_SUCCESS,
    AFFILIATE_SIGNUP_REPORT_FAILURE,

    //clear data
    CLEAR_AFFILIATE_SIGNUP_REPORT,
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

const initialState = {

    //Affiliate Report list
    loading: false,
    AffliateReportData: null,
};

const AffliateSignUpReportReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state for clear data
        case CLEAR_AFFILIATE_SIGNUP_REPORT:
            return initialState

        //For Display Affiliate Report
        case AFFILIATE_SIGNUP_REPORT:
            return Object.assign({}, state, { loading: true, AffliateReportData: null })
        //For Display Affiliate Report success
        case AFFILIATE_SIGNUP_REPORT_SUCCESS:
            return Object.assign({}, state, { loading: false, AffliateReportData: action.payload })
        //For Display Affiliate Report failure
        case AFFILIATE_SIGNUP_REPORT_FAILURE:
            return Object.assign({}, state, { loading: false, AffliateReportData: null })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};

export default AffliateSignUpReportReducer