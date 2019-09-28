import {
    //trntype role wise List
    GET_LIST_PENDING_REQUEST,
    GET_LIST_PENDING_REQUEST_SUCCESS,
    GET_LIST_PENDING_REQUEST_FAILURE,

    //unstaking requests accept reject
    ACCEPTREJECT_UNSTAKING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //clear data
    CLEAR_UNSTAKING_REQUEST_DATA,

    //clear data on logout
    ACTION_LOGOUT,

} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {
    //unstaking requests List
    unstackingListData: null,
    loading: false,

    //unstaking requests accept reject
    acceptRejectData: null,
    acceptRejectFetching: false,

    //for User list
    userData: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        //clear ledger response
        case CLEAR_UNSTAKING_REQUEST_DATA:
            { return INITIAL_STATE; }

        // Handle Get unstaking requests List
        case GET_LIST_PENDING_REQUEST:
            return Object.assign({}, state, { loading: true, unstackingListData: null })
        // Handle Get unstaking requests List success
        case GET_LIST_PENDING_REQUEST_SUCCESS:
            return Object.assign({}, state, { loading: false, unstackingListData: action.payload })
        // Handle Get unstaking requests List failuire
        case GET_LIST_PENDING_REQUEST_FAILURE:
            return Object.assign({}, state, { loading: false, unstackingListData: action.payload })

        // Handle Get unstaking requests accept reject status
        case ACCEPTREJECT_UNSTAKING_REQUEST:
            return Object.assign({}, state, { acceptRejectFetching: true, acceptRejectData: null })
        // Handle Get unstaking requests accept reject status success
        case ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS:
            return Object.assign({}, state, { acceptRejectFetching: false, acceptRejectData: action.payload })
        // Handle Get unstaking requests accept reject status failure
        case ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE:
            return Object.assign({}, state, { acceptRejectFetching: false, acceptRejectData: action.payload })

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null })
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload })
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
