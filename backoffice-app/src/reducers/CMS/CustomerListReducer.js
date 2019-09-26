// BO_CustomerListReducer
import {
    //add customer
    ADD_CUSTOMER,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAILURE,

    //clear data
    ADD_CUSTOMER_CLEAR,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {

    // for add data in Customer
    isAddCustomer: false,
    AddCustomerdata: null,
    AddedCustomerdata: true,

    // for edit Customer
    isEditCustomer: false,
    EditCustomerdata: null,
    EditedCustomerdata: true,

    //for delete Customer
    isDeleteCustomer: false,
    DeleteCustomerdata: null,
    DeletedCustomerdataFetch: true,
}

export default function CustomerListReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // for Add Customer 
        case ADD_CUSTOMER:
            return Object.assign({}, state, {
                isAddCustomer: true,
                AddCustomerdata: null,
            })
        // for Add Customer success
        case ADD_CUSTOMER_SUCCESS:
            return Object.assign({}, state, {
                isAddCustomer: false,
                AddCustomerdata: action.data,
            })

        // for Add Customer failure
        case ADD_CUSTOMER_FAILURE:
        // for clear added fetch from memory
        case ADD_CUSTOMER_CLEAR:
            return Object.assign({}, state, {
                isAddCustomer: false,
                AddCustomerdata: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}