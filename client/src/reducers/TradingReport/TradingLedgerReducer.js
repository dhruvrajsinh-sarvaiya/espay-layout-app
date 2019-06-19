/**
 * Auther : Nirmit Waghela
 * Created : 3/10/2018
 * Trading Ledger Reducer
 */
import { NotificationManager } from 'react-notifications';

// import neccessary actions types
import { 
    TRADING_LEDGER,
    TRADING_LEDGER_SUCCESS,
    TRADING_LEDGER_FAILURE,
    TRADING_LEDGER_REFRESH,
} from 'Actions/types';

// define intital state for transcation history list
const INIT_STATE = {
    loading: false,
    tradingledgerList : []
};

// this export is used to handle action types and its function based on Word which is define in 
export default (state = INIT_STATE, action) => {
    
    switch (action.type) {

        case TRADING_LEDGER:
            return { ...state, loading: true };

        case TRADING_LEDGER_REFRESH:
            return { ...state, loading: true , tradingledgerList: []};

        case TRADING_LEDGER_SUCCESS:
            
            //NotificationManager.success('Trading List Successfully!');
            return { ...state, loading: false, tradingledgerList: action.payload };

        case TRADING_LEDGER_FAILURE:
            
            //NotificationManager.error('Data not Found!');
            return { ...state, loading: false ,tradingledgerList: [] };

        default: return { ...state };
    }
}
