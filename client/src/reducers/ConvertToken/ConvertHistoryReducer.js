import {
    GET_CTHISTORY,
    GET_CTHISTORY_SUCCESS,
    GET_CTHISTORY_FAILURE
} from 'Actions/types';

const INITIAL_STATE = {
    historyList: [],
    showLoading : false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CTHISTORY:
            return { ...state, showLoading: true }

        case GET_CTHISTORY_SUCCESS:
            return { ...state, showLoading: false , historyList : action.payload}
        
        case GET_CTHISTORY_FAILURE:
            return { ...state, showLoading: false }
        
        default:
            return {...state}

    }
}