import { ServiceUtilConstant, Events } from './Constants';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Moment from 'moment'
import { AppConfig } from './AppConfig';
import { getData, setData } from '../App';
import { isEmpty } from '../validations/CommonValidation';
import R from '../native_theme/R';
import { emitGlobalEvent, addListenerGlobalEvent } from './GlobalEventEmitter';
import { navigate } from '../components/Navigation';
import { DialogTypes } from '../components/AlertModal';
import arraySort from 'array-sort';

export function getCurrentTime() {
    try {
        return convertTime();
    } catch (e) {
        //handle catch part
    }
}

// Convert date/time field and return string
export function convertDateTime(dateTime, format = 'YYYY-MM-DD HH:mm:ss A', addBit = true) {
    try {
        let newdate = Moment(dateTime, format).unix()
        let addTime = newdate * 1000;

        if (addBit) {
            return Moment(addTime).add(330, 'minutes').format(format)
        } else {
            return Moment(addTime).format(format)
        }
    } catch (error) {
        //logger(error.message);
        return dateTime;
    }
}


export function formatedDate(date, format = 'YYYY-MM-DD') {
    try {
        let newDate = new Date(Moment(date, format))
        return newDate;
    } catch (e) {
        //logger(e.message);
        return date;
    }
}

//pass any date field and return date in YYYY-MM-DD
export function convertTime(time, format = 'hh:mm:ss A') {
    try {
        time = isEmpty(time) ? new Date() : new Date(time);
        return Moment(time).format(format);
    } catch (e) {
        //logger(e.message);
        return time;
    }
}

//pass any date field and return date in YYYY-MM-DD
export function convertDate(date, format = 'YYYY-MM-DD') {
    try {
        return Moment(new Date(date)).format(format);
    } catch (e) {
        //logger(e.message);
        return date;
    }
}

//For get date Week Ago
export function getDateWeekAgo() {
    try {
        var today = new Date();
        var weekAgo = today.setDate(today.getDate() - 7); // weekAgo return timestamp
        var newWeekAgo = new Date(weekAgo); // Convert timestamp to date object
        // if day is 7 then before 7 i can add 0 eg: 07 / 08 / 2018
        var newDay = (newWeekAgo.getDate() + "").length == 1 ? ("0" + newWeekAgo.getDate()) : newWeekAgo.getDate();
        var opMonth = newWeekAgo.getMonth() + 1;
        var newMonth = (opMonth + "").length == 1 ? ("0" + opMonth) : opMonth;
        var newDate = today.getFullYear() + "-" + newMonth + "-" + newDay;
        return newDate;
    } catch (e) {
        //logger(e.message);
        return '';
    }
}

// For Get Current Date 
export function getCurrentDate() {
    try {
        var today = new Date();
        var newDay = (today.getDate() + "").length == 1 ? ("0" + today.getDate()) : today.getDate();
        var opMonth = today.getMonth() + 1;
        var newMonth = (opMonth + "").length == 1 ? ("0" + opMonth) : opMonth;
        var newDate = today.getFullYear() + "-" + newMonth + "-" + newDay;
        return newDate;
    } catch (e) {
        //logger(e.message);
        return '';
    }
}

// Fetch date of previous month
export function getDateMonthAgo(months) {
    try {
        var today = new Date();

        // if 0 is January then problem with december so that handle this condition
        var year = today.getMonth() == 0 ? today.getFullYear() - 1 : today.getFullYear();

        // if months is 0 then it find previous month records
        // if months is 2 then it find last 3 month records
        var daysinmonth = 0
        for (let i = 0; i <= months; i++) {
            // today.getMonth return previous month
            daysinmonth += new Date(year, today.getMonth() - i, 0).getDate()
        }

        var monthAgo = today.setDate(today.getDate() - daysinmonth); // weekAgo return timestamp
        var newWeekAgo = new Date(monthAgo); // Convert timestamp to date object

        // if day is 7 then before 7 i can add 0 eg: 07 / 08 / 2018
        var newDay = (newWeekAgo.getDate() + "").length == 1 ? ("0" + newWeekAgo.getDate()) : newWeekAgo.getDate();
        var opMonth = newWeekAgo.getMonth() + 1;
        var newMonth = (opMonth + "").length == 1 ? ("0" + opMonth) : opMonth;
        var newDate = newWeekAgo.getFullYear() + "-" + newMonth + "-" + newDay;
        return newDate;
    } catch (e) {
        //logger(e.message);
        return '';
    }
}

