import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { deviceAuthorize } from '../../actions/Login/DeviceAuthorizationAction'
import { changeTheme } from '../../controllers/CommonUtils'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';

class DeviceAuthorization extends Component {

    constructor(props) {
        super(props)

        //Define initial state
        this.state = {
            response: ''
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Request For Device Authorization
            var reqObj = {
                authorizecode: 'parsedauthorizecode'
            }
            //Call Get Device Authorization API
            this.props.deviceAuthorize(reqObj);
        }
    };

    componentDidUpdate = (prevProps, _prevState) => {
        const { DeviceAuthorizedData } = this.props;

        //For showing response of forgot password 
        if (DeviceAuthorizedData !== prevProps.DeviceAuthorizedData) {
            if (DeviceAuthorizedData) {

            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (DeviceAuthorization.oldProps !== props) {
            DeviceAuthorization.oldProps = props;
        } else {
            return null;
        }

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, { isFirstTime: false })
        }

        if (isCurrentScreen(props)) {
            const { DeviceAuthorizedFetchData, DeviceAuthorizedData } = props;

            if (!DeviceAuthorizedFetchData) {
                try {

                    //Check DeviceAuthorizedFetchData Api Response 
                    if (validateResponseNew({ response: DeviceAuthorizedData })) {
                        return Object.assign({}, state, {
                            isShowTimer: true,
                            isForgotSuceessAlert: true
                        })
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        isShowTimer: false,
                        isForgotSuceessAlert: false,
                    })
                }
            }
        }
        return null
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps)
    };

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { DeviceAuthorizedisFetching } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog isShow={DeviceAuthorizedisFetching} />

                {/* Background Image Header */}
                <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                        paddingBottom: R.dimens.margin_top_bottom,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Withdraw History Result Details in list */}
                        <View style={{
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            justifyContent: 'space-between',
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: 0,
                            flexDirection: 'column'
                        }}>
                            <TextViewHML
                                style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.TrnId}</TextViewHML>
                            <TouchableOpacity onPress={() => this.onTrnLinkPress()}>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.accent }]}>TrnId</TextViewHML>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                            marginTop: R.dimens.widgetMargin,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            marginBottom: 0
                        }}>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.Address}</TextViewHML>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>Address</TextViewHML>
                        </View>

                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: 0,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,

                        }}>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.Information}</TextViewHML>
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>Information</TextViewHML>
                        </View>

                        {this.rowItem(R.strings.Trn_No, 'TrnNo', false, false)}
                        {this.rowItem(R.strings.Date, 'Date', false, false)}
                        {this.rowItem(R.strings.Status, 'StatusStr', true, true, 'Status')}
                    </CardView>
                    <View>
                        <Button
                            title={R.strings.backToLogin}
                            isRound={true}
                            isAlert={true}
                            onPress={() => this.props.navigation.navigate('LoginNormalScreen')}
                            style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                            textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                    </View>
                </ScrollView>
            </View>
        );
    }

    // style for this class
    styles = () => {
        return {
            input_container: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.margin_top_bottom,
            },
        }
    }

    // for display title and value horizontally
    rowItem = (title, value, marginBottom, status, StatusCode) => {

        let color;
        if (status) {
            //To Display various Status Color in ListView
            if (StatusCode == 0) {
                color = R.colors.textPrimary
            } else if (StatusCode == 1) {
                color = R.colors.successGreen
            } else if (StatusCode == 2) {
                color = R.colors.failRed
            } else if (StatusCode == 3) {
                color = R.colors.failRed
            } else if (StatusCode == 4 || StatusCode == 6) {
                color = R.colors.accent
            } else if (StatusCode == 5) {
                color = R.colors.sellerPink
            } else {
                color = R.colors.accent
            }
        }

        return <View style={{
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            flexDirection: 'row',
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
            marginTop: R.dimens.widgetMargin,
            justifyContent: 'space-between'
        }}>
            <TextViewHML style={[this.stylesItem().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.stylesItem().contentItem, { color: status ? color : R.colors.textPrimary, textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    stylesItem = () => {
        return {
            contentItem: {
                fontSize: R.dimens.smallText,
                flex: 1
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Device Authorization Api Action
        DeviceAuthorizedFetchData: state.DeviceAuthorizationReducer.DeviceAuthorizedFetchData,
        DeviceAuthorizedData: state.DeviceAuthorizationReducer.DeviceAuthorizedData,
        DeviceAuthorizedisFetching: state.DeviceAuthorizationReducer.DeviceAuthorizedisFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform deviceAuthorize action
        deviceAuthorize: (reqObj) => dispatch(deviceAuthorize(reqObj)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceAuthorization)