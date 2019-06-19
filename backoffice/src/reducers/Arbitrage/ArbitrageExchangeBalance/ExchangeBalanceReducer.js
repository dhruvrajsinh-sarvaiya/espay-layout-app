/* 
    Developer : Vishva shah
    Date : 07-06-2019
    File Comment : Arbitrage Exchange Balance Reducer
*/
import {
	// list...
	GET_EXCHANGEBALANCE_LIST,
	GET_EXCHANGEBALANCE_LIST_SUCCESS,
	GET_EXCHANGEBALANCE_LIST_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
	loading: false,
	ExchangeBalanceList: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// Arbitrage exchange balance list...
		case GET_EXCHANGEBALANCE_LIST:
			return { ...state, loading: true };
		case GET_EXCHANGEBALANCE_LIST_SUCCESS:
			return { ...state, loading: false, ExchangeBalanceList: action.payload.Data };
		case GET_EXCHANGEBALANCE_LIST_FAILURE:
			return { ...state, loading: false, ExchangeBalanceList: [] };
		default:
			return { ...state };
	}
};
