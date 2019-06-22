import React from 'react'
import { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, DatePickerAndroid, DatePickerIOS, Platform } from 'react-native'
import moment from 'moment';
import { isEmpty } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { convertDate } from '../../controllers/CommonUtils';

//Create Common class for From Date and To Date selection and view
class DatePickerWidget extends Component {

    constructor(props) {
        super(props);
        //For IOS Date Picker
        this.state = {
            isShow: false,
            isFrom: false,
            title: R.strings.date_selection,
            tempDate: new Date()
        };
    }

    datePicker = async (isFrom, selectedDate) => {

        let selDate;

        if (Platform.OS === 'android') {
            let { date } = await this.getDatePicker(selectedDate);
            selDate = date;
        } else if (Platform.OS === 'ios') {
            selDate = convertDate(selectedDate);
            this.setState({ isShow: false })
        }

        if (isFrom) {
            //set new date in fromdate state
            this.props.FromDatePickerCall(selDate);
        } else {
            //set new date in fromdate state
            this.props.ToDatePickerCall(selDate);
        }
    }

    getDatePicker = async (selectedDate) => {
        return new Promise(async resolve => {
            try {

                let options = {
                    date: isEmpty(selectedDate) ? new Date() : new Date(moment(selectedDate, 'YYYY-MM-DD')),
                    mode: 'default',
                    maxDate: new Date()
                };
                if (this.props.allowFutureDate !== undefined && this.props.allowFutureDate == true) {
                    delete options['maxDate'];
                }

                if (this.props.allowPastDate !== undefined && this.props.allowPastDate == false) {
                    options = {
                        ...options,
                        minDate: new Date()
                    }
                }

                const { action, year, month, day } = await DatePickerAndroid.open(options);

                //check user select new date or not
                if (action == DatePickerAndroid.dismissedAction) {

                }
                if (action == DatePickerAndroid.dateSetAction) {
                    var newDay = (day + "").length == 1 ? ("0" + day) : day;
                    var opMonth = month + 1;
                    var newMonth = (opMonth + "").length == 1 ? ("0" + opMonth) : opMonth;
                    var newDate = year + "-" + newMonth + "-" + newDay;

                    resolve({ date: newDate });

                }
                Keyboard.dismiss();
            } catch ({ code, message }) {
                //Handle Catch
            }
        })
    }

    //To clear time in both timer
    clearDatePicker = (isFrom) => {
        if (isFrom) {
            //set new date in fromdate state
            this.props.FromDatePickerCall('');
        } else {
            //set new date in fromdate state
            this.props.ToDatePickerCall('');
        }
    }

