/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Reducers
 */
import { NotificationManager } from 'react-notifications';

// import neccessary actions types
import { 
    TRANSACTION_HISTORY, 
    TRANSACTION_HISTORY_SUCCESS, 
    TRANSACTION_HISTORY_FAILURE,
    TRANSACTION_HISTORY_REFRESH,
} from 'Actions/types';

// define intital state for transcation history list
const INIT_STATE = {
    loading: false,
    transactionList : [],
    errorCode:[]
};

// this export is used to handle action types and its function based on Word which is define in 
export default (state = INIT_STATE, action) => {
    
    switch (action.type) {

        case TRANSACTION_HISTORY:
            return { ...state, loading: true };

        case TRANSACTION_HISTORY_REFRESH:
            return { ...state, loading: true , transactionList: []};

        case TRANSACTION_HISTORY_SUCCESS:
            
           // NotificationManager.success('Transaction History List Successfully!');
            return { ...state, loading: false, transactionList: action.payload,errorCode:[] };

        case TRANSACTION_HISTORY_FAILURE:
            
            //NotificationManager.error('Data not Found!');
            return { ...state, loading: false ,transactionList: [] ,errorCode:action.payload };

        default: return { ...state };
    }
}
