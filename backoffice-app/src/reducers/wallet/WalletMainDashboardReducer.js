
import {
    //Organization Details
    ORGDETAILS,
    ORGDETAILS_SUCCESS,
    ORGDETAILS_FAIL,

    //User Details
    USERDETAILS,
    USERDETAILS_SUCCESS,
    USERDETAILS_FAIL,

    //Type Details
    TYPEDETAILS,
    TYPEDETAILS_SUCCESS,
    TYPEDETAILS_FAIL,

    //Role Details
    ROLEDETAILS,
    ROLEDETAILS_SUCCESS,
    ROLEDETAILS_FAIL,

    //WALLET TYPE LIST
    WALLETTYPELIST,
    WALLETTYPELIST_SUCCESS,
    WALLETTYPELIST_FAIL,

    //WALLET SUMMARY LIST
    WALLETSUMMARY,
    WALLETSUMMARY_SUCCESS,
    WALLETSUMMARY_FAIL,

    //Wallet Details
    WALLETSTATUSDETAILS,
    WALLETSTATUSDETAILS_SUCCESS,
    WALLETSTATUSDETAILS_FAIL,

    //User Graph Details
    USERGRAPH,
    USERGRAPH_SUCCESS,
    USERGRAPH_FAIL,

    //Organization Graph Details
    OGRGRAPH,
    OGRGRAPH_SUCCESS,
    OGRGRAPH_FAIL,

    // Clear data
    ACTION_LOGOUT

} from "../../actions/ActionTypes";

