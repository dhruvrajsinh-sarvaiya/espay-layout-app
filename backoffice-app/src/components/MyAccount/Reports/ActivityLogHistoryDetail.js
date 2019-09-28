import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import { isCurrentScreen } from '../../Navigation';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import RowItem from '../../../native_theme/components/RowItem';

class ActivityLogHistoryDetail extends Component {

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

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {
        let { item } = this.state;
        return (
            <LinearGradient style={{ flex: 1 }}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                locations={[0, 10]}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'}
                    textStyle={{ color: 'white' }}
                    title={R.strings.activityLogHistoryDetail}
                    isBack={true} nav={this.props.navigation} />


                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    {/* userName is Merged With Toolbar using below design */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                fontSize: R.dimens.smallText,
                                textAlign: 'left',
                                color: R.colors.white,
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.userName}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{item.UserName ? item.UserName : ' - '}</Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom,
                        padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        <Text style={{
                            marginTop: R.dimens.widgetMargin,
                            paddingLeft: R.dimens.margin,
                            paddingRight: R.dimens.margin,
                            color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                        }}>{validateValue(item.Firstname) + ' ' + validateValue(item.Lastname)}</Text>

                        <RowItem title={R.strings.deviceId} value={validateValue(item.DeviceId)} />
                        <RowItem title={R.strings.IPAddress} value={validateValue(item.IPAddress)} />
                        <RowItem title={R.strings.aliasName} value={validateValue(item.AliasName)} />
                        <RowItem title={R.strings.moduleType} value={validateValue(item.ModuleTypeName)} />
                        <RowItem title={R.strings.activityType} value={validateValue(item.ActivityType)} />
                        <RowItem title={R.strings.Date} value={validateValue(convertDateTime(item.CreatedDate))} />

                        <Text style={{
                            marginTop: R.dimens.widgetMargin,
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                        }}>{(item.remarks ? item.remarks : ' - ')}</Text>

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

}

export default ActivityLogHistoryDetail