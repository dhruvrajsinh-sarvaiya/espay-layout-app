import {
    //Stacking History List
    GET_STAKINGHISTORY_LIST,
    GET_STAKINGHISTORYLIST_SUCCESS,
    GET_STAKINGHISTORYLIST_FAILURE,

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //clear data
    CLEAR_STAKINGHISTORY_DATA,

    //clear data on logout
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    //Stacking History List 
    stackingHistoryFetching: false,
    stackingHistoryData: null,

    //for User list
    userData: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear ledger response
        case CLEAR_STAKINGHISTORY_DATA:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // Handle Stacking History List data
        case GET_STAKINGHISTORY_LIST:
            return Object.assign({}, state, { stackingHistoryFetching: true, StakingHistoryList: null })
        // Handle Stacking History List data Success
        case GET_STAKINGHISTORYLIST_SUCCESS:
            return Object.assign({}, state, { stackingHistoryFetching: false, StakingHistoryList: action.payload })
        // Handle Stacking History List data Failure
        case GET_STAKINGHISTORYLIST_FAILURE:
            return Object.assign({}, state, { stackingHistoryFetching: false, StakingHistoryList: action.payload })

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null })
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload })
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: action.payload })

        default:
            return state
    }
}
