import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getOpenPositionReportSuccess, getOpenPositionReportFailure } from '../../actions/Margin/OpenPositionReportActions';
import { GET_OPEN_POSITION_REPORT } from '../../actions/ActionTypes';

export default function* OpenPositionReportSaga() {
    // To register Get Open Position Report method
    yield takeEvery(GET_OPEN_POSITION_REPORT, getOpenPositionReport);
}

function* getOpenPositionReport({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        
        let obj = {}
        if (payload.PairId !== undefined && payload.PairId !== '') {
            obj = {
                ...obj,
                PairId: payload.PairId
            }
        }
        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj,
                UserID: payload.UserId
            }
        }

        // To call Get Get Open Position Report Data Api
        const data = yield call(swaggerGetAPI, Method.GetOpenPosition + queryBuilder(obj), obj, headers);

        // To set Get Open Position Report success response to reducer
        yield put(getOpenPositionReportSuccess(data));

    } catch (error) {
        // To set Get Open Position Report failure response to reducer
        yield put(getOpenPositionReportFailure(data));
    }
}