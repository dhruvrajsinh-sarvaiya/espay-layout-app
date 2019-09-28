// BOContactUsSaga
import { put, call, takeLatest } from 'redux-saga/effects'
import {
    GET_CONTACT_US_LIST,
} from '../../actions/ActionTypes';
import {
    GetContactusListSuccess, GetContactusListFailure
} from '../../actions/CMS/ContactUsAction';

// ---------------------------------------------fetching contactuslist
function* ContactusListFatchData({ payload }) {
    try {

        // To call contact us list api
        const data = yield call(ContactUsListget)

        // To set contact us list success response to reducer
        yield put(GetContactusListSuccess(data))
    } catch (e) {

        // To set contact us list success response to reducer
        yield put(GetContactusListFailure())
    }
}

//pass contactuslist
export function ContactUsListget() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(responce)
        }, 1000)
    })
}

//call api
function* ContactUsSaga() {
    yield takeLatest(GET_CONTACT_US_LIST, ContactusListFatchData)
}

export default ContactUsSaga;


const responce = {
    "ReturnCode": "0", "ReturnMessage": "Success Data", "List": [
        {
            "id": '01', "email": 'hellotestdemo@gmail.com', "subject": 'test subject',
            "description": 'testDescriptionnjafnfnkjfnsjkffjbnsfsfjfnbsfsfnhjfdbsbsbnwhbwhwbwbhbhwbe',
            "date": '2018-12-03T10:15:30',
        },
        {
            "id": '02',
            "email": 'testdemo@gmail.com', "subject": 'Trading Request',
            "description": 'for query about Trading',
            "date": '2018-12-03T10:15:30',
        },
        {
            "id": '03', "email": 'Abc.123@gmail.com',
            "subject": 'Withdrawal Request',
            "description": 'for query about Withdraw', "date": '2018-12-03T10:15:30',
        },
        {
            "id": '04',
            "email": 'demotrading@gmail.com',
            "subject": 'Deposit Request', "description": 'for query about Deposit',
            "date": '2018-12-03T10:15:30',
        },
        {
            "id": '05',
            "email": 'helootrading@gmail.com', "subject": 'Ledger Request',
            "description": 'for query about Ledger',
            "date": '2018-12-03T10:15:30',
        },
    ]
}