// Action types for Deleverage
import {
    //For Deleverage Pre Confirm
    DELEVERAGE_PRE_CONFIRM,
    DELEVERAGE_PRE_CONFIRM_SUCCESS,
    DELEVERAGE_PRE_CONFIRM_FAILURE,

    //For Deleverage Confirm
    DELEVERAGE_CONFIRM,
    DELEVERAGE_CONFIRM_SUCCESS,
    DELEVERAGE_CONFIRM_FAILURE,
    ACTION_LOGOUT,
} from "../actions/ActionTypes";

// Initial state for Deleverage
const INTIAL_STATE = {

    //For Deleverage Pre Confirm
    DeleveragePreFetchData: true,
    DeleveragePreData: '',
    DeleveragePreIsFetching: false,

    //For Deleverage Confirm
    DeleverageFetchData: true,
    DeleverageData: '',
    DeleverageIsFetching: false,
}

const DeleverageReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // Handle Deleverage Confirm method data
        case DELEVERAGE_CONFIRM:
            return Object.assign({}, state, {
                DeleverageIsFetching: true,
                DeleverageFetchData: true,
                DeleverageData: '',
                DeleveragePreFetchData: true,
            });
        // Set Deleverage Confirm success data
        case DELEVERAGE_CONFIRM_SUCCESS:
            return Object.assign({}, state, {
                DeleverageIsFetching: false,
                DeleverageFetchData: false,
                DeleverageData: action.response,
                DeleveragePreFetchData: true,
            });
        // Set Deleverage Confirm failure data
        case DELEVERAGE_CONFIRM_FAILURE:
            return Object.assign({}, state, {
                DeleverageIsFetching: false,
                DeleverageFetchData: false,
                DeleverageData: action.error,
                DeleveragePreFetchData: true,
            });

        // Handle Deleverage Pre Confirm method data
        case DELEVERAGE_PRE_CONFIRM:
            return Object.assign({}, state, {
                DeleveragePreFetchData: true,
                DeleveragePreIsFetching: true,
                DeleveragePreData: '',
                DeleverageFetchData: true,
            });
        // Set Deleverage Pre Confirm success data
        case DELEVERAGE_PRE_CONFIRM_SUCCESS:
            return Object.assign({}, state, {
                DeleveragePreFetchData: false,
                DeleveragePreIsFetching: false,
                DeleveragePreData: action.response,
                DeleverageFetchData: true,
            });
        // Set Deleverage Pre Confirm failure data
        case DELEVERAGE_PRE_CONFIRM_FAILURE:
            return Object.assign({}, state, {
                DeleveragePreFetchData: false,
                DeleveragePreIsFetching: false,
                DeleveragePreData: action.error,
                DeleverageFetchData: true,
            });

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default DeleverageReducer;