import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { onPressLogin } from '../../actions/Login/loginAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button'
import { changeTheme, sendEvent } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import AlertDialog from '../../native_theme/components/AlertDialog';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { Events } from '../../controllers/Constants';

class ResetAuthenticationComponent extends Component {

    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state
        this.state = {
            isCheckedop1: true,
            isCheckedop2: true,
            isGoogle: params.isGoogle,
            modalVisible: false
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }

    componentWillMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    navigateLogin = () => {
        //add some time for close and then redirect to login
        //setTimeout(() => {
        this.setState({ modalVisible: false });
        //}, 200)
        //redirectto login on close model
        //This will reset to login page
        sendEvent(Events.SessionLogout, true);
    }

    render() {
        return (
            <View style={this.styles().container}>
                <CommonStatusBar />
                <CustomToolbar title={this.state.isGoogle ? R.strings.reset_google_title : R.strings.reset_sms_title} isBack={true} nav={this.props.navigation} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Set All View in ScrolView */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            <Text style={{ alignSelf: 'center', textAlign: 'left', fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.state.isGoogle ? R.strings.google_auth_reset_msg : R.strings.sms_auth_reset_msg}</Text>

                            <ImageButton
                                name={this.state.isGoogle ? R.strings.google_auth_option1_msg : R.strings.sms_auth_option1_msg}
                                numberOfLines={7}
                                icon={this.state.isCheckedop1 ? R.images.EMPTY_CHECKBOX : R.images.FILL_CHECKBOX}
                                onPress={() => this.setState({ isCheckedop1: !this.state.isCheckedop1 })}
                                style={{ margin: 0, marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row-reverse', }}
                                textStyle={{ flex: 1, color: R.colors.textPrimary }}
                                iconStyle={{ alignSelf: 'flex-start', marginRight: R.dimens.widgetMargin, tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />

                            <ImageButton
                                name={this.state.isGoogle ? R.strings.google_auth_option2_msg : R.strings.sms_auth_option2_msg}
                                numberOfLines={7}
                                icon={this.state.isCheckedop2 ? R.images.EMPTY_CHECKBOX : R.images.FILL_CHECKBOX}
                                onPress={() => this.setState({ isCheckedop2: !this.state.isCheckedop2 })}
                                style={{ margin: 0, marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row-reverse', }}
                                textStyle={{ flex: 1, color: R.colors.textPrimary, }}
                                iconStyle={{ alignSelf: 'flex-start', marginRight: R.dimens.widgetMargin, tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                        </View>
                    </ScrollView>

                </View>
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                    <Button
                        onPress={() => { this.setState({ modalVisible: true }) }}
                        title={R.strings.confirm_your_reset_request}>
                    </Button>
                </View>
                <View>
                    <AlertDialog
                        visible={this.state.modalVisible}
                        title={this.state.isGoogle ? R.strings.reset_google_title : R.strings.reset_sms_title}
                        requestClose={this.navigateLogin}
                        negativeButton={{
                            onPress: () => this.navigateLogin(),
                        }}
                        positiveButton={{
                            title: R.strings.OK,
                            onPress: () => this.navigateLogin(),
                            progressive: false
                        }}>
                        <View style={{ padding: R.dimens.margin }}>
                            <Text style={{ paddingLeft: R.dimens.widget_left_right_margin, paddingRight: R.dimens.widget_left_right_margin, textAlign: 'left', width: '100%', fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{this.state.isGoogle ? R.strings.google_confirmation_msg : R.strings.sms_confirmation_msg}</Text>
                            <Text style={{ paddingLeft: R.dimens.widget_left_right_margin, paddingRight: R.dimens.widget_left_right_margin, marginTop: R.dimens.widget_top_bottom_margin, textAlign: 'left', width: '100%', fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.common_confirmation_msg}</Text>
                        </View>
                    </AlertDialog>
                </View>
            </View>
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        loginReducer: state.loginReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onPressLogin: () => dispatch(onPressLogin())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetAuthenticationComponent)