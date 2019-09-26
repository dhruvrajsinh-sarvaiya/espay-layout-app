import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import { isCurrentScreen } from '../../Navigation';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import { validateValue } from '../../../validations/CommonValidation';

class UserSignUpReportDetail extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = { item: props.navigation.state.params && props.navigation.state.params.item, };
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        let item = this.state.item;
        //set status color 
        let statusColor = R.colors.textPrimary
        if (item.Status == 1)
            statusColor = R.colors.successGreen
        else if (item.Status == 0)
            statusColor = R.colors.failRed

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
                    textStyle={{ color: 'white' }}
                    title={R.strings.userSignUpReportDetail}
                    isBack={true} nav={this.props.navigation}
                    toolbarColor={'transparent'} />


                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                    showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* userName Toolbar using below design */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                color: R.colors.white,
                                textAlign: 'left',
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.userName}</Text>

                        <Text style={
                            {
                                textAlign: 'left',
                                fontSize: R.dimens.mediumText,
                                fontFamily: Fonts.HindmaduraiSemiBold,
                                color: R.colors.white,
                            }}>{item.UserName ? item.UserName : ' - '}</Text>
                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        margin: R.dimens.margin_top_bottom, padding: 0,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        {/*  name */}
                        <Text style={{
                            paddingLeft: R.dimens.padding_left_right_margin, paddingRight: R.dimens.padding_left_right_margin,
                            marginTop: R.dimens.widgetMargin, color: R.colors.textPrimary,
                            fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                        }}>{(item.Firstname ? item.Firstname : ' - ') + ' ' + (item.Lastname ? item.Lastname : ' - ')}</Text>

                        {/*  list */}
                        <RowItem title={R.strings.MobileNo} value={validateValue(item.Mobile)} />
                        <RowItem title={R.strings.regType} value={validateValue(item.RegType)} />
                        <RowItem title={R.strings.Date} value={validateValue(convertDateTime(item.CreatedDate))} />
                        <RowItem title={R.strings.EmailAddrees} value={validateValue(item.Email)} />
                        <RowItem title={R.strings.status} value={item.Status == 1 ? R.strings.Active : R.strings.Inactive} marginBottom={true} color={statusColor} status={true} />

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }
}

export default UserSignUpReportDetail