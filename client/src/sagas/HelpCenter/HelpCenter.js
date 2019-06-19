/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : HelpCenter Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_HELPMANUALMODUALS,
    GET_HELPMANUALS_BY_ID
} from 'Actions/types';

//import function from action
import {
    getHelpManualModulesSuccess,
    getHelpManualModulesFailure,
    getHelpManualByIdSuccess,
    getHelpManualByIdFailure
} from 'Actions/HelpCenter';

//Function check API call for HelpManualModule Form Data..
const getHelpManualModuleRequest = async () =>
    await api.get('/api/private/v1/helpmanualmodule/listHelpManualModule/')
        .then(response => response)
        .catch(error => error);

const getHelpManualByIdRequest = async (moduleId) =>
        await api.get('/api/private/v1/helpmanual/getHelpManualByModuleId/'+moduleId)
            .then(response => response)
            .catch(error => JSON.parse(JSON.stringify(error.response))); 

//Function for Get HelpManualModule Data API
function* getHelpManualModuleAPI({ payload }) {
    try 
    {
        const response = yield call(getHelpManualModuleRequest, payload);
        
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getHelpManualModulesSuccess(response.data.data));
        }else{
            yield put(getHelpManualModulesFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getHelpManualModulesFailure(error));
    }
}

//Function for Get HelpManual By ID API
function* getHelpManualByIdAPI({payload}) {
    try {
        const response = yield call(getHelpManualByIdRequest, payload);
        
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getHelpManualByIdSuccess(response.data.data));
        }else {
            yield put(getHelpManualByIdFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getHelpManualByIdFailure(error));
    }
}

//Get HelpManualModule
export function* getHelpManualModules() {
    yield takeEvery(GET_HELPMANUALMODUALS, getHelpManualModuleAPI);
}


//Get HelpManual by Id
export function* getHelpManualById() {
    yield takeEvery(GET_HELPMANUALS_BY_ID, getHelpManualByIdAPI);
}

//HelpManualModule Root Saga
export default function* rootSaga() {
    yield all([
        fork(getHelpManualModules),
        fork(getHelpManualById)
    ]);
}