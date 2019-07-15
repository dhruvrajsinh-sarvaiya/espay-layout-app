import NetInfo from '@react-native-community/netinfo';
import { ServiceUtilConstant, Events } from '../controllers/Constants';
import { showAlert, sendEvent, logger, parseIntVal } from '../controllers/CommonUtils';
import { getData, setData } from '../App';
import { loginErrCode } from '../api/helper';
import R from '../native_theme/R';
const moment = require('moment');

//To check User Input is Empty or Not Validation
//If User Input is Empty then return true else return false
export function isEmpty(value) {
    var ReturnBit = false;
    try {
        if (value === '' || value === null || value == undefined) {
            ReturnBit = true;
        }
        else {
            ReturnBit = false;
        }
    } catch (err) {
        ReturnBit = false;
    }
    return ReturnBit;
}

// function for checking value is porper otherwise return -
export function validateValue(value) {
    try {
        return isEmpty(value) ? '-' : value.toString();
    } catch (e) {
        //logger(e.message)
        return value;
    }
}

//To check if internet is connected or not
function isConnection() {
    return new Promise(resolve => {

        //Check NetWork is Available or not
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                resolve({ result: true });
            }
            else {
                resolve({ result: false });
            }
        }).catch(e => resolve({ result: false })
        );
    })
}

var dialogShowCountInternet = 0;

// for checking internet connection
export async function isInternet(isDemo = false) {

    if (isDemo) {
        if (dialogShowCountInternet == 0) {

            //Show Network Error Alert Dialog
            showAlert(R.strings.NetworkError, R.strings.NETWORK_MESSAGE, 5, () => {
                dialogShowCountInternet = 0;
            });
            dialogShowCountInternet++;
        }
        return false;
    } else {
        try {
            //fetch internet connection
            let { result } = await isConnection();
            if (!result) {
                if (dialogShowCountInternet == 0) {
                    //Show Network Error Alert Dialog
                    showAlert(R.strings.NetworkError, R.strings.NETWORK_MESSAGE, 5, () => {
                        dialogShowCountInternet = 0;
                    });
                    dialogShowCountInternet++;
                }
            }
            return result;
        } catch (e) {
            if (dialogShowCountInternet == 0) {

                //Show Network Error Alert Dialog
                showAlert(R.strings.NetworkError, R.strings.NETWORK_MESSAGE, 5, () => {
                    dialogShowCountInternet = 0;
                });
                dialogShowCountInternet++;
            }
        }
    }
}

const statusCodes = [200, 400, 403, 498, 500, 502, 503];

const loginErrorCodes = loginErrCode();

