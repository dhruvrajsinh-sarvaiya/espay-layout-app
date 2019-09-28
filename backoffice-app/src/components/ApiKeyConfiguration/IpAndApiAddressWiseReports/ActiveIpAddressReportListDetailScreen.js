import React, { Component } from 'react'
import { Text, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, convertDateTime } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import ColumnItem from '../../../native_theme/components/ColumnItem';

export class ActiveIpAddressReportListDetailScreen extends Component {
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

    shouldComponentUpdate(nextProps, nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    render() {
        let { item } = this.state

        return (
            <LinearGradient style={{ flex: 1, }} locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        textStyle={{ color: 'white' }}
                        title={R.strings.activeIpAddressReport}
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        keyboardShouldPersistTaps={'always'}>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            margin: R.dimens.margin_top_bottom,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            <Text style={{
                                textAlign: 'left',
                                margin: R.dimens.widget_top_bottom_margin,
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: 0,
                                flex: 1,
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.mediumText,
                                fontWeight: 'bold',
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.UserName)}</Text>

                            <Text style={{
                                textAlign: 'left',
                                /*    margin: R.dimens.widget_top_bottom_margin,*/
                                marginBottom: 0,
                                flex: 1,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold,
                                marginLeft: R.dimens.padding_left_right_margin,
                            }}>{validateValue(item.EmailID)}</Text>

                            {/* For IPAddress */}
                            <RowItem
                                value={validateValue(item.IPAddress)}
                                title={R.strings.IPAddress}
                            />

                            {/* For WhitelistIP */}
                            <RowItem
                                title={R.strings.ipWhitelisting}
                                value={item.WhitelistIP == 1 ? R.strings.yes_text : R.strings.no}
                            />

                            {/* For CreatedDate */}
                            <RowItem
                                value={convertDateTime(item.CreatedDate)}
                                title={R.strings.Date}
                            />

                            {/* To set apiAccess */}
                            <ColumnItem
                                marginBottom={true}
                                title={R.strings.apiAccess}
                                value={validateValue(item.Host) + validateValue(item.Path)}
                            />

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        )
    }
}

export default ActiveIpAddressReportListDetailScreen
