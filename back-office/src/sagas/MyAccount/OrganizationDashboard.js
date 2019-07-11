/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Organization Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import {  ORGANIZATION_DASHBOARD } from "Actions/types";
// import functions from action
import { getOrganizationDataSuccess, getOrganizationDataFailure } from "Actions/MyAccount";

const orgDashboardData = {
    org_info : {
        name : 'JBSL',
        owner: 'Joshi Biztech'
    },
    application_count : 10,
    user_count : 50,
    admin_count : 20,
    customer_count : 1000,
    group_count : 10,
    role_count : 5,
    language_count : 3,
    membership_count : 5,
    email_provider_count : 5,
    social_login_count : 10,
    twofa_count : 2
}

//Display Organization Data
function* organizationDashboardDataAPI() {
    try {
        yield put(getOrganizationDataSuccess(orgDashboardData));
    } catch (error) {
        yield put(getOrganizationDataFailure(error));
    }
}

//Display Organization Data
function* organizationDashboardData() {
    yield takeEvery(ORGANIZATION_DASHBOARD, organizationDashboardDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(organizationDashboardData)
    ]);
}