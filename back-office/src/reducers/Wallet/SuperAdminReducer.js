/* 
    Developer : Nishant Vadgama
    Date : 24-11-2018
    File Comment : wallet dashboard super admin reducer
*/
import {
    //Organization Details
    ORGDETAILS,
    ORGDETAILS_SUCCESS,
    ORGDETAILS_FAIL,
    //User Details
    USERDETAILS,
    USERDETAILS_SUCCESS,
    USERDETAILS_FAIL,
    //User Details
    TYPEDETAILS,
    TYPEDETAILS_SUCCESS,
    TYPEDETAILS_FAIL,
    //Organization LIST
    ORGLIST,
    ORGLIST_SUCCESS,
    ORGLIST_FAIL,
    //Wallet Details
    WALLETDETAILS,
    WALLETDETAILS_SUCCESS,
    WALLETDETAILS_FAIL,
    //Wallet Types
    WALLETTYPES,
    WALLETTYPES_SUCCESS,
    WALLETTYPES_FAIL,
    //Role Details
    ROLEDETAILS,
    ROLEDETAILS_SUCCESS,
    ROLEDETAILS_FAIL,
    //User Graph Details
    USERGRAPH,
    USERGRAPH_SUCCESS,
    USERGRAPH_FAIL,
    //Organization Graph Details
    OGRGRAPH,
    OGRGRAPH_SUCCESS,
    OGRGRAPH_FAIL,
    // recent charges
    RECENTCHARGES,
    RECENTCHARGES_SUCCESS,
    RECENTCHARGES_FAIL,
    // recent usage
    RECENTUSAGE,
    RECENTUSAGE_SUCCESS,
    RECENTUSAGE_FAIL,
    // recent commission
    RECENTCOMMISION,
    RECENTCOMMISION_SUCCESS,
    RECENTCOMMISION_FAIL,
    // wallet transaction types
    WALLETTRNTYPES,
    WALLETTRNTYPES_SUCCESS,
    WALLETTRNTYPES_FAIL,
    //transaction graph data
    TRNGRAPH,
    TRNGRAPH_SUCCESS,
    TRNGRAPH_FAIL,
    //wallet user details
    WALLETUSERDETAILS,
    WALLETUSERDETAILS_SUCCESS,
    WALLETUSERDETAILS_FAIL,
    //WALLET TYPE LIST
    WALLETTYPELIST,
    WALLETTYPELIST_SUCCESS,
    WALLETTYPELIST_FAIL,
    //WALLET TYPE LIST
    WALLETSUMMARY,
    WALLETSUMMARY_SUCCESS,
    WALLETSUMMARY_FAIL,
    //CHANNELDETAILS
    CHANNELDETAILS,
    CHANNELDETAILS_SUCCESS,
    CHANNELDETAILS_FAIL
} from "Actions/types";

// initial state
const INIT_STATE = {
    organizationDetails: {
        loading: false
    },
    usersDetails: {
        loading: false
    },
    userTypesDetails: {
        loading: false
    },
    organizationList: {
        loading: false
    },
    walletDetails: {
        loading: false
    },
    walletTypes: {
        loading: false
    },
    roleDetails: {
        loading: false
    },
    userGraph: {},
    organizationGraph: {},
    recentCharges: {},
    recentUsages: {},
    recentCommissions: {},
    walletTrnTypes: {},
    transactionGraph: {},
    walletUserDetails: {},
    walletTypeList: {},
    walletSummary: {},
    channelDetails: {},
};

