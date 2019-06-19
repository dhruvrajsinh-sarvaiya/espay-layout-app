/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-09-2018
    UpdatedDate : 20-11-2018
    Description : ContactUs Saga Actions For Call API
	Changed by Jayesh on 20-11-2018 Complete Contact Module
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    ADD_NEW_CONTACTUS,
} from 'Actions/types';

import {
    addContactusSuccess,
    addContactusFailure,
} from 'Actions/Contactus';

/**
 * Send Contact Request To Server
 */
const addNEWContact = async (contactdata) =>
    await api.post('/api/private/v1/contactus/addContact', {contactdata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));	

/* const addNEWContact = async (contactdata) =>
    await api.post('/api/private/v1/contactus/addContact', contactdata)
        .then(response => response)
        .catch(error =>error); */		
/**
 * Add Contact data to Server
 */
function* addContactusServer({payload}) {
    try {
		
		/* const formData = new FormData();
		formData.append('attachedFile', payload.attachedFile);
		formData.append('contactdata', JSON.stringify(payload)); 
		const response = yield call(addNEWContact, formData);
		*/
	
        const response = yield call(addNEWContact, payload);
        //validate if data found in response 
        if (typeof response.data != undefined && response.data.responseCode==0) {
            yield put(addContactusSuccess(response.data));
        } else {
            yield put(addContactusFailure(response.data));
        }
    } catch (error) {
        yield put(addContactusFailure(error));
    }
}

/**
 * Add Contact Us in Saga
 */
export function* addNewContactUs() {
    yield takeEvery(ADD_NEW_CONTACTUS, addContactusServer);
}


/**
 * Add Contact Us in Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(addNewContactUs)
    ]);
}