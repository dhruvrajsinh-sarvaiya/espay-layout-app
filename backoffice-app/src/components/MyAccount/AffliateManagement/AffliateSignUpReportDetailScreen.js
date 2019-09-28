import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import RowItem from '../../../native_theme/components/RowItem';

class AffliateSignUpReportDetailScreen extends Component {

    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        let item = this.state.item;
        //set status color 
        let statusColor = R.colors.textPrimary
        if (item.Status == 1) statusColor = R.colors.successGreen
        else if (item.Status == 0) statusColor = R.colors.failRed

        return (
            <LinearGradient style={{ flex: 1 }} locations={[0, 10]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    backIconStyle={{ tintColor: 'white' }}
                    toolbarColor={'transparent'} textStyle={{ color: 'white' }}
                    title={R.strings.affliateSignUpReportDetail}
                    isBack={true} nav={this.props.navigation} />

                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    {/* show userName */}
                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={
                            {
                                color: R.colors.white, textAlign: 'left',
                                fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold,
                            }}>{R.strings.userName}</Text>

                        <Text style={
                            {
                                fontSize: R.dimens.mediumText, fontFamily: Fonts.HindmaduraiSemiBold,
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
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                        }}>{validateValue(item.FirstName) + ' ' + validateValue(item.LastName)}</Text>

                        {/*  list */}
                        <RowItem title={R.strings.MobileNo} value={validateValue(item.Mobile)} />
                        <RowItem title={R.strings.Date} value={validateValue(convertDateTime(item.JoinDate))} />
                        <RowItem title={R.strings.type} value={validateValue(item.SchemeType)} />
                        <RowItem title={R.strings.EmailAddrees} value={validateValue(item.Email)} />
                        <RowItem title={R.strings.status} value={item.Status == 1 ? R.strings.Active : R.strings.Inactive} marginBottom={true} color={statusColor} status={true} />

                    </CardView>
                </ScrollView>
            </LinearGradient >
        )
    }
}

export default AffliateSignUpReportDetailScreen