// initial state
const INIT_STATE = {

    //Initial State For Organization Details
    OrgDetailFetchData: true,
    OrgDetailIsFetching: false,
    OrgDetaildata: '',

    //Initial State For User Details
    UserDetailFetchData: true,
    UserDetailIsFetching: false,
    UserDetaildata: '',

    //Initial State For Type Details 
    TypeDetailFetchData: true,
    TypeDetailIsFetching: false,
    TypeDetaildata: '',

    //Initial State For Role Details
    RoleDetailFetchData: true,
    RoleDetailIsFetching: false,
    RoleDetaildata: '',

    //Initial State For Wallet Type List
    WalletTypeFetchData: true,
    WalletTypeIsFetching: false,
    WalletTypedata: '',

    //Initial State For Wallet Summary data
    WalletSummaryFetchData: true,
    WalletSummaryIsFetching: false,
    WalletSummarydata: '',

    //Initial State For Wallet Details
    WalletStatusDetailFetchData: true,
    WalletStatusDetailIsFetching: false,
    WalletStatusDetaildata: '',

    //Initial State For User Graph Data
    UserGraphFetchData: true,
    UserGraphIsFetching: false,
    UserGraphdata: '',

    //Initial State For Organization Graph Data
    OrganizationGraphFetchData: true,
    OrganizationGraphIsFetching: false,
    OrganizationGraphdata: '',
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {
        //organization details
        case ORGDETAILS:
            return Object.assign({}, state, { OrgDetailFetchData: true, OrgDetaildata: '', OrgDetailIsFetching: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case ORGDETAILS_SUCCESS:
            return Object.assign({}, state, { OrgDetailFetchData: false, OrgDetaildata: action.payload, OrgDetailIsFetching: false, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case ORGDETAILS_FAIL:
            return Object.assign({}, state, { OrgDetailFetchData: false, OrgDetaildata: action.payload, OrgDetailIsFetching: false, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        //User Details
        case USERDETAILS:
            return Object.assign({}, state, { UserDetailFetchData: true, UserDetaildata: '', UserDetailIsFetching: true, OrgDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case USERDETAILS_SUCCESS:
            return Object.assign({}, state, { UserDetailFetchData: false, UserDetaildata: action.payload, UserDetailIsFetching: false, OrgDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case USERDETAILS_FAIL:
            return Object.assign({}, state, { UserDetailFetchData: false, UserDetaildata: action.payload, UserDetailIsFetching: false, OrgDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        //User Type Details
        case TYPEDETAILS:
            return Object.assign({}, state, { TypeDetailFetchData: true, TypeDetaildata: '', TypeDetailIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case TYPEDETAILS_SUCCESS:
            return Object.assign({}, state, { TypeDetailFetchData: false, TypeDetaildata: action.payload, TypeDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case TYPEDETAILS_FAIL:
            return Object.assign({}, state, { TypeDetailFetchData: false, TypeDetaildata: action.payload, TypeDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        //role details
        case ROLEDETAILS:
            return Object.assign({}, state, { RoleDetailFetchData: true, RoleDetaildata: '', RoleDetailIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case ROLEDETAILS_SUCCESS:
            return Object.assign({}, state, { RoleDetailFetchData: false, RoleDetaildata: action.payload, RoleDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case ROLEDETAILS_FAIL:
            return Object.assign({}, state, { RoleDetailFetchData: false, RoleDetaildata: action.payload, RoleDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        /* wallet type list */
        case WALLETTYPELIST:
            return Object.assign({}, state, { WalletTypeFetchData: true, WalletTypedata: '', WalletTypeIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETTYPELIST_SUCCESS:
            return Object.assign({}, state, { WalletTypeFetchData: false, WalletTypedata: action.payload, WalletTypeIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETTYPELIST_FAIL:
            return Object.assign({}, state, { WalletTypeFetchData: false, WalletTypedata: action.payload, WalletTypeIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        /* wallet type list */
        case WALLETSUMMARY:
            return Object.assign({}, state, { WalletSummaryFetchData: true, WalletSummarydata: '', WalletSummaryIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETSUMMARY_SUCCESS:
            return Object.assign({}, state, { WalletSummaryFetchData: false, WalletSummarydata: action.payload, WalletSummaryIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETSUMMARY_FAIL:
            return Object.assign({}, state, { WalletSummaryFetchData: false, WalletSummarydata: action.payload, WalletSummaryIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        //wallet details
        case WALLETSTATUSDETAILS:
            return Object.assign({}, state, { WalletStatusDetailFetchData: true, WalletStatusDetaildata: '', WalletStatusDetailIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETSTATUSDETAILS_SUCCESS:
            return Object.assign({}, state, { WalletStatusDetailFetchData: false, WalletStatusDetaildata: action.payload, WalletStatusDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })
        case WALLETSTATUSDETAILS_FAIL:
            return Object.assign({}, state, { WalletStatusDetailFetchData: false, WalletStatusDetaildata: action.payload, WalletStatusDetailIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, UserGraphFetchData: true, OrganizationGraphFetchData: true, })

        //user graph data
        case USERGRAPH:
            return Object.assign({}, state, { UserGraphFetchData: true, UserGraphdata: '', UserGraphIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, OrganizationGraphFetchData: true, })
        case USERGRAPH_SUCCESS:
            return Object.assign({}, state, { UserGraphFetchData: false, UserGraphdata: action.payload, UserGraphIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, OrganizationGraphFetchData: true, })
        case USERGRAPH_FAIL:
            return Object.assign({}, state, { UserGraphFetchData: false, UserGraphdata: action.payload, UserGraphIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, OrganizationGraphFetchData: true, })

        //organization graph data
        case OGRGRAPH:
            return Object.assign({}, state, { OrganizationGraphFetchData: true, OrganizationGraphdata: '', OrganizationGraphIsFetching: true, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, })
        case OGRGRAPH_SUCCESS:
            return Object.assign({}, state, { OrganizationGraphFetchData: false, OrganizationGraphdata: action.payload, OrganizationGraphIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, })
        case OGRGRAPH_FAIL:
            return Object.assign({}, state, { OrganizationGraphFetchData: false, OrganizationGraphdata: action.payload, OrganizationGraphIsFetching: false, OrgDetailFetchData: true, UserDetailFetchData: true, TypeDetailFetchData: true, RoleDetailFetchData: true, WalletTypeFetchData: true, WalletSummaryFetchData: true, WalletStatusDetailFetchData: true, UserGraphFetchData: true, })

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INIT_STATE;
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
