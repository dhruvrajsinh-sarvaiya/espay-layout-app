import React, { Component } from 'react'
import { Text, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, convertDateTime, parseFloatVal } from '../../../controllers/CommonUtils';
import { validateValue } from '../../../validations/CommonValidation';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import ColumnItem from '../../../native_theme/components/ColumnItem';

export class ConflictHistoryDetailScreen extends Component {
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

        let statusColor

        // Cancelled
        if (item.Status == 0)
            statusColor = R.colors.yellow
        // Success
        else if (item.Status == 1)
            statusColor = R.colors.successGreen
        // Success
        else if (item.Status == 9)
            statusColor = R.colors.failRed

        return (
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        textStyle={{ color: 'white' }}
                        title={R.strings.conflictHistory}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* For WalletTypeName */}
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
                            }}>{validateValue(item.WalletTypeName)}</Text>

                            {/* For SerProIDName */}
                            <Text style={{
                                textAlign: 'left',
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: 0,
                                flex: 1,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.SerProIDName)}</Text>

                            {/* For ResolvedByName */}
                            <RowItem
                                title={R.strings.resolvedBy}
                                value={validateValue(item.ResolvedByName)}
                            />

                            {/* For misMatchAmount */}
                            <RowItem
                                title={R.strings.misMatchAmount}
                                value={(parseFloatVal(item.MisMatchingAmount).toFixed(8) !== 'NaN' ? (parseFloatVal(item.MisMatchingAmount).toFixed(8)) : '-')}
                            />

                            {/* For settledAmount */}
                            <RowItem
                                title={R.strings.settledAmount}
                                value={(parseFloatVal(item.settledAmount).toFixed(8) !== 'NaN' ? (parseFloatVal(item.SettledAmount).toFixed(8)) : '-')}
                            />

                            {/* For Status */}
                            <RowItem
                                title={R.strings.status}
                                value={item.StrStatus}
                                status={true}
                                color={statusColor}
                            />

                            {/* For resolvedDate */}
                            <RowItem
                                title={R.strings.resolvedDate}
                                value={convertDateTime(item.ResolvedDate)}
                            />

                            {/* To set Remarks */}
                            <ColumnItem
                                marginBottom={true} title={R.strings.remarks}
                                value={validateValue(item.Remarks)}
                            />
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        )
    }
}

export default ConflictHistoryDetailScreen
