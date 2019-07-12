import React from 'react'
import { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, TimePickerAndroid, DatePickerIOS, Platform } from 'react-native'
import moment from 'moment';
import { isEmpty } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { convertTime, convertDate, getCurrentDate } from '../../controllers/CommonUtils';

//Create Common class for Start Time and End Time selection and view
class TimePickerWidget extends Component {

    constructor(props) {
        super(props);
        //For IOS Time Picker
        this.state = {
            isShow: false,
            isStart: false,
            title: R.strings.time,
            startTime: new Date(),
            endTime: new Date()
        };
    }

    TimePicker = async (isStart, SelectedTime) => {

        let selTime;

        if (Platform.OS === 'android') {
            let { Time } = await this.getTimePicker();
            selTime = Time;
        } else if (Platform.OS === 'ios') {
            selTime = convertTime(SelectedTime);
            this.setState({ isShow: false })
        }

        if (isStart) {
            //set new Time in StartTime state
            this.props.StartTimePickerCall(selTime);
        } else {
            //set new Time in StartTime state
            this.props.EndTimePickerCall(selTime);
        }
    }

    //To clear time in both timer
    clearTimePicker = (isStart) => {
        if (isStart) {
            //set empty Time in StartTime state
            this.props.StartTimePickerCall('');
        } else {
            //set empty Time in StartTime state
            this.props.EndTimePickerCall('');
        }
    }

    getTimePicker = async () => {
        return new Promise(async resolve => {
            try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                    mode: 'default',
                    is24Hour: false,
                    clearButtonMode: 'always',
                    clearTextOnFocus: true,
                });
                //check user select new Time or not
                if (action == TimePickerAndroid.timeSetAction) {
                    var newTime = hour + ":" + minute
                    //To convert selected time into 12 Hours Format using Moment Library
                    resolve({ Time: moment(newTime, 'HH:mm').format('hh:mm A') });
                }
                Keyboard.dismiss();
            } catch ({ code, message }) {
                //Handle Catch
            }
        })
    }

    getTime(time) {
        if (isEmpty(time)) {
            return new Date();
        } else {
            let todayDate = convertDate(getCurrentDate(), 'DD/MM/YYYY') + ' ' + time;
            return new Date(todayDate);
        }
    }

    render() {
        let props = this.props;
        let isRound = props.isRound !== undefined ? props.isRound : false;

        let radius = 0;
        if (isRound) {
            radius = R.dimens.LoginButtonBorderRadius;
        }

        return (
            <View>
                {/* To Render Start Time  */}
                <View style={this.styles().container}>
                    <TextViewMR style={this.styles().text_style}>{R.strings.StartTime}</TextViewMR>
                    <CardView
                        style={{
                            padding: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: R.dimens.ButtonHeight,
                            margin: R.dimens.CardViewElivation
                        }}
                        cardElevation={R.dimens.CardViewElivation}
                        cardRadius={radius}>

                        <TimePickerControl onPress={() => {
                            if (Platform.OS === 'android') {
                                this.TimePicker(true, '')
                            } else if (Platform.OS === 'ios') {
                                this.setState({ isShow: true, isStart: true, title: R.strings.StartTime, startTime: this.getTime(props.StartTime) })
                            }
                        }}
                            onClear={() => this.clearTimePicker(true)}
                            value={props.StartTime}
                            from={R.strings.StartTime} />

                    </CardView>
                </View>

                {/* To Render End Time  */}
                <View style={this.styles().container}>
                    <TextViewMR style={this.styles().text_style}>{R.strings.EndTime}</TextViewMR>
                    <CardView
                        style={{
                            padding: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: R.dimens.ButtonHeight,
                            margin: R.dimens.CardViewElivation
                        }} cardRadius={radius}
                    >
                        <TimePickerControl onPress={() => {
                            if (Platform.OS === 'android') {
                                this.TimePicker(false, '')
                            } else if (Platform.OS === 'ios') {
                                this.setState({ isShow: true, isStart: false, title: R.strings.EndTime, endTime: this.getTime(props.EndTime) })
                            }
                        }}
                            onClear={() => this.clearTimePicker(false)}
                            value={props.EndTime}
                            from={R.strings.EndTime} />
                    </CardView>
                </View>

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
                        onPress: () => this.TimePicker(this.state.isStart, this.state.isStart ? this.state.startTime : this.state.endTime),
                    }}
                    requestClose={() => { }}
                    backgroundStyle={{ backgroundColor: R.colors.white }}
                    titleStyle={{ color: R.colors.listValue }}>
                    <DatePickerIOS
                        date={this.state.isStart ? this.state.startTime : this.state.endTime}
                        onDateChange={(SelectedTime) => this.setState({ [this.state.isStart ? 'startTime' : 'endTime']: SelectedTime })}
                        mode='time' />
                </AlertDialog>
            </View >
        );
    }

    //Common Style For Start Time and End Time
    styles = () => {
        return {
            container: {
                backgroundColor: 'transparent',
                marginTop: R.dimens.widget_top_bottom_margin,
                flexDirection: 'column'
            },
            text_style: {
                marginLeft: R.dimens.LineHeight,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            }
        }
    }
}

//For Time Picker Control
const TimePickerControl = (props) => (
    <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {(props.from === R.strings.StartTime && isEmpty(props.value)) ?
                <TextViewHML style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.StartTime}</TextViewHML>
                :
                (props.from === R.strings.EndTime && isEmpty(props.value)) ?
                    <TextViewHML style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.EndTime}</TextViewHML>
                    :
                    <TextViewHML style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{props.value}</TextViewHML>}
            {
                /* If value is not empty than display clear button */
                props.value.toString().trim() !== '' &&
                <TouchableWithoutFeedback onPress={props.onClear}>
                    <Image style={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, marginRight: R.dimens.widget_left_right_margin, tintColor: R.colors.textSecondary }} source={R.images.IC_CLOSE_CIRCLE} />
                </TouchableWithoutFeedback>}
            <Image style={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, marginRight: R.dimens.widget_left_right_margin, tintColor: R.colors.textSecondary }} source={R.images.IC_TIME} />
        </View>
    </TouchableWithoutFeedback >
)

export default TimePickerWidget;

