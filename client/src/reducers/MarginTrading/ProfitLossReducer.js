/* 
    Developer : Vishva shah
    Date : 18-04-2019
    File Comment : profit loss report reducer
*/
import {
    //list
    PROFIT_LOSS_LIST,
	PROFIT_LOSS_LIST_SUCCESS,
	PROFIT_LOSS_LIST_FAILURE,

} from 'Actions/types';

const INITIAL_STATE = {
    loading: false,
    profitLossList: [],
    DetailedData:[],
    TotalCount: 0

}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFIT_LOSS_LIST:
            return { ...state, loading: true, profitLossList: [],DetailedData:[], TotalCount: 0 }
        case PROFIT_LOSS_LIST_SUCCESS:
            return { ...state, loading: false, profitLossList: action.payload.Data , TotalCount: action.payload.TotalCount }
        case PROFIT_LOSS_LIST_FAILURE:
            return { ...state, loading: false, profitLossList: [],DetailedData:[], TotalCount: 0 }

        default:
            return { ...state };
    }
}