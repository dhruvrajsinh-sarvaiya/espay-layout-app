/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Update by :Saloni Rathod(07/03/2019), Bharat Jograna, 04 March 2019 
 * Display Affiliate reducers
*/
import {
    //Added By Saloni Rathod
    //For Display Affiliate Report
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_SIGNUP_REPORT_SUCCESS,
    AFFILIATE_SIGNUP_REPORT_FAILURE,

    //For Display Affiliate Commission Report
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_COMMISSION_REPORT_SUCCESS,
    AFFILIATE_COMMISSION_REPORT_FAILURE,

    //to display email sent report
    AFFILIATE_EMAIL_SENT_REPORT,
    AFFILIATE_EMAIL_SENT_REPORT_SUCCESS,
    AFFILIATE_EMAIL_SENT_REPORT_FAILURE,

    //to display SMS sent report
    AFFILIATE_SMS_SENT_REPORT,
    AFFILIATE_SMS_SENT_REPORT_SUCCESS,
    AFFILIATE_SMS_SENT_REPORT_FAILURE,

    //to display all user
    AFFILIATE_ALL_USER,
    AFFILIATE_ALL_USER_SUCCESS,
    AFFILIATE_ALL_USER_FAILURE,

    //TO display affiliate SCHEME TYPE 
    AFFILIATE_SCHEME_TYPE,
    AFFILIATE_SCHEME_TYPE_SUCCESS,
    AFFILIATE_SCHEME_TYPE_FAILURE,
    //to display affiliate INVITE FRIEND
    AFFILIATE_INVITE_FRIEND_CHART,
    AFFILIATE_INVITE_FRIEND_CHART_SUCCESS,
    AFFILIATE_INVITE_FRIEND_CHART_FAILURE,

    //for affiliate Monthly average chart
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART,
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_SUCCESS,
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_FAILURE,

    // Added By Bharat Jograna 
    // For Display Affiliate Facebook Share Report
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    // For Display Affiliate Twitter Share Report 
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE,

    // For Display Affiliate Click On link Report 
    AFFILIATE_CLICK_ON_LINK_REPORT,
    AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS,
    AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE,

    // For Display Affiliate Twitter Share Report 
    AFFILIATE_ALL_COUNT,
    AFFILIATE_ALL_COUNT_SUCCESS,
    AFFILIATE_ALL_COUNT_FAILURE,

} from "Actions/types";

const INIT_STATE = {
    list: [],
    clist: [],
    flist: [],
    tlist:[],
    chart: [],
    mchart: [],
    typelist: [],
    userlist: [],
    smslist: [],
    emaillist: [],
    signupData: [],
    commissionData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Added By Saloni Rathod
        //For Display Affiliate Report
        case AFFILIATE_SIGNUP_REPORT:
            return { ...state, loading: true, signupData: [] };

        case AFFILIATE_SIGNUP_REPORT_SUCCESS:
            return { ...state, loading: false, signupData: action.payload };

        case AFFILIATE_SIGNUP_REPORT_FAILURE:
            return { ...state, loading: false, signupData: action.payload };

        //For Display Affiliate Report
        case AFFILIATE_COMMISSION_REPORT:
            return { ...state, loading: true, commissionData: [] };

        case AFFILIATE_COMMISSION_REPORT_SUCCESS:
            return { ...state, loading: false, commissionData: action.payload };

        case AFFILIATE_COMMISSION_REPORT_FAILURE:
            return { ...state, loading: false, commissionData: action.payload };


        //For Display Email Sent Report
        case AFFILIATE_EMAIL_SENT_REPORT:
            return { ...state, loading: true, emaillist: [] };

        case AFFILIATE_EMAIL_SENT_REPORT_SUCCESS:
            return { ...state, loading: false, emaillist: action.payload };

        case AFFILIATE_EMAIL_SENT_REPORT_FAILURE:
            return { ...state, loading: false, emaillist: action.payload };

        //For Display Email Sent Report
        case AFFILIATE_SMS_SENT_REPORT:
            return { ...state, loading: true, smslist: [] };

        case AFFILIATE_SMS_SENT_REPORT_SUCCESS:
            return { ...state, loading: false, smslist: action.payload };

        case AFFILIATE_SMS_SENT_REPORT_FAILURE:
            return { ...state, loading: false, smslist: action.payload };

        //TO  Display AFFILIATE USER DETAIL  Report
        case AFFILIATE_ALL_USER:
            return { ...state, loading: true, userlist: [] };

        case AFFILIATE_ALL_USER_SUCCESS:
            return { ...state, loading: false, userlist: action.payload };

        case AFFILIATE_ALL_USER_FAILURE:
            return { ...state, loading: false, userlist: action.payload };


        //TO  Display AFFILIATE SCHEME TYPE  Report
        case AFFILIATE_SCHEME_TYPE:
            return { ...state, loading: true, typelist: [] };

        case AFFILIATE_SCHEME_TYPE_SUCCESS:
            return { ...state, loading: false, typelist: action.payload };

        case AFFILIATE_SCHEME_TYPE_FAILURE:
            return { ...state, loading: false, typelist: action.payload };

        // Added By Bharat Jograna
        //For Display Affiliate Share On Facebook Report
        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT:
            return { ...state, loading: true, flist: [] };

        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS:
            return { ...state, loading: false, flist: action.payload };

        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE:
            return { ...state, loading: false, flist: action.payload };

        //For Display Affiliate Share On Twitter Report
        case AFFILIATE_SHARE_ON_TWITTER_REPORT:
            return { ...state, loading: true, tlist: [] };

        case AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS:
            return { ...state, loading: false, tlist: action.payload };

        case AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE:
            return { ...state, loading: false, tlist: action.payload };

        //For Display Affiliate Report
        case AFFILIATE_CLICK_ON_LINK_REPORT:
            return { ...state, loading: true, clist: [] };

        case AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS:
            return { ...state, loading: false, clist: action.payload };

        case AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE:
            return { ...state, loading: false, clist: action.payload };

        //For Display Affiliate Report
        case AFFILIATE_ALL_COUNT:
            return { ...state, loading: true, list: [] };

        case AFFILIATE_ALL_COUNT_SUCCESS:
            return { ...state, loading: false, list: action.payload };

        case AFFILIATE_ALL_COUNT_FAILURE:
            return { ...state, loading: false, list: action.payload };

        //For Displaying INVITE fRIEND
        case AFFILIATE_INVITE_FRIEND_CHART:
            return { ...state, loading: true, chart: [] };

        case AFFILIATE_INVITE_FRIEND_CHART_SUCCESS:
            return { ...state, loading: false, chart: action.payload };

        case AFFILIATE_INVITE_FRIEND_CHART_FAILURE:
            return { ...state, loading: false, chart: action.payload };


        //For Displaying monthly commission chart 
        case AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART:
            return { ...state, loading: true, mchart: [] };

        case AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_SUCCESS:
            return { ...state, loading: false, mchart: action.payload };

        case AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_FAILURE:
            return { ...state, loading: false, mchart: action.payload };



        default:
            return { ...state };
    }
};