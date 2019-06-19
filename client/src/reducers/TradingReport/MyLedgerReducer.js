/**
 * Auther : Tejas Gauswami
 * Created : 29/10/2018
 * My Ledger Reducer
 */
import { NotificationManager } from 'react-notifications';

// import neccessary actions types
import { 
    MY_LEDGER,
    MY_LEDGER_SUCCESS,
    MY_LEDGER_FAILURE,    
} from 'Actions/types';

// define intital state for My Ledger List
const INIT_STATE = {
    loading: false,
    myLedgerList : [],
    errorCode:0
};

// this export is used to handle action types and its function based on Word which is define in 
export default (state = INIT_STATE, action) => {
    
    switch (action.type) {

        case MY_LEDGER:
            return { ...state, loading: true };

        case MY_LEDGER_SUCCESS:
            
            //NotificationManager.success('Trading List Successfully!');
            return { ...state, loading: false, myLedgerList: action.payload, errorCode:0 };

        case MY_LEDGER_FAILURE:
            
            //NotificationManager.error('Data not Found!');
            return { ...state, loading: false ,myLedgerList: [], errorCode:action.payload };

        default: return { ...state };
    }
}
