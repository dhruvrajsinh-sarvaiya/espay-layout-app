import {
    put, call, takeLatest
} from 'redux-saga/effects';
import { ABOUTUS_FETCH_DATA } from '../actions/ActionTypes';
import { passurl } from './api'
import { aboutUsFetchDataSuccess, aboutUsFetchDataFailure } from '../actions/CMS/AboutUsAction';

function* AboutUsFatchData() {
    try {
        const data = yield call(passurl)
        yield put(aboutUsFetchDataSuccess(data))
    } catch (e) {
        yield put(aboutUsFetchDataFailure())
    }
}

function* AboutUsSaga() {
    yield takeLatest(ABOUTUS_FETCH_DATA, AboutUsFatchData)
}
export default AboutUsSaga;