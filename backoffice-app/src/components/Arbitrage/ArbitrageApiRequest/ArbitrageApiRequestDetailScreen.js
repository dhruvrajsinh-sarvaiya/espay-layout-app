// ArbitrageApiRequestDetailScreen
import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import RowItem from '../../../native_theme/components/RowItem';
import TextViewHML from '../../../native_theme/components/TextViewHML';

class ArbitrageApiRequestDetailScreen extends Component {
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

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps);
        //stop twice api call
    }

    render() {
        let { item } = this.state
        return (
            <LinearGradient style={{ flex: 1, }}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                colors={[R.colors.detailBgLight, R.colors.detailBgDark]}>

                <SafeView style={{ flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        backIconStyle={{ tintColor: 'white' }}
                        toolbarColor={'transparent'}
                        title={R.strings.arbitrageAPIRequest}
                        textStyle={{ color: 'white' }}
                        isBack={true} nav={this.props.navigation} />

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: R.dimens.margin_top_bottom }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}>

                        {/* To show APIName */}
                        <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                            <Text style={
                                {
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                    fontFamily: Fonts.MontserratSemiBold,
                                }}>{R.strings.apiName}</Text>

                            <Text style={
                                {
                                    fontSize: R.dimens.mediumText,
                                    fontFamily: Fonts.HindmaduraiSemiBold,
                                    color: R.colors.white,
                                    textAlign: 'left',
                                }}>{item.APIName}</Text>
                        </View>

                        {/* Card for rest details to display item */}
                        <CardView style={{
                            padding: 0,
                            backgroundColor: R.colors.cardBackground,
                            margin: R.dimens.margin_top_bottom,
                        }} cardRadius={R.dimens.detailCardRadius}>


                            <RowItem title={R.strings.responseSuccess} value={item.ResponseSuccess ? item.ResponseSuccess : '-'} />

                            <RowItem title={R.strings.responseFailure} value={item.ResponseFailure ? item.ResponseFailure : '-'} />

                            <RowItem title={R.strings.responseHold} value={item.ResponseHold ? item.ResponseHold : '-'} />

                            <RowItem title={R.strings.contentType} value={item.ContentType ? item.ContentType : '-'} />

                            <RowItem title={R.strings.methodType} value={item.MethodType ? item.MethodType : '-'} />

                            <RowItem title={R.strings.hashType} value={item.HashType ? item.HashType : '-'} />

                            <RowItem title={R.strings.appType} value={item.AppType ? item.AppType : '-'} />

                            <RowItem title={R.strings.parsingDataID} value={item.ParsingDataID ? item.ParsingDataID : '-'} />

                            <RowItem title={R.strings.appTypeText} value={item.AppTypeText ? item.AppTypeText : '-'} />

                            <TextViewHML style={[this.styles().title]}>{R.strings.apiSendUrl}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{item.APISendURL}</TextViewHML>

                            <TextViewHML style={[this.styles().title]}>{R.strings.apiBalUrl}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{item.APIBalURL}</TextViewHML>

                            <TextViewHML style={[this.styles().title]}>{R.strings.apiRequestBody}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{item.APIRequestBody}</TextViewHML>

                            <TextViewHML style={[this.styles().title]}>{R.strings.authorizeHeader}</TextViewHML>
                            <TextViewHML style={[this.styles().value]}>{item.AuthHeader}</TextViewHML>

                            <RowItem title={R.strings.status} marginBottom={true} status={true} color={item.Status ? R.colors.successGreen : R.colors.failRed} value={item.Status ? R.strings.Success : R.strings.Failed} />
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
                marginTop: R.dimens.widgetMargin,
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            },
            value: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                flex: 1,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            }
        }
    }
}

export default ArbitrageApiRequestDetailScreen