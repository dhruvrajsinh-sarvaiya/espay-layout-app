/**
 * Device Management Reducers (code added by Parth Jani 18-9-2018)
 */
import { NotificationManager } from 'react-notifications';
import {
    DEVICE_MANAGEMENT,
    DEVICE_MANAGEMENT_SUCCESS,
    DEVICE_MANAGEMENT_FAIL,
} from 'Actions/types';

/**
 * initial Device Management
 */
const INIT_STATE = {
    deviceManagementList: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case DEVICE_MANAGEMENT:
        //console.log("Call Reducers - Device Management");
          //console.log(state);
            return { ...state, loading: true };

        case DEVICE_MANAGEMENT_SUCCESS:
            //NotificationManager.success('Device Management List Found');
            //console.log("Success Reducer",action)
            return { ...state, loading: false, deviceManagementList: action.payload };

        case DEVICE_MANAGEMENT_FAIL:
            ///console.log("failed Reducer",action);
            NotificationManager.error(action.payload);
            return { ...state, loading: false };
        default: return { ...state };
    }
}
