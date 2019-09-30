// ArbitrageCoinConfigurationDetailScreen.js
import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import SafeView from '../../../native_theme/components/SafeView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import CardView from '../../../native_theme/components/CardView';
import R from '../../../native_theme/R';
import { validateValue } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import TextViewMR from '../../../native_theme/components/TextViewMR';

class ArbitrageCoinConfigurationDetailScreen extends Component {
    constructor(props) {
        super(props);

        // Get required fields from previous screen
        var { params } = props.navigation.state;

        //Define All State initial state
        this.state = {
            item: params.item,
            Explorer: params.item.Explorer,
            Community: params.item.Community,
        };
    }

    componentWillMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    render() {

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>
                    {/* Statusbar of Order History Detail  */}
                    <CommonStatusBar />

                    {/* CustomToolbar */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.arbitrageCoinConfiguration}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView stickyHeaderIndices={[1]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        <CardView style={{ margin: R.dimens.padding_top_bottom_margin, padding: 0, backgroundColor: R.colors.cardBackground }} cardRadius={R.dimens.detailCardRadius}>

                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: '20%', justifyContent: 'center' }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.SMSCode ? this.state.item.SMSCode : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>
                                <View style={{ width: '80%', flexDirection: 'column' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(this.state.item.Name.toUpperCase())}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{validateValue(this.state.item.SMSCode)}</TextViewMR>
                                </View>
                            </View>

                            {this.rowItem(R.strings.serviceId, this.state.item.ServiceId)}
                            {this.rowItem(R.strings.totalSupply, this.state.item.TotalSupply)}
                            {this.rowItem(R.strings.maxSupply, this.state.item.MaxSupply)}
                            {this.rowItem(R.strings.issuePrice, this.state.item.IssuePrice)}
                            {this.rowItem(R.strings.transaction, this.state.item.IsTransaction == 1 ? 'true' : 'false')}
                            {this.rowItem(R.strings.withdraw, this.state.item.IsWithdraw == 1 ? 'true' : 'false')}
                            {this.rowItem(R.strings.deposit, this.state.item.IsDeposit == 1 ? 'true' : 'false')}
                            {this.rowItem(R.strings.baseCurrency, this.state.item.IsBaseCurrency == 1 ? 'true' : 'false')}
                            {this.rowItem(R.strings.issueDate, convertDate(this.state.item.IssueDate))}
                            {this.ArrayItem(R.strings.explorer, this.state.Explorer)}
                            {this.ArrayItem(R.strings.community, this.state.Community, true)}
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    rowItem = (title, value) => {

        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    ArrayItem = (title, itemData, marginBottom) => {

        if (typeof marginBottom === 'undefined') {
            marginBottom = false;
        }

        return <View style={{
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
        }}>
            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{title + ': '}</TextViewHML>
            <View>
                {
                    itemData.map((item, index) =>
                        <TextViewHML style={{
                            fontSize: R.dimens.smallText,
                            color: R.colors.textPrimary, fontWeight: 'normal',
                        }} key={index.toString()}>{validateValue(item.Data)}</TextViewHML>
                    )
                }
            </View>
        </View>
    }
    styles = () => {
        return {
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            }
        }
    }
}

export default ArbitrageCoinConfigurationDetailScreen