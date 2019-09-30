import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import { isCurrentScreen } from '../../Navigation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';


class ProfileConfigListDetailScreen extends Component {
    constructor(props) {
        super(props);
        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        let item = this.state.item;
        return (
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]} start={{ x: 0, y: 0 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
                end={{ x: 0, y: 1 }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true} nav={this.props.navigation}
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    title={R.strings.profileConfigDetail}
                />


                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    {/* Amount and CoinName is Merged With Toolbar using below design */}
                    <View
                        style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text
                            style={{
                                fontFamily: Fonts.MontserratSemiBold,
                                fontSize: R.dimens.smallText, color: R.colors.white,
                                textAlign: 'left',
                            }}>
                            {R.strings.profile}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{item.ProfileName ? item.ProfileName : ' - '} </Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/*  list */}
                        {this.rowItem(R.strings.type, item.TypeName ? item.TypeName : ' - ')}
                        {this.rowItem(R.strings.profileLevel, item.Profilelevel ? validateValue(item.Profilelevel) : ' - ')}
                        {this.rowItem(R.strings.subscriptionAmount, item.SubscriptionAmount ? validateValue(item.SubscriptionAmount) : ' - ')}
                        {this.rowItem(R.strings.Depositfee, item.DepositFee ? validateValue(item.DepositFee) : ' - ')}
                        {this.rowItem(R.strings.Withdrawelfee, item.Withdrawalfee ? validateValue(item.Withdrawalfee) : ' - ')}
                        {this.rowItem(R.strings.profileFee, item.ProfileFree ? validateValue(item.ProfileFree) : ' - ')}
                        {this.rowItem(R.strings.Tradingfee, item.Tradingfee ? validateValue(item.Tradingfee) : ' - ')}
                        {this.rowItem(R.strings.recursive, item.IsRecursive ? R.strings.true : R.strings.false)}
                        {this.rowItem(R.strings.profileExpiry, item.IsProfileExpiry ? R.strings.true : R.strings.false)}
                        {this.rowItem(R.strings.Date, convertDate(this.state.item.CreatedDate))}

                        <TextViewHML style={[this.styles().contentItem, {
                            paddingTop: R.dimens.widgetMargin,
                            color: R.colors.textSecondary, paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                        }]}>{R.strings.description + ': '}</TextViewHML>
                        <TextViewHML style={[this.styles().contentItem, {
                            color: R.colors.textPrimary, paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            marginBottom: R.dimens.widgetMargin
                        }]}>{item.Description ? item.Description : ''}
                        </TextViewHML>

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

    rowItem = (title, value, marginBottom) => {

        if (typeof marginBottom === 'undefined') { marginBottom = false; }

        //set status color
        let statusColor
        if (value === R.strings.Active)
            statusColor = R.colors.buyerGreen
        else if (value === R.strings.Inactive)
            statusColor = R.colors.failRed
        else
            statusColor = R.colors.textPrimary
        return <View style={{
            paddingRight: R.dimens.padding_left_right_margin,
            marginTop: R.dimens.widgetMargin,
            marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0, flexDirection: 'row',
            justifyContent: 'space-between', paddingLeft: R.dimens.padding_left_right_margin,

        }}>
            <TextViewHML
                style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{title}</TextViewHML>
            <TextViewHML
                style={[this.styles().contentItem, { color: statusColor ? statusColor : R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                flex: 1, color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            }
        }
    }
}

export default ProfileConfigListDetailScreen