//--------------------

//To Check Theme Change or not
export const changeTheme = async (theme = '') => {

    try {
        if (isEmpty(theme)) {
            //To get the current feature state from preference
            let isDarkModeString = getData(ServiceUtilConstant.KEY_Theme);

            //if isDarkMode is empty  then consider lightTheme else consider stored theme
            theme = isDarkModeString === '' ? 'lightTheme' : isDarkModeString;
        } else {

            if (theme.toLowerCase().includes('n') || theme.toLowerCase().includes('dark')) theme = 'nightTheme'
            else theme = 'lightTheme';
        }
    } catch (error) {
        theme = 'lightTheme';
    }

    //Update Theme to dark or light
    R.colors.setTheme(theme)
}

export function parseArray(array) {
    try {
        //local array for creating one object in to array
        var resArr = [];

        //if given array is object then put it in array.
        if (!Array.isArray(array)) {
            resArr.push(array);
        }

        //if given array is array then return original array otherwise new created array
        let finalArray = (Array.isArray(array)) ? array : resArr;
        return finalArray;
    } catch (e) {
        //logger(e.message)
        return array;
    }
}

//To generate event or send event
export function sendEvent(eventName, ...restArguments) {
    return emitGlobalEvent(eventName, ...restArguments);
}

//to listen any event using event name 
export function addListener(eventName, eventMethod) {
    return addListenerGlobalEvent(eventName, eventMethod);
}

/**
 * Alert Modal for entire application
 * @param {String} title Title of Dialog
 * @param {String} message Description of Dialog
 * @param {Int} imageBit Dialog Type, use DialogTypes const from AlertModal class
 * @param {Function} onPress On Press of Dialog's default button
 * @param {String} cancelText Negative Button Text
 * @param {Function} onCancelPress Negative Button Press Method
 * @param {String} successText Positive Button Text
 */
export function showAlert(title = '', message = '', imageBit = DialogTypes.Info, onPress = () => { }, cancelText = '', onCancelPress = () => { }, successText = R.strings.OK) {

    // To get dialog show count from preference
    let dialogShowCount = getData(ServiceUtilConstant.KEY_DialogCount);

    if (dialogShowCount == 0) {

        let dialogConfig = {
            dialogType: imageBit,
            title: title,
            description: message,
            positiveText: (successText ? successText : R.strings.OK),
            onPressPositiveButton: onPress,
        }
        if (!isEmpty(cancelText)) {
            dialogConfig = Object.assign({}, dialogConfig, {
                negativeText: cancelText,
                onPressNegativeButton: onCancelPress,
            })
        }

        dialogShowCount++;
        setData({ [ServiceUtilConstant.KEY_DialogCount]: dialogShowCount })

        sendEvent(Events.ProgressDismiss);

        // navigate to modal dialog screen
        navigate('Modal', dialogConfig);

    } else {
        sendEvent(Events.ProgressDismiss);
    }
}

export async function getDeviceID() {

    try {
        //To return device info
        /* return await getIPAddress() + '|' + DeviceInfo.getApplicationName() + '|' + DeviceInfo.getDeviceLocale()
            + '|' + DeviceInfo.getManufacturer() + '|' + DeviceInfo.getModel() + '|' + DeviceInfo.getSystemName()
            + '|' + DeviceInfo.getSystemVersion() + '|' + DeviceInfo.getTimezone() + '|' + DeviceInfo.getUniqueID()
            + '|' + DeviceInfo.getUserAgent(); */
        //Update Device Info Method as per instruction of birju bhai
        return DeviceInfo.getModel() + '|' + DeviceInfo.getSystemName() + '|' + DeviceInfo.getUniqueID();
    } catch (e) {
        //logger(e.message)
        return '';
    }
}