//Create Common Method to handle response commonly
export function validateResponseNew(data = { response: {}, statusCode: null, returnCode: null, errorCode: null, returnMessage: null, isList: false, enableLog: false }) {

    let dialog = {
        show: data.isList ? false : true,
        message: '',
        type: 3,
        sessionExpire: false,
    };

    try {
        //If response is array then return true
        if (Array.isArray(data.response)) {
            if (data.enableLog) logger('Response is array');
            return true;
        } else {

            let { response, statusCode, returnCode, errorCode, returnMessage, enableLog } = data;

            let stCode = statusCode === undefined ? response.statusCode : statusCode;

            if (enableLog) logger('Response is not array')

            //Get Api Return Code and Message 
            let rtCode;
            let rtMsg = "";

            //If response is not array and its object then check for statusCode is 200 or its not available.
            if (stCode === undefined || statusCodes.includes(stCode)) {

                if (enableLog) logger('Response is having success codes')

                if (returnCode !== undefined && !isEmpty(returnCode)) {

                    if (enableLog) logger('Return Code is given')
                    rtCode = returnCode;
                } else if (response.ReturnCode !== undefined) {

                    if (enableLog) logger('Response Return Code is available')
                    rtCode = response.ReturnCode;
                } else if (response.returnCode !== undefined) {

                    if (enableLog) logger('Response return Code is available')
                    rtCode = response.returnCode;
                } else {

                    if (enableLog) logger('Response return Code is not available')
                    rtCode = 1;
                }

                if (errorCode !== undefined && !isEmpty(errorCode)) {

                    if (statusCodes.includes(errorCode)) {
                        rtMsg = R.strings.SERVER_ERROR_MSG;
                    } else {
                        rtMsg = R.strings[`error.message.${data.errorCode}`];
                    }

                    if (enableLog) logger('Response Return message is available with error code')
                } else {
                    try {
                        if (returnMessage !== undefined && !isEmpty(returnMessage)) {

                            if (enableLog) logger('Return message is given')

                            rtMsg = returnMessage;
                        } else if (response.ReturnMsg !== undefined) {

                            if (enableLog) logger('Response Return message is available')
                            rtMsg = response.ReturnMsg;
                        } else if (response.returnMsg !== undefined) {

                            if (enableLog) logger('Response return message is given')
                            rtMsg = response.returnMsg;
                        } else {

                            if (enableLog) logger('Return message is not available')
                            rtMsg = R.strings.SERVER_ERROR_MSG;
                        }
                    } catch (error) {

                        if (enableLog) logger('Return Message Catch :' + error.message)
                        rtMsg = JSON.stringify(response);
                    }
                }

                //Handle failure Response of Api.
                if (rtCode != 0) {

                    if (enableLog) logger('Return Code is not 0')

                    //If uploading in server is running than displaying dialog of session expire with server message and redirect user to login
                    if (response.ErrorCode !== undefined && response.ErrorCode == 502) {
                        dialog = Object.assign({}, dialog, {
                            message: rtMsg,

                            //If msg is same as slow internet msg than set type to 3 otherwise 1
                            type: rtMsg === R.strings.SLOW_INTERNET ? 5 : 1,
                            sessionExpire: true,
                            show: rtMsg === R.strings.SLOW_INTERNET ? true : dialog.show,
                        });
                    } else {

                        dialog = Object.assign({}, dialog, {
                            message: rtMsg,

                            //If msg is same as slow internet msg than set type to 3 otherwise 1
                            type: rtMsg === R.strings.SLOW_INTERNET ? 5 : 1,
                            show: rtMsg === R.strings.SLOW_INTERNET ? true : dialog.show,
                        });
                    }

                    showValidationDialog(dialog);
                }
                return rtCode == 0;
            }
            //if statusCode includes login expiration code
            else if (stCode !== undefined && loginErrorCodes.includes(stCode)) {

                if (enableLog) logger('Response is having login error code', stCode)

                dialog = Object.assign({}, dialog, {
                    message: R.strings.SESSION_EXPIRE,
                    type: 2,
                    sessionExpire: true
                })

                showValidationDialog(dialog);
            } else {

                if (enableLog) logger('Response Error')

                try {
                    if (returnMessage != null && !isEmpty(returnMessage)) {

                        if (enableLog) logger('Return message is given')

                        rtMsg = returnMessage;
                    } else if (response.ReturnMsg != null) {

                        if (enableLog) logger('Response Return message is available')
                        rtMsg = response.ReturnMsg;
                    } else if (response.returnMsg != null) {

                        if (enableLog) logger('Response return message is given')
                        rtMsg = response.returnMsg;
                    } else {

                        if (enableLog) logger('Return message is not available')
                        rtMsg = R.strings.SERVER_ERROR_MSG;
                    }
                } catch (error) {

                    if (enableLog) logger('Return Message Catch :' + error.message)
                    rtMsg = JSON.stringify(response);
                }


                dialog = Object.assign({}, dialog, {
                    type: 1,
                    message: rtMsg,
                })

                showValidationDialog(dialog);
                return false;
            }
        }
    } catch (error) {

        if (data.enableLog) logger('Error : ' + error.message)

        dialog = Object.assign({}, dialog, {
            type: 1,
            message: error.message,
        })

        showValidationDialog(dialog);
        return false
    }
}

// for showing dialog based on API response
function showValidationDialog(dialog) {

    //To get dialogShowCount from preference
    let dialogShowCount = getData(ServiceUtilConstant.KEY_DialogCount);

    //If dialog show count is 0 then show dialog
    if (dialogShowCount == 0) {

        // If dialog's show is true or session expire is true then show dialog
        if (dialog.show || (!dialog.show && dialog.sessionExpire)) {
            let title = '';
            if (dialog.type == 2) {
                title = R.strings.SessionError;
            } else if (dialog.type == 1) {
                title = R.strings.failure + '!';
            } else {
                title = R.strings.Status;
            }
            showAlert(title, dialog.message, dialog.type, () => {

                //If session expire is true then redirect to login screen without setting count to 0
                if (dialog.sessionExpire) {

                    //Need to redirect to login
                    sendEvent(Events.SessionLogout);
                } else {

                    //Set dialog show count to 0
                    setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
                }
            });

            // Increment dialog show count
            dialogShowCount++;

            //Set dialog show count to incremented count
            setData({ [ServiceUtilConstant.KEY_DialogCount]: dialogShowCount });

        }
    }
}

