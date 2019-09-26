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

export class UsedApiWiseReportListDetailScreen extends Component {
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
            <LinearGradient style={{ flex: 1, }}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.usedApiWiseReport}
                        textStyle={{ color: 'white' }}
                        backIconStyle={{ tintColor: 'white' }}
                        isBack={true}
                        toolbarColor={'transparent'}
                        nav={this.props.navigation} />

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            margin: R.dimens.margin_top_bottom,
                            backgroundColor: R.colors.cardBackground,
                            padding: 0,
                        }} cardRadius={R.dimens.detailCardRadius}>

                            {/* For UserName */}
                            <Text style={{
                                marginBottom: 0,
                                flex: 1,
                                textAlign: 'left',
                                margin: R.dimens.widget_top_bottom_margin,
                                marginLeft: R.dimens.padding_left_right_margin,
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.mediumText,
                                fontWeight: 'bold',
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.UserName)}</Text>

                            {/* For EmailID */}
                            <Text style={{
                                textAlign: 'left',
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: 0,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallText,
                                flex: 1,
                                fontFamily: Fonts.MontserratSemiBold
                            }}>{validateValue(item.EmailID)}</Text>

                            {/* For HTTPStatusCode */}
                            <RowItem
                                value={validateValue(item.HTTPStatusCode)}
                                title={R.strings.httpStatusCode}
                            />

                            {/* For httpErrorCode */}
                            <RowItem
                                title={R.strings.httpErrorCode}
                                value={validateValue(item.HTTPErrorCode)}
                            />

                            {/* For Status */}
                            <RowItem
                                title={R.strings.status}
                                value={item.Status == 1 ? R.strings.failure : R.strings.Success}
                                status={true}
                                color={item.Status == 1 ? R.colors.failRed : R.colors.successGreen}
                            />

                            {/* For CreatedDate */}
                            <RowItem
                                title={R.strings.Date}
                                value={convertDateTime(item.CreatedDate)}
                            />

                            {/* To set request */}
                            <ColumnItem
                                marginBottom={true} title={R.strings.request}
                                value={validateValue(item.Host) + validateValue(item.Path)}
                            />

                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient >
        )
    }
}

export default UsedApiWiseReportListDetailScreen
