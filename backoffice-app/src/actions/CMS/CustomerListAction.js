import {
    // for add data in Customer
    ADD_CUSTOMER,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAILURE,

    //clear data
    ADD_CUSTOMER_CLEAR,
} from '../ActionTypes'
import { action } from '../../actions/GlobalActions';

// ------------------ for add Customer------------------

//To Add Customer 
export function AddCustomerData(AddCustomer) {
    return action(ADD_CUSTOMER, { AddCustomer })
}

//On Add Customer success result
export function AddCustomerSuccess(data) {
    return action(ADD_CUSTOMER_SUCCESS, { data })
}

//On Add Customer Failure
export function AddCustomerFailure() {
    return action(ADD_CUSTOMER_FAILURE)
}

// clear Customer
export function AddCustomerClear() {
    return action(ADD_CUSTOMER_CLEAR)
}