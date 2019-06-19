/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-10-2018
    UpdatedDate : 21-11-2018
    Description : For ContactUs Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_CONTACTUS
} from 'Actions/types';

//import function from action
import {
    getContactUsSuccess,
    getContactUsFailure
} from 'Actions/ContactUs';

/**
 * Send Add ContactUs Request To Server
 */
const getContactUsRequest = async (contactusdata) => await api.get('/api/private/v1/contactus/listContactUs/'+contactusdata.page+'/'+contactusdata.rowsPerPage+'/'+contactusdata.searchValue+'/'+contactusdata.orderBy+'/'+contactusdata.sortOrder)
               .then(response => response.data)
               .catch(error => JSON.parse(JSON.stringify(error.response))); 
	
/**
 * Get ContactUs data From Server
 */
function* getContactUsFromServer({payload}) {

    try {
        const response = yield call(getContactUsRequest,payload);
		
        if (typeof response.data != 'undefined' && response.responseCode == 0) {
            yield put(getContactUsSuccess(response));
        } else {
            yield put(getContactUsFailure(response));
        }

    } catch (error) {
        yield put(getContactUsFailure(error));
    }
}

/**
 * Get ContactUs
 */
export function* getContactUs() {
    
    yield takeEvery(GET_CONTACTUS, getContactUsFromServer);
}

/**
 * ContactUs Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getContactUs),
    ]);
}