export async function getDeviceName() {
    try {
        //To return device name
        return DeviceInfo.getModel();
    } catch (e) {
        //logger(e.message)
        return '';
    }
}

export async function getIPAddress(endpoint) {

    //Using ACCESS_WIFI_STATE permission
    //To get IP Address
    try {
        const response = await fetch(endpoint || 'https://api.ipify.org');
        const ip = response.text();
        return ip === '0.0.0.0' ? '' : ip;
    } catch (e) {
        return '';
        // throw 'Unable to get IP address.';
    }
}

export async function getPassword() {
    try {
        //fetching Password
        let Password = getData(ServiceUtilConstant.LOGINPASSWORD);
        return Password;
    } catch (e) {
        //logger(e.message)
        return '';
    }
}

export function logger(text, secondText = '') {
    try {
        if (__DEV__) {
            text = typeof text !== 'string' ? JSON.stringify(text) : text;
            secondText = typeof secondText !== 'string' ? JSON.stringify(secondText) : secondText;
            if (secondText === '') {
                AppConfig.enableLogger && console.log(text)
            } else {
                AppConfig.enableLogger && console.log(text, secondText)
            }
        }
    } catch (e) {
    }
}

//To get enter number percentage value
export function getPercentage(num, per) {
    try {
        return (num / 100) * per;
    } catch (e) {
        //logger(e.message)
        return '';
    }
}

export async function getFirmName() {
    try {
        //fetching firm name string
        let firmName = getData(ServiceUtilConstant.KEY_FirmName);
        return firmName;
    } catch (e) {
        //logger(e.message)
        return '';
    }
}

//To show slow internet dialog only once
export function showSlowInternetDialog() {
    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
}

//To show slow internet dialog only once
export function showTimeoutRequestDialog() {
    showAlert(R.strings.Info + '!', R.strings.SERVER_ERROR_MSG, 3);
}

//To get total pages array
export function addPages(totalCount) {
    try {
        //To get exact page total from totalCount
        let pages = Math.ceil(totalCount / AppConfig.pageSize);
        let row = [];

        //Creating array of that number of pages.
        for (var i = 1; i <= pages; i++) {
            row.push(i);
        }

        //Returning pages array
        return row;
    } catch (e) {
        //logger(e.message);
        return [];
    }
}

//To Check provided string is HTML or not
export function isHtmlData(data) {
    try {
        let isDataHtml = /<[a-z][\s\S]*>/;
        return isDataHtml.test(data);
    } catch (e) {
        //logger(e.message)
        return data;
    }
}

/**
 * Added for changing focus of EditText dynamically
 * @param {arrayTextInputs} inputArray : Array Of Text Inputs which can be in screen
 * @param {currentTextInput} input : Current Text Input among all Text Input
 */
export function changeFocus(inputArray = [], input = '') {
    if (Object.keys(inputArray).length > 0) {
        if (input === '') {
            Object.keys(inputArray).forEach(key => {
                inputArray[key].onLostFocus();
            })
        } else {
            Object.keys(inputArray).forEach(key => {
                if (key !== input) {
                    inputArray[key].onLostFocus();
                }
            })
        }
    }
}

//Added for getting widgth of slide
export function windowPercentage(percentage, viewportWidth) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

//For Parse Float Value
export function parseFloatVal(value) {
    try {
        return parseFloat(value);
    } catch (error) {
        return value;
    }
}

//For Parse Integer Value
export function parseIntVal(value, radix) {
    try {
        if (typeof radix === 'undefined') {
            return parseInt(value);
        } else {
            return parseInt(value, radix);
        }
    } catch (error) {
        return value;
    }
}

/**
 * Pass array of options to get platform based options
 * @param {array} array Pass array of options
 */
export const createOptions = (array = []) => {
    if (Platform.OS === 'ios') {
        return array.concat([R.strings.cancel]);
    } else {
        return array;
    }
}

/**
 * Pass array of actions to get platform based actions
 * @param {array} array Pass array of actions
 */
