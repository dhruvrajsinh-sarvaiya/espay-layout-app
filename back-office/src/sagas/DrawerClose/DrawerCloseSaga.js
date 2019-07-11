import { all, fork, put, takeEvery } from "redux-saga/effects";
import {
    DRAWER_CLOSE,
} from "Actions/types";
import {
    DrawerCloseSuccess
} from "Actions/DrawerClose";

//method to send array to reducer
function* DrawerCloseArray({ payload }) {
    yield put(DrawerCloseSuccess(payload));
}
//method for call deawerclose
export function* DrawerClose() {
    yield takeEvery(
        DRAWER_CLOSE,
        DrawerCloseArray
    );
}
export default function* rootSaga() {
    yield all([
        fork(DrawerClose),
    ]);
}
