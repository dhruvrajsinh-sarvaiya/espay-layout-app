// ArbitrageApiResponseDetailsScreen.js
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import CardView from '../../../native_theme/components/CardView';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { validateValue } from '../../../validations/CommonValidation';

class ArbitrageApiResponseDetailsScreen extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            item: props.navigation.state.params && props.navigation.state.params.item,
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount() {
        changeTheme();
        //Add this method to change theme based on stored theme name.
    }

    render() {
        let { item } = this.state
        return (
            <LinearGradient 
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}
                style={{ flex: 1, }}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        title={R.strings.arbitrageApiResponse}
                        textStyle={{ color: 'white' }}
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

                            {/* Display Response Title and Value */}
                            <View style={{ marginTop: R.dimens.margin }}>

                                <TextViewHML style={[this.styles().title]}>{R.strings.balanceRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.BalanceRegex)}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.statusRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.StatusRegex)}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.statusMsgRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.StatusMsgRegex)}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.trnRefNoRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.TrnRefNoRegex)}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.oprTrnRefNoRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.OprTrnRefNoRegex)}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.responseCodeRegex}</TextViewHML>

                                {/* use trim to remove unwanted space */}
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.ResponseCodeRegex.trim())}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.errorCodeRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.ErrorCodeRegex.trim())}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.paramOneRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.Param1Regex.trim())}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.paramTwoRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.Param2Regex.trim())}</TextViewHML>

                                <TextViewHML style={[this.styles().title]}>{R.strings.paramThreeRegex}</TextViewHML>
                                <TextViewHML style={[this.styles().value]}>{validateValue(item.Param3Regex.trim())}</TextViewHML>

                                <RowItem title={R.strings.status} marginBottom={true} status={true} color={item.Status ? R.colors.successGreen : R.colors.failRed} value={item.Status ? R.strings.Success : R.strings.Failed} />

                            </View>
                        </CardView>
                    </ScrollView>
                </SafeView>
            </LinearGradient>
        )

    }
    // style for this class
    styles = () => {
        return {
            title: {
                flex: 1,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                marginTop: R.dimens.widgetMargin,
            },
            value: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
                flex: 1,
            }
        }
    }
}

export default ArbitrageApiResponseDetailsScreen