export const createActions = (array = [() => { }]) => {
    if (Platform.OS === 'ios') {
        return array.concat([() => { }]);
    } else {
        return array;
    }
}

/**
 * Merge Old style with new style
 * @param {Class} context Context of current screen pass 'this' keyword
 * @param {object} oldStyle Pass old style or {} object
 * @param {string} styleName Pass style name from props default will be 'style'
 */
export const mergeStyle = (context, oldStyle, styleName = 'style') => {

    let newStyle = context.props[styleName];

    //if style is passed from parent
    if (newStyle !== undefined) {

        //if style is an array then get all objects
        if (Array.isArray(newStyle)) {
            newStyle.map(item => oldStyle = Object.assign({}, oldStyle, item))
        } else {
            //as style is self object than merge with existing
            oldStyle = Object.assign({}, oldStyle, newStyle);
        }
        //delete style so that it cannot override with new style
        delete context.props[styleName];
    }

    return oldStyle;
}

// for get AppLogo 
export function getAppLogo() {
    try {
        // get LogoURl from the ServiceUtils
        let logoURL = getData(ServiceUtilConstant.KEY_LOGOURL);

        // logourl is available than return url else return null
        if (logoURL) {
            return logoURL
        }
        else {
            return null
        }
    } catch (e) {
        return null
    }
}

// for get Base url for general api code
export const getBaseUrl = () => {
    try {
        let baseurl = getData(ServiceUtilConstant.KEY_WebSiteUrl);
        // if baseurl url is blank than display dialog for server temporary unable
        if (baseurl != '')
            return 'http://172.20.65.143:60030' + '/'
        else
            showTimeoutRequestDialog();
    } catch (e) {
        // console.warn('catch: ' + e.message)
    }
}

// for get webBsae url for node api
export const getWebPageUrl = () => {
    try {
        let webPageUrl = getData(ServiceUtilConstant.KEY_WebServiceUrl);
        // if webpage url is blank than display dialog for server temporary unable
        if (webPageUrl != '')
            return webPageUrl
        else
            showTimeoutRequestDialog();
    } catch (e) {
        // console.warn('catch2: ' + e.message)
    }
}

export function stopLimitValidation(isBuyer, receivedMessage) {

    //if connection has data
    if (receivedMessage.Data) {

        let newData = receivedMessage.Data;

        //if data array is not empty
        if (newData.length > 0) {

            //get latest list of buyer/seller book list
            let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

            //Iterate through all received items
            newData.map(stopLimitItem => {

                //find index of same price record
                var findIndexPrice = latestOrderList.findIndex(order => parseFloatVal(order.Price) === parseFloatVal(stopLimitItem.Price));

                //if found index than proceed with plus/minus operation
                if (findIndexPrice > -1) {

                    //if isAdd bit is 1 then add amount in existing amount
                    if (stopLimitItem.IsAdd == 1) {
                        latestOrderList[findIndexPrice].Amount += stopLimitItem.Amount;
                    }

                    //if isAdd bit is 0 then minus amount in existing amount
                    if (stopLimitItem.IsAdd == 0) {
                        latestOrderList[findIndexPrice].Amount -= stopLimitItem.Amount;
                    }
                } else {

                    if (stopLimitItem.IsAdd == 1) {
                        //If record is not found then add item in list
                        latestOrderList.push(stopLimitItem);
                    }
                }
            });

            //verify through price validations
            return priceValidation(isBuyer, latestOrderList, {}, this.state.lastPrice);
        }
    }
    return {};
}

