/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : For CRM Form Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    ADD_NEW_CRMFORM
} from 'Actions/types';

//import function from action
import {
    addNewCrmFormSuccess,
    addNewCrmFormFailure,
} from 'Actions/ZohoCrmForm';   

//Function check API call for Crm Form Add..
const addNewCrmFormRequest = async (crmdata) =>
    await api.post('/api/private/v1/zohocrm/addCrmForm', {crmdata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));
    

//Function for Add CRM Form API
function* addNewCrmFormyAPI({payload}) {
    try {
        const response = yield call(addNewCrmFormRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(addNewCrmFormSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addNewCrmFormFailure(response.data));
        }
    } catch (error) {
        yield put(addNewCrmFormFailure(error));
    }
}

// add New Survey 
export function* addNewCrmForm() {
    yield takeEvery(ADD_NEW_CRMFORM, addNewCrmFormyAPI);
}

export default function* rootSaga() {
    yield all([
        fork(addNewCrmForm),
    ]);
}