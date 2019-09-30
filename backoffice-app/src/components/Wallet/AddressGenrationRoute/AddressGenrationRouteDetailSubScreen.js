import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';


class AddressGenrationRouteDetailSubScreen extends Component {

    constructor(props) {
        super(props);

        // TrnType=9 for address genration route else withdraw route
        let TrnType = props.navigation.state.params && props.navigation.state.params.TrnType

        //fill all the data from previous screen
        this.state = {
            TrnType: TrnType,
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
    }

    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {

        let item = this.state.item
        return (
            
            <LinearGradient style={{ flex: 1 }}
                locations={[0, 10]}  start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    textStyle={{ color: 'white' }}
                    toolbarColor={'transparent'}
                    title={this.state.TrnType == 9 ? R.strings.addressGenrationRouteDetail : R.strings.withdrawRouteDetail}
                    isBack={true} nav={this.props.navigation} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{item.RouteName ? item.RouteName : ' - '}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{item.AssetName.toUpperCase() ? item.AssetName.toUpperCase() : ' - '}</Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        <View style={{
                            flex: 1,
                            marginTop: R.dimens.widgetMargin,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                        }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.providerWalletId + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.ProviderWalletID ? item.ProviderWalletID : '-'}</TextViewHML>
                        </View>


                        <RowItem title={R.strings.priority} value={validateValue(item.Priority)} />
                        <RowItem title={R.strings.serviceDetailId} value={validateValue(item.ServiceProDetailId)} />
                        <RowItem title={R.strings.confirmationCount} value={validateValue(item.ConfirmationCount)} />

                        {this.state.TrnType == 6 &&
                            <RowItem
                                title={R.strings.convertAmount}
                                value={validateValue(parseFloatVal(item.ConvertAmount).toFixed(8))}
                                marginBottom={this.state.TrnType === 6 ? true : false}
                            />
                        }

                        {this.state.TrnType == 9 &&
                            <View>
                                <RowItem title={R.strings.accountNoLength} value={validateValue(item.AccountNoLen)} />
                                <RowItem title={R.strings.accountNoStartsWith} value={validateValue(item.AccNoStartsWith)} />
                                <RowItem
                                    title={R.strings.accountNoValidation}
                                    value={validateValue(item.AccNoValidationRegex)}
                                    marginBottom={true}
                                />
                            </View>
                        }

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }
}

export default AddressGenrationRouteDetailSubScreen