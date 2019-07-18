import { SAVE_OBJECT_PREFERENCE, ACTION_LOGOUT } from '../actions/ActionTypes';
import { ServiceUtilConstant } from '../controllers/Constants';
import { AppConfig } from '../controllers/AppConfig';
import DeviceInfo from 'react-native-device-info';
import { Dimensions } from 'react-native';

const initialValue = {
    [ServiceUtilConstant.KEY_Theme]: 'lightTheme',
    [ServiceUtilConstant.KEY_Locale]: DeviceInfo.getDeviceLocale().split('-')[0], // To Fetch Device Locale
    [ServiceUtilConstant.FCMToken]: '',
    [ServiceUtilConstant.KEY_PREF_FIRST_TIME]: true,
    [ServiceUtilConstant.KEY_SubscribeNoti]: false,
    [ServiceUtilConstant.KEY_IsBlockedUser]: false,
    [ServiceUtilConstant.KEY_DialogCount]: 0,
    [ServiceUtilConstant.FIRSTNAME]: '',
    [ServiceUtilConstant.LASTNAME]: '',
    [ServiceUtilConstant.KEY_CurrencyPair]: {
        PairName: AppConfig.initialPair
    },
    [ServiceUtilConstant.KEY_IsMargin]: false,
    [ServiceUtilConstant.KEY_IsPlanChange]: 0,
    [ServiceUtilConstant.KEY_SocialProfilePlan]: false,
    [ServiceUtilConstant.KEY_DIMENSIONS]: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        isPortrait: Dimensions.get('window').width <= Dimensions.get('window').height
    },
    [ServiceUtilConstant.ACCESS_TOKEN]: null,
    [ServiceUtilConstant.REFRESH_TOKEN]: null,
    [ServiceUtilConstant.ID_TOKEN]: null,
}

//Common Preference reducer
function preference(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialValue;
    }

    switch (action.type) {

        case ACTION_LOGOUT: {
            return Object.assign({}, state, {
                [ServiceUtilConstant.ACCESS_TOKEN]: null,
                [ServiceUtilConstant.REFRESH_TOKEN]: null,
                [ServiceUtilConstant.ID_TOKEN]: null,
                [ServiceUtilConstant.KEY_Expiration]: null,
                [ServiceUtilConstant.LOGINUSERNAME]: '',
                [ServiceUtilConstant.LOGINPASSWORD]: '',
                [ServiceUtilConstant.ALLOWTOKEN]: '',
                [ServiceUtilConstant.Email]: '',
                [ServiceUtilConstant.MOBILENO]: '',
                [ServiceUtilConstant.KEY_IsBlockedUser]: false,
                [ServiceUtilConstant.KEY_CurrencyPair]: {
                    PairName: AppConfig.initialPair
                },
                [ServiceUtilConstant.KEY_IsMargin]: false,
                [ServiceUtilConstant.KEY_IsPlanChange]: 0,
                [ServiceUtilConstant.KEY_SocialProfilePlan]: false,
            });
        }

        case SAVE_OBJECT_PREFERENCE:

            let object = action.object;

            return Object.assign({}, state, object);

        default:
            return state;
    }
}

export default preference;