import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { getTotalComplainCountSuccess, getTotalComplainCountFailure, getComplainListSuccess, getComplainListFailure, replyComplainSuccess, replyComplainFailure, getComplainByIdSuccess, getComplainByIdFailure } from '../../actions/account/HelpAndSupportActions';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, slowInternetStaticResponse } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { TOTAL_COMPLAIN_COUNT, GET_COMPLAIN_LIST, REPLY_COMPLAIN, GET_COMPLAIN_BY_ID } from '../../actions/ActionTypes';
import { getIPAddress, parseIntVal } from '../../controllers/CommonUtils';

export default function* HelpAndSupportSaga() {
    yield takeEvery(TOTAL_COMPLAIN_COUNT, getTotalComplainCount);
    yield takeEvery(GET_COMPLAIN_LIST, getComplainList);
    yield takeEvery(REPLY_COMPLAIN, replyComplain);
    yield takeEvery(GET_COMPLAIN_BY_ID, getComplainById);
}

// Generator for Complain List
function* getComplainList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let reqUrl = Method.GetAllComplainReport + '/' + payload.PageIndex + '/' + payload.Page_Size

        let obj = {}
        // FromDate is not undefined and empty
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }

        // ToDate is not undefined and empty
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        // ComplainId is not undefined and empty
        if (payload.ComplainId !== undefined && payload.ComplainId !== '') {
            obj = {
                ...obj,
                ComplainId: payload.ComplainId
            }
        }
        // EmailId is not undefined and empty
        if (payload.EmailId !== undefined && payload.EmailId !== '') {
            obj = {
                ...obj,
                EmailId: payload.EmailId
            }
        }
        // MobileNo is not undefined and empty
        if (payload.MobileNo !== undefined && payload.MobileNo !== '') {
            obj = {
                ...obj,
                MobileNo: payload.MobileNo
            }
        }
        // MobileNo is not undefined and empty
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: payload.Status
            }
        }
        // TypeId is not undefined and empty
        if (payload.TypeId !== undefined && payload.TypeId !== '') {
            obj = {
                ...obj,
                TypeId: parseIntVal(payload.TypeId)
            }
        }
        // PriorityId is not undefined and empty
        if (payload.PriorityId !== undefined && payload.PriorityId !== '') {
            obj = {
                ...obj,
                PriorityId: parseIntVal(payload.PriorityId)
            }
        }

        let newReq = reqUrl + queryBuilder(obj)

        // To call complaint list Api
        const data = yield call(swaggerGetAPI, newReq, {}, headers);

        // To set complaint list success response to reducer
        yield put(getComplainListSuccess(data));

    } catch (error) {
        console.warn('error', error.message)
        // To set complaint list Failure response to reducer
        yield put(getComplainListFailure());
    }
}

//Display Help & Support Dashbord Data
function* getTotalComplainCount({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call complaint total count Api 
        const data = yield call(swaggerGetAPI, Method.GetTotalNoCount + '?Type=0&ComplainStatus=0&UserId=0', {}, headers);

        // To set complaint total count success response to reducer
        yield put(getTotalComplainCountSuccess(data));

    } catch (error) {
        // To set complaint total count Failure response to reducer
        yield put(getTotalComplainCountFailure());
    }
}

function* replyComplain({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        payload.IPAddress = yield call(getIPAddress)

        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(replyComplainSuccess(slowInternetStaticResponse()));
        } else {

            // To call replay complaint  Api
            const data = yield call(swaggerPostAPI, Method.AddRiseComplain, payload, headers);

            // To set replay complaint success response to reducer           
            yield put(replyComplainSuccess(data))
        }

    } catch (error) {
        // To set replay complaint Failure response to reducer
        yield put(replyComplainFailure())
    }
}

function* getComplainById({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call complaint by id Api
        const data = yield call(swaggerGetAPI, Method.GetComplain + '?ComplainId=' + payload.ComplainId, {}, headers);

        // To set  complaint by id success response to reducer
        yield put(getComplainByIdSuccess(data))

    } catch (error) {
        // To set  complaint by id Failure response to reducer
        yield put(getComplainByIdFailure())
    }
}
