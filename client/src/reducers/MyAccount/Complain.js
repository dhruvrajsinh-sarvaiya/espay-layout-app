/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Complain Reducers
 */
import {
    //List Complain
    LIST_COMPLAIN,
    LIST_COMPLAIN_SUCCESS,
    LIST_COMPLAIN_FAILURE,

    //Add Complain
    ADD_COMPLAIN,
    ADD_COMPLAIN_SUCCESS,
    ADD_COMPLAIN_FAILURE,

    //Get Complain By ID
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_BY_ID_SUCCESS,
    GET_COMPLAIN_BY_ID_FAILURE,

    //Replay Complain
    REPLAY_COMPLAIN,
    REPLAY_COMPLAIN_SUCCESS,
    REPLAY_COMPLAIN_FAILURE,

    //Get Complain Type
    GET_COMPLAIN_TYPE,
    GET_COMPLAIN_TYPE_SUCCESS,
    GET_COMPLAIN_TYPE_FAILURE,

    //Get Complain Priority
    GET_COMPLAIN_PRIORITY,
    GET_COMPLAIN_PRIORITY_SUCCESS,
    GET_COMPLAIN_PRIORITY_FAILURE,

} from 'Actions/types';


/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    data: [],
    reply_data: [],
    list: [],
    getList: [],
    priorityList: [],
    getComplainTypeData: []
}

//Check Action for Complain...
export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
	}
    switch (action.type) {
        //List Complain..
        case LIST_COMPLAIN:
            return { ...state, loading: true, getList: '', data: '' };

        case LIST_COMPLAIN_SUCCESS:
            return { ...state, loading: false, getList: action.payload };

        case LIST_COMPLAIN_FAILURE:
            return { ...state, loading: false, getList: action.payload };

        //Add Complain..
        case ADD_COMPLAIN:
            return { ...state, loading: true, data: '' };

        case ADD_COMPLAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_COMPLAIN_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Get Complain By ID..
        case GET_COMPLAIN_BY_ID:
            return { ...state, loading: true, reply_data: "", list: action.payload };

        case GET_COMPLAIN_BY_ID_SUCCESS:
            return { ...state, loading: false, reply_data: "", list: action.payload };

        case GET_COMPLAIN_BY_ID_FAILURE:
            return { ...state, loading: false, reply_data: action.payload };

        //Replay Complain..
        case REPLAY_COMPLAIN:
            return { ...state, loading: true };

        case REPLAY_COMPLAIN_SUCCESS:
            return { ...state, loading: false, reply_data: action.payload };

        case REPLAY_COMPLAIN_FAILURE:
            return { ...state, loading: false, reply_data: action.payload };

        //Get Complain Type Data..
        case GET_COMPLAIN_TYPE:
            return { ...state, loading: true, getComplainTypeData : '' };

        case GET_COMPLAIN_TYPE_SUCCESS:
            return { ...state, loading: false, getComplainTypeData: action.payload };

        case GET_COMPLAIN_TYPE_FAILURE:
            return { ...state, loading: false, getComplainTypeData: action.payload };

        //Get Complain Priority Data..
        case GET_COMPLAIN_PRIORITY:
            return { ...state, loading: true, priorityList : '' };

        case GET_COMPLAIN_PRIORITY_SUCCESS:
            return { ...state, loading: false, priorityList: action.payload };

        case GET_COMPLAIN_PRIORITY_FAILURE:
            return { ...state, loading: false, priorityList: action.payload };

        default:
            return { ...state };
    }
}