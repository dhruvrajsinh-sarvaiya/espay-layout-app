/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Open Orders Reducers
 */
import { NotificationManager } from 'react-notifications';

// import neccessary actions types
import { 
    OPEN_ORDERS, 
    OPEN_ORDERS_SUCCESS, 
    OPEN_ORDERS_FAILURE,
    OPEN_ORDERS_REFRESH,
} from 'Actions/types';

// define intital state for open orders list
const INIT_STATE = {
    loading: false,
    openOrdersList : [],
    errorCode:[]
};

// this export is used to handle action types and its function based on Word which is define in 
export default (state = INIT_STATE, action) => {
    
    switch (action.type) {

        case OPEN_ORDERS:
            return { ...state, loading: true };

        case OPEN_ORDERS_REFRESH:
            return { ...state, loading: true , openOrdersList: []};

        case OPEN_ORDERS_SUCCESS:
            
           // NotificationManager.success('Open Orders List Successfully!');
            return { ...state, loading: false, openOrdersList: action.payload,errorCode:[] };

        case OPEN_ORDERS_FAILURE:
            
           // NotificationManager.error('Data not Found!');
            return { ...state, loading: false ,openOrdersList: [],errorCode:action.payload };

        default: return { ...state };
    }
}
