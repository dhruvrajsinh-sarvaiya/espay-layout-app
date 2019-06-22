import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Linking,
    Text
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../controllers/CommonUtils';
import { validateValue } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { isCurrentScreen } from '../Navigation';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class DepositHistoryDetail extends Component {

    constructor(props) {
        super(props);

        //To bind all method
        this.onTrnLinkPress = this.onTrnLinkPress.bind(this);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //This Method Is used to open Address in Browser With Specific Link
    onTrnLinkPress = () => {
        try {
            let res = (this.state.item.hasOwnProperty('ExplorerLink')) ? JSON.parse(this.state.item.ExplorerLink) : '';
            Linking.openURL((res.length) ? res[0].Data + '/' + this.state.item.TrnId : this.state.item.TrnId);
        } catch (error) {
            //handle catch block here
        }
    }

    render() {

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView isDetail={true} style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.TransactionDetail}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        {/* Amount and CoinName is Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={
                                {
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{R.strings.TransactionAmount.toUpperCase()}</TextViewMR>
                            <Text style={
                                {
                                    fontSize: R.dimens.largeText,
                                    fontFamily: Fonts.MontserratSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{((parseFloatVal((this.state.item.Amount)).toFixed(8)) !== 'NaN' ? parseFloatVal((this.state.item.Amount)).toFixed(8) : '-')} {this.state.item.CoinName ? this.state.item.CoinName : '-'}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{ margin: R.dimens.margin_top_bottom, padding: 0, backgroundColor: R.colors.cardBackground }} cardRadius={R.dimens.detailCardRadius}>

                            {/* Holding Currency with Icon and Balance */}
                            <View style={{
                                flexDirection: 'row',
                                margin: R.dimens.widget_top_bottom_margin,
                            }}>
                                <View style={{ width: wp('20%') }}>
                                    <View style={{
                                        width: R.dimens.signup_screen_logo_height,
                                        height: R.dimens.signup_screen_logo_height,
                                        backgroundColor: 'transparent',
                                        borderRadius: R.dimens.paginationButtonRadious,
                                    }}>
                                        <ImageViewWidget url={this.state.item.CoinName ? this.state.item.CoinName : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                    </View>
                                </View>
                                <View style={{ width: wp('80%'), justifyContent: 'center' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.item.CoinName ? (this.state.item.CoinName.toUpperCase()) : '-'}</Text>
                                </View>
                            </View>

                            {/* Deposit History Result Details in list */}
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: 0,
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,

                            }}>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.TrnId}</TextViewHML>
                                {
                                    (this.state.item.TrnId && this.state.item.ExplorerLink && (this.state.item.IsInternalTrn == 2)) ?
                                        <TouchableOpacity onPress={() => this.onTrnLinkPress()}>
                                            <TextViewHML style={[this.styles().contentItem, { color: R.colors.accent }]}>{this.state.item.TrnId ? this.state.item.TrnId : '-'}</TextViewHML>
                                        </TouchableOpacity> :
                                        <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.TrnId ? this.state.item.TrnId : '-'}</TextViewHML>
                                }
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: 0,
                                paddingLeft: R.dimens.padding_left_right_margin,
                                paddingRight: R.dimens.padding_left_right_margin,

                            }}>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }]}>{R.strings.Address}</TextViewHML>
                                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textPrimary }]}>{this.state.item.Address ? this.state.item.Address : '-'}</TextViewHML>
                            </View>
                            {this.rowItem(R.strings.Trn_No, validateValue(this.state.item.TrnNo))}
                            {this.rowItem(R.strings.Information, this.state.item.Information ? this.state.item.Information : '-')}
                            {this.rowItem(R.strings.Date, this.state.item.Date ? convertDate(this.state.item.Date) : '-')}
                            {this.rowItem(R.strings.Status, this.state.item.StatusStr ? this.state.item.StatusStr : '-', true, true, this.state.item.Status)}
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        );
    }

    //For Display Title and Value 
    rowItem = (title, value, marginBottom = false, status = false, StatusCode) => {

        let color = R.colors.accent;
        if (status) {
            //To Display various Status Color in ListView
            if (StatusCode == 0) {
                color = R.colors.textPrimary
            }
            if (StatusCode == 1) {
                color = R.colors.successGreen
            }
            if (StatusCode == 2) {
                color = R.colors.failRed
            }
            if (StatusCode == 3) {
                color = R.colors.failRed
            }
            if (StatusCode == 4) {
                color = R.colors.accent
            }
            if (StatusCode == 5) {
                color = R.colors.sellerPink
            }
            if (StatusCode == 6) {
                color = R.colors.accent
            }
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
            <TextViewHML style={[this.styles().contentItem, { color: status ? color : R.colors.textPrimary, fontWeight: 'normal', textAlign: 'right' }]}>{value}</TextViewHML>
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

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositHistoryDetail)
