import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import ImageViewWidget from '../../widget/ImageViewWidget';
import RowItem from '../../../native_theme/components/RowItem';
import Button from '../../../native_theme/components/Button';

export class UserWalletsDetailScreen extends Component {
    constructor(props) {
        super(props);
        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }
    onViewReportButtonPress = async () => {

        //Redirect screeen for more list
        this.props.navigation.navigate('AuthUserAndWalletLedgerListScreen', { item: this.state.item })
    }
    componentDidMount = () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }
    
    render() {
        let { item } = this.state
        let color = R.colors.accent

        //set status color based on status code
        if (item.Status == 1)
            color = R.colors.successGreen
        else if (item.Status == 2 || item.Status == 5 || item.Status == 6 || item.Status == 9)
            color = R.colors.failRed

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>
                <SafeView style={{ flex: 1 }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.WalletDetails}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Transaction No Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={{
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{R.strings.Balance}</TextViewMR>
                            <Text style={{
                                fontSize: R.dimens.mediumText,
                                fontWeight: 'bold',
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            <View style={{ flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin, }}>
                                {/* Holding Currency with Icon and UserName */}
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>

                                <View style={{ flex: 1, marginLeft: R.dimens.margin }}>
                                    <Text style={{
                                        color: R.colors.textPrimary, fontSize: R.dimens.mediumText,
                                        fontWeight: 'bold', fontFamily: Fonts.MontserratSemiBold
                                    }}>{validateValue(item.WalletTypeName.toUpperCase())}</Text>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{validateValue(item.UserName)}</TextViewMR>
                                </View>
                            </View>

                            {/* To Show WalletName */}
                            <RowItem title={R.strings.WalletName} value={validateValue(item.Walletname)} />

                            {/* To Show InBoundBalance */}
                            <RowItem title={R.strings.InBoundBalance} value={validateValue(item.InBoundBalance)} />

                            {/* To Show OutBoundBalance */}
                            <RowItem title={R.strings.OutBoundBalance} value={validateValue(item.OutBoundBalance)} />

                            {/* To Show Organization name */}
                            <RowItem title={R.strings.Organization} value={validateValue(item.OrganizationName)} />

                            {/* To Show IsDefault */}
                            <RowItem title={R.strings.IsDefault} value={validateValue(item.IsDefaultWallet == 1 ? R.strings.yes_text : R.strings.no)} />

                            {/* To Show Status */}
                            <RowItem title={R.strings.Status} value={validateValue(item.StrStatus)} color={color} status={true} marginBottom={true} />
                        </CardView>

                        <View style={{ marginBottom: R.dimens.margin_top_bottom }}>
                            {/* To Set viewReport Button */}
                            <Button
                                title={R.strings.viewReport}
                                onPress={this.onViewReportButtonPress}
                                isRound={true}
                                isAlert={true}
                                style={{ position: 'absolute', bottom: -0, elevation: (R.dimens.CardViewElivation * 2) }}
                                textStyle={{ color: R.colors.white, padding: R.dimens.WidgetPadding }} />
                        </View>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )
    }
}

export default UserWalletsDetailScreen
