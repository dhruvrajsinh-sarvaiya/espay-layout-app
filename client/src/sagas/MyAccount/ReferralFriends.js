/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Friends Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    REFERRAL_FRIENDS_LIST
} from 'Actions/types';

//Action methods..
import {
    referralFriendsSuccess,
    referralFriendsFailure
} from 'Actions/MyAccount';

//Function check API call for Referral Friends..
const getReferralFriendsAPIRequest = async (request) =>
    await api.get('transHistory.js')
        .then(response => response)
        .catch(error => error);

const data = [
    ["abcdefgh@gmail.com", "2018-06-08"],
    ["ijklmnop@gmail.com", "2018-06-06"],
    ["qrstuvwx@gmail.com", "2018-06-04"],
    ["yzabcdef@gmail.com", "2018-06-03"],
    ["ghijklmn@gmail.com", "2018-06-01"],
];

const errorMsg = 'No data found';

//Function for Referral Friends
function* referralFriendsAPI({ payload }) {
    //console.log('Referral Friends', payload);
    try {
        //const response = yield call(getReferralFriendsAPIRequest,payload);        
        if (data.length > 0) {
            yield put(referralFriendsSuccess(data));
        } else {
            yield put(referralFriendsFailure(errorMsg));
        }
    } catch (error) {
        yield put(referralFriendsFailure(error));
    }
}

/* Create Sagas method for referralFriends */
export function* referralFriendsSagas() {
    yield takeEvery(REFERRAL_FRIENDS_LIST, referralFriendsAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(referralFriendsSagas)
    ]);
}
