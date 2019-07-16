import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { deviceAuthorize } from '../../actions/Login/DeviceAuthorizationAction'
import { changeTheme } from '../../controllers/CommonUtils'
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';

class DeviceAuthorization extends Component {

    constructor(props) {
        super(props)

        let authorizeCode = props.navigation.state.params.authorizeCode !== undefined ? props.navigation.state.params.authorizeCode : '';

        //Define initial state
        this.state = {
            authorizeCode,
            statusCode: null,
            statusText: '',
            description: '',
            location: '-',
            ipAddress: '-',
            deviceName: '-',
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Request For Device Authorization
            var reqObj = {
                authorizecode: this.state.authorizeCode
            }
            //Call Get Device Authorization API
            this.props.deviceAuthorize(reqObj);
        }
    };

    componentDidUpdate = (prevProps, _prevState) => {
        //Get All Updated field of Particular actions
        let { data } = this.props;

        //If current and previous both data is different
        if (data !== prevProps.data) {

            let response = {
                statusCode: -1,
                statusText: R.strings.invalidAuthenticationLink,
                description: R.strings.invalidUserLink,
                location: '-',
                ipAddress: '-',
                deviceName: '-'
            }

            //If data is not null and validating response is success than show dialog.
            if (data && validateResponseNew({ response: data, isList: true })) {

                response.statusCode = data.ReturnCode;

                if (data.AuthorizeData) {
                    response.statusText = data.ReturnMsg;
                    response.description = R.strings.successAuthMessage;
                    response.location = data.AuthorizeData.Location;
                    response.ipAddress = data.AuthorizeData.IPAddress;
                    response.deviceName = data.AuthorizeData.DeviceName;
                }
            }

            this.setState(response);
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call 
        return isCurrentScreen(nextProps)
    };

    render() {

        // To get loading for true/false
        const { isLoading } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Background Image Header */}
                <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                {isLoading && <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <ActivityIndicator size={'large'} color={R.colors.accent} />
                </View>}

                {!isLoading && this.state.statusCode !== null && <ScrollView contentContainerStyle={[this.state.statusCode > -1 ? {} : {
                    marginTop: R.dimens.activity_margin
                }, {
                    flexGrow: 1,
                    paddingBottom: R.dimens.margin_top_bottom
                }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    <View style={{
                        marginTop: R.dimens.widget_top_bottom_margin,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        marginLeft: R.dimens.margin_top_bottom,
                        marginRight: R.dimens.margin_top_bottom,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextViewMR style={{ color: this.state.statusCode > -1 ? R.colors.successGreen : R.colors.failRed, fontWeight: 'bold' }}>{this.state.statusText}</TextViewMR>
                        <TextViewHML style={{ color: R.colors.textSecondary, marginTop: R.dimens.widgetMargin }}>{this.state.description}</TextViewHML>
                    </View>

                    {/* Card for rest details to display item */}
                    {this.state.statusCode > -1 && <CardView style={{
                        marginLeft: R.dimens.margin_top_bottom,
                        marginRight: R.dimens.margin_top_bottom,
                        marginTop: R.dimens.widget_top_bottom_margin,
                        marginBottom: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                        paddingBottom: R.dimens.margin_top_bottom,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {this.rowItem(R.strings.deviceTitle, this.state.deviceName)}
                        {this.rowItem(R.strings.Location, this.state.location)}
                        {this.rowItem(R.strings.ipAddress, this.state.ipAddress, true)}
                    </CardView>}

                    <View>
                        <Button
                            title={R.strings.backToLogin}
                            isRound={true}
                            isAlert={true}
                            onPress={() => this.props.navigation.goBack()}
                            style={[this.state.statusCode > -1 ? { position: 'absolute', bottom: -0 } : {}, { elevation: (R.dimens.CardViewElivation * 2) }]}
                            textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                    </View>
                </ScrollView>}
            </View>
        );
    }

    // for display title and value horizontally
    rowItem = (title, value, marginBottom) => {

        return <View style={{
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
            marginTop: R.dimens.widgetMargin,
        }}>
            <TextViewHML style={[this.stylesItem().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.stylesItem().contentItem, { color: R.colors.textPrimary }]}>{value}</TextViewHML>
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
        data: state.DeviceAuthorizationReducer.data,
        isLoading: state.DeviceAuthorizationReducer.isLoading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform deviceAuthorize action
        deviceAuthorize: (reqObj) => dispatch(deviceAuthorize(reqObj)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceAuthorization)