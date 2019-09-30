import {

    //referal system dashboard
    REFERRAL_SYSTEM_DASHBOARD_DATA,
    REFERRAL_SYSTEM_DASHBOARD_DATA_SUCCESS,
    REFERRAL_SYSTEM_DASHBOARD_DATA_FAILURE,

    //chanel list
    GET_ADMIN_REFERRAL_CHANNNEL_LIST,
    GET_ADMIN_REFERRAL_CHANNNEL_LIST_SUCCESS,
    GET_ADMIN_REFERRAL_CHANNNEL_LIST_FAILURE,
} from '../ActionTypes';
import { action } from '../GlobalActions';

//To fetch data
export function getReferalSystemDashData() {
    return action(REFERRAL_SYSTEM_DASHBOARD_DATA)
}
//On success result
export function getReferalSystemDashDataSuccess(data) {
    return action(REFERRAL_SYSTEM_DASHBOARD_DATA_SUCCESS, { data })
}
//On Failure
export function getReferalSystemDashDataFailure() {
    return action(REFERRAL_SYSTEM_DASHBOARD_DATA_FAILURE)
}

//To fetch data
export function getAdminRefChannelList(payload) {
    return action(GET_ADMIN_REFERRAL_CHANNNEL_LIST, { payload })
}
//On success result
export function getAdminRefChannelListSuccess(data) {
    return action(GET_ADMIN_REFERRAL_CHANNNEL_LIST_SUCCESS, { data })
}
//On Failure
export function getAdminRefChannelListFailure() {
    return action(GET_ADMIN_REFERRAL_CHANNNEL_LIST_FAILURE)
}