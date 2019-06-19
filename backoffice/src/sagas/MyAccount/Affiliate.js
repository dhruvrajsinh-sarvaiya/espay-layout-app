/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Display Affiliate saga
*/
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import { AFFILIATE_SIGNUP_REPORT, AFFILIATE_COMMISSION_REPORT } from "Actions/types";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

// import functions from action
import {
    AffiliateSignupReportSuccess,
    AffiliateSignupReportFailure,
    AffiliateCommissionReportSuccess,
    AffiliateCommissionReportFailure
} from "Actions/MyAccount";

//static Data
const response = {
    "Data":
        [
            {
                affiliateid: 1,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 1,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "16/02/2019",
                to_date: "17/02/2019",

            },
            {
                affiliateid: 2,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 2,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
            },
            {
                affiliateid: 3,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 1,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "14/02/2019",
                to_date: "15/02/2019",

            },
            {
                affiliateid: 4,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 2,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "16/02/2019",
                to_date: "17/02/2019",

            },
            {
                affiliateid: 5,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 1,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
            },
            {
                affiliateid: 6,
                name: "Jayesh",
                username: "Dhola",
                email: "jayesh@gmail.com",
                referred: "0",
                status: 2,
                sales: "$0.00",
                balance: "$0.00",
                acceptedterms: "YES",
                from_date: "14/02/2019",
                to_date: "15/02/2019",

            }],

    "TotalCount": 6,
    "ReturnCode": 0,
    "ReturnMsg": "Successfully get Affiliate Report filter data.",
    "ErrorCode": 1,
    "statusCode": 200
}

const cmsResponse = {
    "Data":
        [
            {
                affiliate: 1,
                user: "Dhola",
                type: 1,
                commission: "21%",
                level:1,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
                

            },
            {
                affiliate: 2,
                user: "Dhola",
                type: 2,
                commission: "21%",
                level:3,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
               
            },
            {
                affiliate: 3,
                user: "Dhola",
                type: 3,
                commission: "21%",
                level:1,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "14/02/2019",
                to_date: "15/02/2019",
               
            },
            {
                affiliate: 4,
                user: "Dhola",
                type: 5,
                commission: "21%",
                level:2,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
               
            },
            {
                affiliate: 5,
                user: "Dhola",
                type: 4,
                commission: "21%",
                level:1,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
                
            },
            {
                affiliate: 6,
                user: "Dhola",
                type: 1,
                commission: "21%",
                level:1,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "14/02/2019",
                to_date: "15/02/2019",
              

            },
            {
                affiliate: 7,
                user: "Dhola",
                type: 1,
                commission: "21%",
                level:2,
                status: 4,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
                

            },
            {
                affiliate: 8,
                user: "Dhola",
                type: 2,
                commission: "21%",
                level:3,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
               
            },
            {
                affiliate: 9,
                user: "Dhola",
                type: 3,
                commission: "21%",
                level:1,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "14/02/2019",
                to_date: "15/02/2019",
               

            },
            {
                affiliate: 10,
                user: "Dhola",
                type: 5,
                commission: "21%",
                level:1,
                status: 4,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
                

            },
            {
                affiliate: 11,
                user: "Dhola",
                type: 5,
                commission: "21%",
                level:1,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
            },
            {
                affiliate: 12,
                user: "Dhola",
                type: 1,
                commission: "21%",
                level:5,
                status: 4,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
                

            },
            {
                affiliate: 13,
                user: "Dhola",
                type: 2,
                commission: "21%",
                level:3,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
               
            },
            {
                affiliate: 14,
                user: "Dhola",
                type: 3,
                commission: "21%",
                level:3,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "14/02/2019",
                to_date: "15/02/2019",
                

            },
            {
                affiliate: 15,
                user: "Dhola",
                type: 5,
                commission: "21%",
                level:1,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
               

            },
            {
                affiliate: 16,
                user: "Dhola",
                type: 3,
                commission: "21%",
                level:3,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
               
            },
            {
                affiliate: 17,
                user: "Dhola",
                type: 2,
                commission: "21%",
                level:1,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
              
            },
            {
                affiliate: 18,
                user: "Dhola",
                type: 1,
                commission: "21%",
                level:3,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "14/02/2019",
                to_date: "15/02/2019",
              

            },
            {
                affiliate: 19,
                user: "Dhola",
                type: 5,
                commission: "21%",
                level:2,
                status: 1,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "16/02/2019",
                to_date: "17/02/2019",
                

            },
            {
                affiliate: 20,
                user: "Dhola",
                type: 4,
                commission: "21%",
                level:4,
                status: 2,
                sales_amount: "2.00",
                affiliate_earnings: "0.23",
                from_date: "12/02/2019",
                to_date: "13/02/2019",
                
            },],

    "TotalCount": 20,
    "ReturnCode": 0,
    "ReturnMsg": "Successfully get Affiliate Report filter data.",
    "ErrorCode": 1,
    "statusCode": 200
}

//Display Affiliate Signup report API
function* AffiliateReportApi({ payload }) {
    //var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, '/api/SignUpReport/GetUserSignUpCount/', {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(AffiliateSignupReportSuccess(response));
        } else {
            yield put(AffiliateSignupReportFailure(response));
        }
    } catch (error) {
        yield put(AffiliateSignupReportFailure(error));
    }
}

//Display Affiliate Commission report API
function* AffiliateCommissionApi({ payload }) {
    //var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerGetAPI, '/api/SignUpReport/GetUserSignUpCount/', {}, headers);
    try {
        if (cmsResponse.ReturnCode === 0) {
            yield put(AffiliateCommissionReportSuccess(cmsResponse));
        } else {
            yield put(AffiliateCommissionReportFailure(cmsResponse));
        }
    } catch (error) {
        yield put(AffiliateCommissionReportFailure(error));
    }
}

//Display Affiliate Signup report
function* AffiliateReportData() {
    yield takeEvery(AFFILIATE_SIGNUP_REPORT, AffiliateReportApi);
}

//Display Affiliate Commission report
function* AffiliateCommissionData() {
    yield takeEvery(AFFILIATE_COMMISSION_REPORT, AffiliateCommissionApi);
}

export default function* rootSaga() {
    yield all([
        fork(AffiliateReportData),
        fork(AffiliateCommissionData)
    ]);
}