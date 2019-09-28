import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';


class UserTradingSummaryDetailScreen extends Component {

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

        let fColor = this.state.item.Type.toLowerCase().includes('BUY'.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;
        let { item } = this.state

        return (
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    title={R.strings.TradeSummary}
                    isBack={true} nav={this.props.navigation} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Currency with Icon  */}
                        <View style={{
                            margin: R.dimens.widget_top_bottom_margin,
                            flexDirection: 'row',
                        }}>
                            <View>

                                <View style={{
                                    width: R.dimens.signup_screen_logo_height, height: R.dimens.signup_screen_logo_height,
                                    borderRadius: R.dimens.paginationButtonRadious,
                                    backgroundColor: 'transparent',
                                }}>
                                    <ImageViewWidget url={this.state.item.PairName ? this.state.item.PairName.split('_')[0] : ''} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                                </View>
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding }}>
                                <Text style={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                                }}>{this.state.item.PairName ? this.state.item.PairName.replace('_', '/') : '-'} </Text>
                                <TextViewMR style={{ color: fColor, fontSize: R.dimens.mediumText }}>{this.state.item.Type.toUpperCase()}</TextViewMR>
                            </View>

                        </View>

                        {/*  list */}
                        <RowItem title={R.strings.Trn_No} value={validateValue(item.TrnNo)} />
                        <RowItem title={R.strings.Amount} value={(parseFloatVal((item.Amount))) !== 'NaN' ? parseFloatVal((item.Amount)).toFixed(8) : '-'} />
                        <RowItem title={R.strings.price} value={(parseFloatVal((item.Price))) !== 'NaN' ? parseFloatVal((item.Price)).toFixed(8) : '-'} />
                        <RowItem title={R.strings.Total} value={(parseFloatVal((item.Total))) !== 'NaN' ? parseFloatVal((item.Total)).toFixed(8) : '-'} />
                        <RowItem title={R.strings.orderType} value={validateValue(item.OrderType)} />
                        <RowItem title={R.strings.status} value={validateValue(item.StatusText)} />
                        <RowItem title={R.strings.txnDate} value={convertDate(item.DateTime)} marginBottom={true} />

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }
}

export default UserTradingSummaryDetailScreen