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
import { Fonts } from '../../../controllers/Constants';
import { validateValue } from '../../../validations/CommonValidation';
import RowItem from '../../../native_theme/components/RowItem';

class CustomerListDetailScreen extends Component {

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

        return (
            <LinearGradient style={{ flex: 1 }}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                locations={[0, 10]}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    toolbarColor={'transparent'}
                    backIconStyle={{ tintColor: 'white' }}
                    textStyle={{ color: 'white' }}
                    title={R.strings.customerDetail}
                    isBack={true} nav={this.props.navigation} />


                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                    <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                        <Text style={this.styles().textStyle}>{R.strings.userName}</Text>

                        <Text style={{
                            fontSize: R.dimens.mediumText,
                            fontFamily: Fonts.HindmaduraiSemiBold,
                            color: R.colors.white,
                            textAlign: 'left',
                        }}>{item.UserName ? item.UserName : ' - '}</Text>

                    </View>

                    {/* Card for rest details to display item */}
                    <CardView style={{
                        padding: 0,
                        margin: R.dimens.margin_top_bottom,
                        backgroundColor: R.colors.cardBackground,
                    }} cardRadius={R.dimens.detailCardRadius}>

                        <Text style={{
                            marginTop: R.dimens.widgetMargin,
                            paddingLeft: R.dimens.padding_left_right_margin,
                            paddingRight: R.dimens.padding_left_right_margin,
                            color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold,
                        }}>{(item.Firstname ? item.Firstname : ' - ') + ' ' + (item.Lastname ? item.Lastname : ' - ')}</Text>

                        {/*  list */}
                        <RowItem title={R.strings.MobileNo} value={validateValue(item.Mobile)} />
                        <RowItem title={R.strings.regType} value={validateValue(item.RegType)} />
                        <RowItem title={R.strings.Date} value={validateValue(convertDateTime(item.formatedDateChganged))} />
                        <RowItem title={R.strings.EmailAddrees} value={validateValue(item.Email)} />
                        <RowItem title={R.strings.status} value={item.Status === 1 ? R.strings.Active : R.strings.Inactive} status={true} color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed} marginBottom={true} />

                    </CardView>
                </ScrollView>
            </LinearGradient >
        );
    }

    styles = () => {
        return {
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            },
            textStyle: {
                fontSize: R.dimens.smallText,
                color: R.colors.white,
                textAlign: 'left',
                fontFamily: Fonts.MontserratSemiBold,
            }
        }
    }
}

export default CustomerListDetailScreen