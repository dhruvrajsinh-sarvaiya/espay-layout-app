import React, { Component } from 'react'
import { Text, View } from 'react-native'
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import R from '../../../native_theme/R';
import Separator from '../../../native_theme/components/Separator';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';

export class WalletOrgLedgerListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item } = this.props;

        let crColor = R.colors.textSecondary
        let drColor = R.colors.textSecondary

        // Cr amount color
        if (item.CrAmount != 0)
            crColor = R.colors.successGreen

        // Dr amount color
        if (item.DrAmount != 0)
            drColor = R.colors.failRed

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1, borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>
                            {/* for show trn id and Amount */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {R.strings.TrnId + ': ' + item.LedgerId}
                                </Text>
                                <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, textAlign: 'right' }}>
                                    {parseFloatVal(item.Amount).toFixed(8).toString()}
                                </TextViewMR>
                            </View>

                            {/* for show Remarks */}
                            <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Remarks}</TextViewHML>

                            {/* for show pre and post Balance */}
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Pre_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PreBal.toFixed(8)}</TextViewHML>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Post_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PostBal.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* for show horizontal line */}
                            <Separator style={{ marginTop: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />

                            {/* for show CR Amount*/}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
                                    <StatusChip color={crColor} value={R.strings.Cr} />

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: crColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.CrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>
                            </View>

                            {/* for show DR Amount and Date*/}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center' }}>
                                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <StatusChip color={drColor} value={R.strings.Dr} />

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: drColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.DrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '50%' }}>
                                    <ImageTextButton
                                        style=
                                        {{ 
                                            margin: 0, 
                                            paddingRight: R.dimens.LineHeight, 
                                        }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ 
                                            width: R.dimens.smallestText, 
                                            height: R.dimens.smallestText, 
                                            tintColor: R.colors.textSecondary 
                                        }}
                                    />
                                    <TextViewHML 
                                    style={{ 
                                        alignSelf: 'center', 
                                        color: R.colors.textSecondary, 
                                        fontSize: R.dimens.smallestText, }}>
                                        {convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

export default WalletOrgLedgerListItem
