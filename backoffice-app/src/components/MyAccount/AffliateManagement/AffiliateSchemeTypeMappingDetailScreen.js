// AffiliateSchemeTypeMappingDetailScreen
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';


class AffiliateSchemeTypeMappingDetailScreen extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        let statusText = '';
        let statusColor = R.colors.textPrimary

        if (this.state.item.Status == 0) {
            statusText = R.strings.inActive
            statusColor = R.colors.yellow
        }

        if (this.state.item.Status == 1) {
            statusText = R.strings.active
            statusColor = R.colors.successGreen
        }

        if (this.state.item.Status == 9) {
            statusText = R.strings.Delete
            statusColor = R.colors.failRed
        }

        return (
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]}  end={{ x: 0, y: 1 }}
                start={{ x: 0, y: 0 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    title={R.strings.affiliateSchemeTypeMapping}
                    isBack={true} nav={this.props.navigation} />


                <ScrollView contentContainerStyle={{ flexGrow: 1, 
                    paddingBottom: R.dimens.margin_top_bottom }} 
                    showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Currency with Icon  */}
                        <View style={{
                            flexDirection: 'row',
                            margin: R.dimens.widget_top_bottom_margin,
                        }}>
                            <View>
                                <View style={{
                                    width: R.dimens.signup_screen_logo_height,
                                    height: R.dimens.signup_screen_logo_height,
                                    backgroundColor: 'transparent',
                                    borderRadius: R.dimens.paginationButtonRadious,
                                }}>
                                    <ImageViewWidget url={this.state.item.DepositWalletTypeName ? this.state.item.DepositWalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: R.dimens.WidgetPadding }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.item.DepositWalletTypeName ? this.state.item.DepositWalletTypeName : '-'} </Text>
                            </View>
                        </View>

                        {/*  list */}
                        {this.rowItem(R.strings.UserName, this.state.item.UserName ? this.state.item.UserName : '-')}
                        {this.rowItem(R.strings.schemeName, this.state.item.SchemeName ? this.state.item.SchemeName : '-')}
                        {this.rowItem(R.strings.schemeTypeName, this.state.item.SchemeTypeName ? this.state.item.SchemeTypeName : '-')}
                        {this.rowItem(R.strings.commissionTypeInterval, ((parseFloatVal((this.state.item.CommissionTypeInterval))) !== 'NaN' ? parseFloatVal(this.state.item.CommissionTypeInterval) : '-'))}
                        {this.rowItem(R.strings.minimumDepositionRequired, ((parseFloatVal((this.state.item.MinimumDepositionRequired))) !== 'NaN' ? parseFloatVal(this.state.item.MinimumDepositionRequired) : '-'))}
                        {this.rowItem(R.strings.commissionHour, ((parseFloatVal((this.state.item.CommissionHour))) !== 'NaN' ? parseFloatVal(this.state.item.CommissionHour) : '-'))}
                        {this.rowItem(R.strings.description, this.state.item.Description ? this.state.item.Description : '-')}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: R.dimens.widget_top_bottom_margin,
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,
                            }}
                        >
                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.status}</TextViewHML>
                            <TextViewHML style={[this.styles().contentItem, { color: statusColor, fontWeight: 'normal', textAlign: 'right' }]}>{statusText ? statusText : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, marginBottom) => {

        if (typeof marginBottom === 'undefined') {
            marginBottom = false;
        }

        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
            paddingLeft: R.dimens.padding_left_right_margin,
            paddingRight: R.dimens.padding_left_right_margin,
        }}>
            <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML style={[this.styles().contentItem, { fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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

export default AffiliateSchemeTypeMappingDetailScreen