    render() {

        // Get required fields from props
        let props = this.props;
        let isRound = props.isRound !== undefined ? props.isRound : false;
        let isRequired = props.isRequired !== undefined ? props.isRequired : false;
        let isCancellable = props.isCancellable !== undefined ? props.isCancellable : false;

        let radius = 0;
        if (isRound) {
            radius = R.dimens.LoginButtonBorderRadius;
        }

        let fromTitle = props.fromTitle ? props.fromTitle : R.strings.From_Date;
        let toTitle = props.toTitle ? props.toTitle : R.strings.To_Date;

        return (
            <View>
                {/* To Render From Date  */}
                {(props.FromDate != undefined) &&
                    <View style={[this.styles().container, props.style]}>
                        <TextViewMR style={this.styles().text_style}>
                            {fromTitle}
                            {isRequired && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}
                        </TextViewMR>
                        <CardView
                            cardElevation={R.dimens.CardViewElivation}
                            style={{
                                padding: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: R.dimens.ButtonHeight,
                                margin: R.dimens.CardViewElivation
                            }} cardRadius={radius}
                        >
                            <DatePickerControl onPress={() => {
                                if (Platform.OS === 'android') {
                                    this.datePicker(true, props.FromDate)
                                } else if (Platform.OS === 'ios') {
                                    this.setState({ isShow: true, isFrom: true, title: fromTitle, tempDate: isEmpty(props.FromDate) ? new Date() : new Date(props.FromDate) })
                                }
                            }}
                                value={props.FromDate}
                                from={R.strings.From_Date}
                                isCancellable={isCancellable}
                                onClear={() => this.clearDatePicker(true)} />
                        </CardView>
                    </View>
                }
                {/* To Render To Date  */}
                {(props.ToDate != undefined) &&
                    <View style={this.styles().container}>
                        <TextViewMR style={this.styles().text_style}>
                            {toTitle}
                            {isRequired && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}
                        </TextViewMR>
                        <CardView
                            style={{
                                padding: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: R.dimens.ButtonHeight,
                                margin: R.dimens.CardViewElivation
                            }} cardRadius={radius}
                        >
                            <DatePickerControl onPress={() => {
                                if (Platform.OS === 'android') {
                                    this.datePicker(false, props.ToDate)
                                } else if (Platform.OS === 'ios') {
                                    this.setState({ isShow: true, isFrom: false, title: toTitle, tempDate: isEmpty(props.ToDate) ? new Date() : new Date(props.ToDate) })
                                }
                            }}
                                value={props.ToDate}
                                from={R.strings.To_Date}
                                isCancellable={isCancellable}
                                onClear={() => this.clearDatePicker(false)} />
                        </CardView>
                    </View>
                }

                {/* For iOS Date Time Picker */}
                <AlertDialog
                    visible={this.state.isShow}
                    title={this.state.title}
                    negativeButton={{
                        title: R.strings.cancel,
                        onPress: () => this.setState({ isShow: false })
                    }}
                    positiveButton={{
                        title: R.strings.OK,
                        onPress: () => this.datePicker(this.state.isFrom, this.state.tempDate),
                    }}
                    requestClose={() => { }}
                    backgroundStyle={{ backgroundColor: R.colors.white }}
                    titleStyle={{ color: R.colors.listValue }}>
                    <DatePickerIOS
                        date={this.state.tempDate}
                        onDateChange={(SelectedDate) => this.setState({ tempDate: SelectedDate })}
                        mode='date'
                        textColor={R.colors.textPrimary}
                        maximumDate={this.props.allowFutureDate !== undefined && this.props.allowFutureDate == true ? null : new Date()} />
                </AlertDialog>
            </View >
        );
    }

    //Common Style For From Date and To Date
    styles = () => {
        return {
            container: {
                backgroundColor: 'transparent',
                marginTop: R.dimens.widget_top_bottom_margin,
                flexDirection: 'column'
            },
            text_style: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                marginLeft: R.dimens.LineHeight,
            }
        }
    }
}

//For Date Picker Control
const DatePickerControl = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {(props.from === R.strings.From_Date && isEmpty(props.value)) ?
                <TextViewMR style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.From_Date}</TextViewMR>
                :
                (props.from === R.strings.To_Date && isEmpty(props.value)) ?
                    <TextViewMR style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.To_Date}</TextViewMR>
                    :
                    <TextViewHML style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{props.value}</TextViewHML>}
            {
                /* If value is not empty than display clear button */
                props.value.toString().trim() !== '' && props.isCancellable &&
                <ImageTextButton
                    icon={R.images.IC_CLOSE_CIRCLE}
                    onPress={props.onClear}
                    iconStyle={{
                        width: R.dimens.titleIconHeightWidth,
                        height: R.dimens.titleIconHeightWidth,
                        tintColor: R.colors.textSecondary
                    }}
                    style={{
                        marginRight: R.dimens.widget_left_right_margin,
                    }}
                />}
            <Image style={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, marginRight: R.dimens.widget_left_right_margin, tintColor: R.colors.textSecondary }} source={R.images.DATE_ICON} />
        </View>
    </TouchableWithoutFeedback>
)

export default DatePickerWidget;