export function amountValidation(isBuyer, receivedMessage) {

    //if connection has data
    if (receivedMessage.Data) {

        let newData = receivedMessage.Data;

        if (parseFloatVal(newData.Price) !== 0) {

            //get latest list
            let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

            //find index of same price record
            var findIndexPrice = latestOrderList.findIndex(order => parseFloatVal(order.Price) === parseFloatVal(newData.Price));

            //if same price record is not found then check for amount validation
            if (findIndexPrice === -1) {
                //if amount of new record is greater then 0 then add to list
                if (parseFloatVal(newData.Amount) > 0) {

                    latestOrderList.push(newData)
                }

            } else {

                //if amount of new record is greater then 0 then update amount in existing record
                if (parseFloatVal(newData.Amount) > 0) {

                    //Get StopLimit and Limit Merged Records
                    let mergedList = this.state[isBuyer ? 'buyerBookMerge' : 'sellerBookMerge'];

                    //Find index of Stoplimit Price record for new record
                    let stopLimitPriceMergedIndex = mergedList.findIndex(el => el.Price == newData.Price);

                    //If record found than add amount in existing amount otherwise replace amount
                    if (stopLimitPriceMergedIndex > -1) {
                        latestOrderList[findIndexPrice].Amount = latestOrderList[findIndexPrice].Amount + newData.Amount;
                    } else {
                        latestOrderList[findIndexPrice].Amount = newData.Amount;
                    }

                } else {

                    //remove record if its amount is not greater than 0
                    latestOrderList.splice(findIndexPrice, 1);
                }
            }

            return priceValidation(isBuyer, latestOrderList, {}, this.state.lastPrice);
        } else if (parseFloatVal(newData.Price) === 0 && newData.Amount >= 0) {

            //get latest list
            let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

            //as we got 0 price record from signalR so we are passing third argument
            return priceValidation(isBuyer, latestOrderList, newData, this.state.lastPrice)
        }
    }

    return {};
}

export function priceValidation(isBuyer, response, lastPriceRecord, lastPrice) {

    let buyerSellerList = [];

    let stopLimitOrders = [];

    for (var buyerSellerItem of response) {

        //If item is regular than add in buyerSellerList
        if (buyerSellerItem.IsStopLimit == 0) {

            //if current record price is 0 and amount is greater than 0 then add to lastPriceRecord
            if (parseFloatVal(buyerSellerItem.Price) == 0 && parseFloatVal(buyerSellerItem.Amount) > 0) {

                // if lastPriceRecord is empty
                if (Object.keys(lastPriceRecord).length === 0) {

                    //price is 0 and amount is greater then 0 so adding record to lastPriceRecord
                    lastPriceRecord = buyerSellerItem;
                }

            } else {

                //Add to list
                buyerSellerList.push(buyerSellerItem);
            }
        } else {
            stopLimitOrders.push(buyerSellerItem);
        }

    }

    //if lastPrice is greater then 0 and lastPriceRecord has data with Amount greater then 0 then perform action
    if (lastPrice > 0 && Object.keys(lastPriceRecord).length !== 0 && lastPriceRecord.Amount > 0) {

        //finding index of existing lastPrice record in existing list
        let findLastPriceIndex = buyerSellerList.findIndex(buyerOrder => parseFloatVal(buyerOrder.Price) === parseFloatVal(lastPrice));

        if (findLastPriceIndex === -1) {

            //LastPrice is not found in list so adding lastPrice to 0 price record and adding it to List
            lastPriceRecord.Price = lastPrice;
            buyerSellerList.push(lastPriceRecord);
        } else {

            //If record is exist then sum amount of that record
            buyerSellerList[findLastPriceIndex].Amount = buyerSellerList[findLastPriceIndex].Amount + lastPriceRecord.Amount;
        }
    }

    if (stopLimitOrders.length !== 0) {

        for (var stopLimitOrder of stopLimitOrders) {

            //finding index of price record in existing list
            let findStopLimitPrice = buyerSellerList.findIndex(buyerOrder => parseFloatVal(buyerOrder.Price) === parseFloatVal(stopLimitOrder.Price));

            if (findStopLimitPrice === -1) {
                buyerSellerList.push(stopLimitOrder);
            } else {
                //If record is exist then sum amount of that record
                buyerSellerList[findStopLimitPrice].Amount = buyerSellerList[findStopLimitPrice].Amount + stopLimitOrder.Amount;
            }
        }
    }

    //Sorting array based on Price
    let res = arraySort(parseArray(buyerSellerList), 'Price', { reverse: true });

    return {
        [isBuyer ? 'buyerBookList' : 'sellerBookList']: res
    }
}