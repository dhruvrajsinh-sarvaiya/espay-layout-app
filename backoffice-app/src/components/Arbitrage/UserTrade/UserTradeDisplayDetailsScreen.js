// UserTradeDisplayDetailsScreen.js
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';


class UserTradeDisplayDetailsScreen extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
            title: props.navigation.state.params && props.navigation.state.params.title,
        };
    }

    componentDidMount() {//Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        
        let { item } = this.state
        let fColor = this.state.item.Type.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink;

        return (
            <LinearGradient
                style={{ flex: 1 }} locations={[0, 10]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    toolbarColor={'transparent'} textStyle={{ color: 'white' }} title={this.state.title}
                    backIconStyle={{ tintColor: 'white' }}
                    isBack={true} nav={this.props.navigation}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* Card for rest details to display item */}
                    <CardView
                        style={{
                            margin: R.dimens.margin_top_bottom, padding: 0, backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                        {/* Currency with Icon  */}
                        <View
                            style={{
                                flexDirection: 'row', margin: R.dimens.widget_top_bottom_margin,
                            }}>
                            <View>
                                <View style={{
                                    width: R.dimens.signup_screen_logo_height,
                                    borderRadius: R.dimens.paginationButtonRadious,
                                    height: R.dimens.signup_screen_logo_height, backgroundColor: 'transparent',
                                }}>
                                    <ImageViewWidget
                                        height={R.dimens.signup_screen_logo_height}
                                        width={R.dimens.signup_screen_logo_height}
                                        url={this.state.item.PairName ?
                                            this.state.item.PairName.split('_')[0]
                                            : ''}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, paddingLeft: R.dimens.WidgetPadding }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.item.PairName ? this.state.item.PairName.replace('_', '/') : '-'} </Text>
                                <TextViewMR style={{ color: fColor, fontSize: R.dimens.mediumText }}>{this.state.item.Type.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.strings.buy : R.strings.sell}</TextViewMR>
                            </View>
                        </View>

                        {/*  list */}
                        <RowItem title={R.strings.Trn_No}
                            value={validateValue(item.TrnNo)} />
                        <RowItem
                            value={(parseIntVal((item.MemberID))) !== 'NaN' ? parseIntVal((item.MemberID)) : '-'}
                            title={R.strings.userid}
                        />
                        <RowItem
                            title={R.strings.Amount}
                            value={(parseFloatVal((item.Amount))) !== 'NaN' ? parseFloatVal((item.Amount)).toFixed(8) : '-'} />
                        <RowItem title={R.strings.price}
                            value={(parseFloatVal((item.Price))) !== 'NaN' ?
                                parseFloatVal((item.Price)).toFixed(8) : '-'}
                        />
                        <RowItem title={R.strings.Total}
                            value={(parseFloatVal((item.Total))) !== 'NaN' ?
                                parseFloatVal((item.Total)).toFixed(8) : '-'} />
                        <RowItem title={R.strings.orderType}
                            value={validateValue(item.OrderType)}
                        />
                        <RowItem
                            value={validateValue(item.StatusText)}
                            title={R.strings.status}
                        />
                        <RowItem
                            marginBottom={true}
                            title={R.strings.txnDate}
                            value={convertDate(item.DateTime)}
                        />

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }
}

export default UserTradeDisplayDetailsScreen