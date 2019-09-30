// CoinConfigurationDetailScreen
import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, convertDate } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import R from '../../../native_theme/R';
import ImageViewWidget from '../../widget/ImageViewWidget'
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import LinearGradient from 'react-native-linear-gradient';
import SafeView from '../../../native_theme/components/SafeView';
import { validateValue } from '../../../validations/CommonValidation';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';

class CoinConfigurationDetailScreen extends Component {
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
        let { item } = this.state
        return (
            <LinearGradient style={{ flex: 1, }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To Set Status Bas as per out theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        textStyle={{ color: 'white' }}
                        title={R.strings.CoinConfiguration}
                        toolbarColor={'transparent'}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView stickyHeaderIndices={[1]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        <CardView style={{ margin: R.dimens.padding_top_bottom_margin, padding: 0, backgroundColor: R.colors.cardBackground }} cardRadius={R.dimens.detailCardRadius}>

                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>

                                {/* for show pair logo ,pair name */}
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.SMSCode ? this.state.item.SMSCode : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>
                                <View style={{ flex: 1, marginLeft: R.dimens.margin }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold }}>{validateValue(this.state.item.Name.toUpperCase())}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(this.state.item.SMSCode)}</TextViewMR>
                                </View>
                            </View>

                            {/* To show serviceId */}
                            <RowItem title={R.strings.serviceId} value={validateValue(item.ServiceId)} />

                            {/* To show totalSupply */}
                            <RowItem title={R.strings.totalSupply} value={validateValue(item.TotalSupply)} />

                            {/* To show maxSupply */}
                            <RowItem title={R.strings.maxSupply} value={validateValue(item.MaxSupply)} />

                            {/* To show issuePrice */}
                            <RowItem title={R.strings.issuePrice} value={validateValue(item.IssuePrice)} />

                            {/* To show transaction status */}
                            <RowItem title={R.strings.transaction} value={validateValue(item.IsTransaction == 1 ? 'true' : 'false')} />

                            {/* To show withdraw status */}
                            <RowItem title={R.strings.withdraw} value={validateValue(item.IsWithdraw == 1 ? 'true' : 'false')} />

                            {/* To show deposit status */}
                            <RowItem title={R.strings.deposit} value={validateValue(item.IsDeposit == 1 ? 'true' : 'false')} />

                            {/* To show baseCurrency status */}
                            <RowItem title={R.strings.baseCurrency} value={validateValue(item.IsBaseCurrency == 1 ? 'true' : 'false')} />

                            {/* To show issueDate */}
                            <RowItem title={R.strings.issueDate} value={validateValue(convertDate(item.IssueDate))} />

                            {/* To show explorer links */}
                            {this.ArrayItem(R.strings.explorer, this.state.Explorer)}

                            {/* To show community links */}
                            {this.ArrayItem(R.strings.community, this.state.Community, true)}

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
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
            <TextViewHML style={{
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary
            }}>{title} :</TextViewHML>

            {
                itemData.length > 0 ?
                    <View>
                        {
                            itemData.map((item, index) =>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary, fontWeight: 'normal',
                                }} key={index.toString()}>{item.Data}</TextViewHML>
                            )
                        }
                    </View>
                    :
                    <View>
                        <TextViewHML style={{
                            fontSize: R.dimens.smallText,
                            color: R.colors.textPrimary, fontWeight: 'normal',
                        }} >{'-'}</TextViewHML>
                    </View>
            }
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

export default CoinConfigurationDetailScreen;