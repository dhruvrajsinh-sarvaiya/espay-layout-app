import React, { Component } from 'react';
import { View, Image, ScrollView, Clipboard } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CommonToast from '../../native_theme/components/CommonToast';
import Button from '../../native_theme/components/Button';
import Separator from '../../native_theme/components/Separator';
import SafeView from '../../native_theme/components/SafeView';
import CardView from '../../native_theme/components/CardView';

class AddApiKeySuccessScreen extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Even0ts
        addRouteToBackPress(props);

        //bind all methods
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        let item = props.navigation.state.params && props.navigation.state.params.item;

        //Define All initial State
        this.state = {
            item: item,
            apiKey: item.APIKey,
            secretKey: item.SecretKey,
            QRCode: item.QRCode,
            aliasName: item.AliasName,
        };
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    onBackPress() {
        
        //refresh previous screen list
        this.props.navigation.state.params.onSuccessAddEdit()
       
        //goging back to the update screen
        this.props.navigation.navigate('ViewPublicApiKey');
        //----
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    // Copy Functionality
    copyKey = async (keyName) => {
        await Clipboard.setString(keyName === true ? this.state.apiKey : this.state.secretKey);
        this.refs.toast.Show(R.strings.Copy_SuccessFul);
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }} >

                    {/* To Set CommonToast as per out theme */}
                    <CommonToast ref='toast' />

                    <Image
                        source={{ uri: 'https://chart.googleapis.com/chart?cht=qr&chl=' + this.state.apiKey + '&chs=150x150&chld=L|0' }}
                        style={{ width: R.dimens.QRCodeIconWidthHeightD, height: R.dimens.QRCodeIconWidthHeightD, alignSelf: 'center', marginTop: R.dimens.margin_top_bottom }} />

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: R.dimens.margin_top_bottom, paddingLeft: R.dimens.widget_top_bottom_margin, paddingRight: R.dimens.widget_top_bottom_margin }}>
                        <ImageButton
                            style={{ margin: 0, padding: 0 }}
                            icon={R.images.IC_CHECK_CIRCLE}
                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
                        />
                        <TextViewMR style={[this.styles().contentItem, { fontSize: R.dimens.mediumText, marginLeft: R.dimens.widgetMargin }]}>{R.strings.apiKeyGenrated}</TextViewMR>
                    </View>

                    <CardView style={{
                        marginTop: R.dimens.margin_top_bottom,
                        backgroundColor: R.colors.cardBackground,
                        elevation: R.dimens.CardViewElivation,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        marginLeft: R.dimens.padding_left_right_margin,
                        marginRight: R.dimens.padding_left_right_margin,
                        padding: R.dimens.padding_left_right_margin,
                        paddingBottom: R.dimens.ButtonHeight,
                        borderRadius: R.dimens.cardBorderRadius,
                    }}>

                        <TextViewMR style={[this.styles().titleItem, { fontSize: R.dimens.mediumText, textAlign: 'center' }]}>{this.state.aliasName}</TextViewMR>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <TextViewMR style={{
                                fontSize: R.dimens.smallestText,
                                color: R.colors.textSecondary,
                                textAlign: 'left',
                            }}>{R.strings.apiKey}</TextViewMR>

                            <ImageButton
                                style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                onPress={() => this.copyKey(true)}
                                icon={R.images.IC_COPY}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textSecondary }}
                            />

                        </View>

                        <TextViewHML style={this.styles().contentItem}>{this.state.item.APIKey.substring(this.state.apiKey.length - 20, this.state.apiKey.length)}</TextViewHML>

                        <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <TextViewMR style={{
                                fontSize: R.dimens.smallestText,
                                color: R.colors.textSecondary,
                                textAlign: 'left',
                            }}>{R.strings.secretKey}</TextViewMR>
                            <ImageButton
                                style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                onPress={() => this.copyKey(false)}
                                icon={R.images.IC_COPY}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textSecondary }}
                            />

                        </View>

                        <TextViewHML style={this.styles().contentItem}>{this.state.item.SecretKey.substring(this.state.secretKey.length - 20, this.state.secretKey.length)}</TextViewHML>

                        <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />

                        <TextViewMR style={{
                            fontSize: R.dimens.smallestText,
                            color: R.colors.textSecondary,
                            textAlign: 'left',
                        }}>{R.strings.apiAccess}</TextViewMR>

                        <TextViewHML style={this.styles().contentItem}>{this.state.item.APIAccess === 1 ? R.strings.admin_rights : R.strings.view_rights}</TextViewHML>

                        <TextViewHML style={{
                            marginTop: R.dimens.padding_top_bottom_margin,
                            fontSize: R.dimens.smallestText,
                            color: R.colors.yellow,
                            textAlign: 'left',
                        }}>{R.strings.securitySuccesScreenNote}</TextViewHML>

                    </CardView>

                    <View style={{ marginBottom: R.dimens.margin_top_bottom }}>
                        <Button
                            title={R.strings.homeTitle}
                            onPress={() => {
                               
                                //refresh previous screen list
                                this.props.navigation.state.params.onSuccessAddEdit()

                                //goging back to the update screen
                                this.props.navigation.navigate('ViewPublicApiKey');
                                //----
                            }}
                            isRound={true}
                            isAlert={true}
                            style={{ position: 'absolute', bottom: - R.dimens.widget_top_bottom_margin, elevation: (R.dimens.CardViewElivation * 2) }}
                            textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                    </View>
                </ScrollView>
            </SafeView >
        );
    }

    // styles for this class
    styles = () => {
        return {
            titleItem: {
                fontSize: R.dimens.listItemText,
                color: R.colors.textSecondary,
                marginTop: R.dimens.widget_top_bottom_margin
            },
            contentItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary,
            }
        }
    }
}

export default AddApiKeySuccessScreen;