// for validating google auth code
export function validateGoogleAuthCode(code) {
    try {
        //Six Digits only for Google Auth Code
        let reg = new RegExp(/^[0-9]{0,6}$/);
        return reg.test(code);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

// for checking input has alphabetic and numeric value : special character not allowed
export function validateAlphaNumeric(text) {
    try {
        // \w any word character (A-Z, a-z, 0-9).
        let reg = new RegExp(/^[0-9a-zA-Z]+$/);
        return reg.test(text);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

// for mobile number validation
export function validateMobileNumber(number) {
    try {
        //10 Digits for mobile nunber
        let reg = new RegExp(/^[0-9]{0,10}$/);
        return reg.test(number);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Password Validation
export function validatePassword(password) {
    try {
        let reg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/);
        return reg.test(password);
    } catch (error) {
        //logger(error.message)
    }
}

//get color based on its old and new value changes
export function getColorCode(oldValue, newValue, isPrimaryColor = false) {

    let color;
    let normalColor = isPrimaryColor ? R.colors.white : R.colors.textPrimary;

    if (newValue) {
        //if old currentRate and new currentRate is equal then use textPrimary color
        if (oldValue == newValue) {
            color = normalColor;
        }

        //if old value is greater then new value then use sellerPink color
        else if (oldValue > newValue) {
            color = R.colors.orange;
        }

        //if old value is less then new value then use buyerGreen color
        else if (oldValue < newValue) {
            color = R.colors.buyerGreen;
        }

        //if non of above condition true then use textPrimary color
        else {
            color = normalColor;
        }
    } else {
        color = oldValue >= 0 ? R.colors.buyerGreen : R.colors.orange;
    }

    return color;
}

//Get Remaining seconds
export function getRemainingSeconds(timerScreen) {

    //Get time and screen from storage
    let endTime = getData(ServiceUtilConstant.timerEndTime);
    let storedScreen = getData('timerScreen');

    //if stored time is found then find remaining seconds
    if (endTime) {

        //Current time 
        let now = moment().format('HH:mm:ss');

        //Convert string time to date object
        let oldTime = moment(now, 'HH:mm:ss');
        let newTime = moment(endTime, 'HH:mm:ss');

        //find duration between current time and stored time
        let duration = moment.duration(newTime.diff(oldTime));

        //if stored screen and parameter screen are same then return duration.
        if (timerScreen == storedScreen
            && parseIntVal(duration.asMinutes()) == 0 // if minutes are 0
            && parseIntVal(duration.asSeconds()) > 0 // if seconds are greater than 0
            && parseIntVal(duration.asSeconds()) <= ServiceUtilConstant.timer_time_seconds) { // if seconds are less than and equal to 40 seconds

            return parseIntVal(duration.asSeconds());
        } else {
            //Clear time from store and interval
            setData({
                timerScreen: '',
                [ServiceUtilConstant.timerEndTime]: '00:00:00'
            });
            return 0;
        }
    }
    //Clear time from store and interval
    setData({
        timerScreen: '',
        [ServiceUtilConstant.timerEndTime]: '00:00:00'
    });
    return 0;
}

// for validating only numbers
export function validateNumeric(text) {
    try {
        // \w any Numeric character (0-9).
        let reg = new RegExp(/^[0-9]+$/);
        return reg.test(text);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate URL
export function validateURL(text) {
    try {
        let reg = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
        return reg.test(text);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate IP Address
export function validateIPaddress(ipaddress) {
    try {
        let regex = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);

        if (ipaddress) {
            if (regex.test(ipaddress))
                return false;
            return true;
        }
    } catch (e) {
        return true;
    }
}

//For Validate Week
export function validWeek(Week) {
    try {
        let reg = new RegExp(/^[1-4]+$/);
        return reg.test(Week);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate Month
export function validMonth(Month) {
    try {
        let reg = new RegExp(/(^0?[1-9]$)|(^1[0-2]$)/);
        return reg.test(Month);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate Percentage
export function validPercentage(Percentage) {
    try {
        //Regex for 0.00000000 to 100.00000000
        let reg = new RegExp(/^100(\.0{0,8}?)?$|^\d{0,2}(\.\d{0,8})?$/);
        return reg.test(Percentage);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate Only Upercase and Lowercase Charcter 
export function validCharacter(Name) {
    try {
        let reg = new RegExp(/^[A-Za-z]+$/);
        return reg.test(Name);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

//For Validate Withdrawal Address
export function validWithdrawAddress(Address) {
    try {
        let reg = new RegExp(/^[0-9A-Za-z?=]+$/);
        return reg.test(Address);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

// for validating mobile number containing with comma (,) for multiple mobile numbers
export function multipleMobileNumber(number) {
    try {
        //for enter only digit and comma
        let reg = new RegExp(/^[0-9,]+$/);
        return reg.test(number);
    } catch (error) {
        //logger(error.message)
        return false;
    }
}

// Handle Flatlist item detail screen transition
export function configureTransition(scenes, screenArray = []) {
    let isCollapseExpand = false
    try {
        const prevScene = scenes[scenes.length - 2];
        const nextScene = scenes[scenes.length - 1];
        // Check array length
        if (screenArray.length > 0) {
            screenArray.map((item) => {
                if (prevScene && prevScene.route.routeName === item.prev && nextScene.route.routeName === item.next)
                    isCollapseExpand = true
            })
        }
        return isCollapseExpand
    } catch (error) {
        return isCollapseExpand
    }
}