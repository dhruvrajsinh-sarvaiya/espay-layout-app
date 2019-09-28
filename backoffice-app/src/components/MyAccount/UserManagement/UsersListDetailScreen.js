import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
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
import RowItem from '../../../native_theme/components/RowItem';

export class UsersListDetailScreen extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        };
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

        else if (item.Status == 0)
            color = R.colors.failRed

        return (
            <LinearGradient end={{ x: 0, y: 1 }} style={{ flex: 1, }}
                start={{ x: 0, y: 0 }}
                locations={[0, 1]}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
            >
                <SafeView style={{
                    flex: 1
                }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        title={R.strings.User_Detail}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }} isBack={true} nav={this.props.navigation} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                        {/* Transaction No Merged With Toolbar using below design */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <TextViewMR style={{
                                fontSize: R.dimens.smallText,
                                color: R.colors.white,
                                textAlign: 'left',
                            }}>{R.strings.userName}</TextViewMR>
                            <Text style={{
                                fontSize: R.dimens.mediumText,
                                fontWeight: 'bold',
                                color: R.colors.white,
                                textAlign: 'left',
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{(validateValue(item.UserName))}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            backgroundColor: R.colors.cardBackground,
                            padding: 0, margin: R.dimens.margin_top_bottom,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* For WalletTypeName */}
                            <Text style={{
                                marginLeft: R.dimens.padding_left_right_margin,
                                textAlign: 'left',
                                fontSize: R.dimens.mediumText,
                                margin: R.dimens.widget_top_bottom_margin,
                                fontWeight: 'bold',
                                fontFamily: Fonts.MontserratSemiBold,
                                marginBottom: 0, flex: 1, color: R.colors.textPrimary,
                            }}>{validateValue(item.FirstName)
                                + ' ' + validateValue(item.LastName)}
                            </Text>

                            {/* For SerProIDName */}
                            <Text style={{
                                textAlign: 'left',
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: 0,
                                flex: 1,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.Email)}</Text>


                            {/* To Show MobileNo */}
                            <RowItem title={R.strings.MobileNo} value={validateValue(item.Mobile)} />

                            {/* To Show Role */}
                            <RowItem title={R.strings.Role} value={validateValue(item.InBoundBalance)} />

                            {/* To Show PermissionGroup */}
                            <RowItem title={R.strings.PermissionGroup} value={validateValue(item.PermissionGroup)} />

                            {/* To Show locked Status */}
                            <RowItem title={R.strings.locked} value={item.IsLockOut == 1 ? R.strings.yes_text : R.strings.no}
                                color={item.IsLockOut == 1 ? R.colors.failRed : R.colors.successGreen} status={true} />

                            {/* To Show UserType */}
                            <RowItem title={R.strings.UserType} value={item.IsAdmin == 1 ? R.strings.backofficeUser : R.strings.frontUser}
                                color={item.IsAdmin == 1 ? R.colors.successGreen : R.colors.accent} status={true} />

                            {/* To Show locked Status */}
                            <RowItem title={R.strings.twoFa_status} value={item.TwoFactorEnabled == 0 ? R.strings.disabled : R.strings.enabled}
                                color={item.TwoFactorEnabled == 0 ? R.colors.textSecondary : R.colors.accent} status={true} />

                            {/* For CreatedDate  */}
                            <RowItem title={R.strings.createdDate} value={convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)} />

                            {/* To Show Status */}
                            <RowItem title={R.strings.Status} value={validateValue(item.StatusText)} color={color} status={true} marginBottom={true} />
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )
    }
}

export default UsersListDetailScreen