export default (state, action) => {
    if (typeof state === 'undefined') {
      return INIT_STATE
    }
    switch (action.type) {
        //organization details
        case ORGDETAILS:
            return { ...state, organizationDetails: { loading: true } };
        case ORGDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, organizationDetails: action.payload };
        case ORGDETAILS_FAIL:
            return { ...state, organizationDetails: { loading: false } };

        //User Details
        case USERDETAILS:
            return { ...state, usersDetails: { loading: true } };
        case USERDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, usersDetails: action.payload };
        case USERDETAILS_FAIL:
            return { ...state, usersDetails: { loading: false } };

        //User Type Details
        case TYPEDETAILS:
            return { ...state, userTypesDetails: { loading: true } };
        case TYPEDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, userTypesDetails: action.payload };
        case TYPEDETAILS_FAIL:
            return { ...state, userTypesDetails: { loading: false } };

        //organization list
        case ORGLIST:
            return { ...state, organizationList: { loading: true } };
        case ORGLIST_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, loading: false, organizationList: action.payload };
        case ORGLIST_FAIL:
            return { ...state, organizationList: { loading: true } };

        //wallet details
        case WALLETDETAILS:
            return { ...state, walletDetails: { loading: true } };
        case WALLETDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, loading: false, walletDetails: action.payload };
        case WALLETDETAILS_FAIL:
            return { ...state, walletDetails: { loading: true } };

        //wallet types
        case WALLETTYPES:
            return { ...state, walletTypes: { loading: true } };
        case WALLETTYPES_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, loading: false, walletTypes: action.payload };
        case WALLETTYPES_FAIL:
            return { ...state, walletTypes: { loading: true } };

        //role details
        case ROLEDETAILS:
            return { ...state, roleDetails: { loading: true } };
        case ROLEDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, loading: false, roleDetails: action.payload };
        case ROLEDETAILS_FAIL:
            return { ...state, roleDetails: { loading: true } };

        //user graph data
        case USERGRAPH:
        case USERGRAPH_FAIL:
        case OGRGRAPH:
        case OGRGRAPH_FAIL:
            return { ...state };
        case USERGRAPH_SUCCESS:
            return { ...state, loading: false, userGraph: action.payload };

        //organization graph data
        case OGRGRAPH_SUCCESS:
            return { ...state, loading: false, organizationGraph: action.payload };
        // recent charges
        case RECENTCHARGES:
            return { ...state, recentCharges: { loading: true } }
        case RECENTCHARGES_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, recentCharges: action.payload }
        case RECENTCHARGES_FAIL:
            return { ...state, recentCharges: { loading: true } }

        // recent usage
        case RECENTUSAGE:
            return { ...state, recentUsages: { loading: true } }
        case RECENTUSAGE_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, recentUsages: action.payload }
        case RECENTUSAGE_FAIL:
            return { ...state, recentUsages: { loading: true } }

        // recent commission
        case RECENTCOMMISION:
            return { ...state, recentCommissions: { loading: true } }
        case RECENTCOMMISION_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, recentCommissions: action.payload }
        case RECENTCOMMISION_FAIL:
            return { ...state, recentCommissions: { loading: true } }

        // wallet transaction types
        case WALLETTRNTYPES:
            return { ...state, walletTrnTypes: { loading: true } }
        case WALLETTRNTYPES_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, walletTrnTypes: action.payload }
        case WALLETTRNTYPES_FAIL:
            return { ...state, walletTrnTypes: { loading: true } }

        // wallet transaction types
        case TRNGRAPH:
            return { ...state, transactionGraph: { loading: true } }
        case TRNGRAPH_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, transactionGraph: action.payload }
        case TRNGRAPH_FAIL:
            return { ...state, transactionGraph: { loading: true } }

        // wallet user details
        case WALLETUSERDETAILS:
            return { ...state, walletUserDetails: { loading: true } }
        case WALLETUSERDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, walletUserDetails: action.payload }
        case WALLETUSERDETAILS_FAIL:
            return { ...state, walletUserDetails: { loading: true } }

        /* wallet type list */
        case WALLETTYPELIST:
            return { ...state, walletTypeList: { loading: true } }
        case WALLETTYPELIST_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, walletTypeList: action.payload }
        case WALLETTYPELIST_FAIL:
            return { ...state, walletTypeList: { loading: true } }

        /* wallet type list */
        case WALLETSUMMARY:
            return { ...state, walletSummary: { loading: true } }
        case WALLETSUMMARY_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, walletSummary: action.payload }
        case WALLETSUMMARY_FAIL:
            return { ...state, walletSummary: { loading: true } }

        /* wallet type list */
        case CHANNELDETAILS:
            return { ...state, channelDetails: { loading: true } }
        case CHANNELDETAILS_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, channelDetails: action.payload }
        case CHANNELDETAILS_FAIL:
            return { ...state, channelDetails: { loading: true } }


        default:
            return { ...state };
    }
};
