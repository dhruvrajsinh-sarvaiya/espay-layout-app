import React, { Component } from 'react'
import { View } from 'react-native'
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Separator from '../../../native_theme/components/Separator';

export default class TopGainerLoserItem extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size ||
            this.props.type !== nextProps.type ||
            this.props.isPortrait !== nextProps.isPortrait ||
            this.props.theme !== nextProps.theme) {
            return true;
        }
        return false;
    }
    render() {

        // Get required fields from props
        let { item: { PairName, Volume, ChangePer, LTP, High, Low }, index, size, isBoth } = this.props;

        let sign = ChangePer != 0 ? (ChangePer > 0 ? '+' : '') : '';
        let firstCurrency = PairName.split('_')[0];
        let secondCurrency = '/' + PairName.split('_')[1];

        // apply color based on sign
        let changeColor;
        if (sign === '' && ChangePer == 0) {
            changeColor = R.colors.textSecondary;
        } else if (sign === '+') {
            changeColor = R.colors.successGreen;
        } else {
            changeColor = R.colors.failRed;
        }

        return (
            <CustomView isBoth={isBoth !== undefined}>
                <View style={{ flex: 1 }}>
                    <View style={[{
                        flexDirection: 'row',
                        paddingLeft: R.dimens.widget_left_right_margin,
                        paddingRight: R.dimens.widget_left_right_margin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    },
                    typeof isBoth === 'undefined' ?
                        {
                            width: '100%',
                            marginTop: R.dimens.widgetMargin,
                        } : {
                            flex: 1,
                            marginTop: (index == 0) ? R.dimens.margin : R.dimens.widgetMargin,
                        }]}>

                        {typeof isBoth === 'undefined' && <TextViewMR style={{ width: '4%', color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{index + 1}.</TextViewMR>}

                        <View style={{ width: '40%' }}>
                            <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText }}><TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{firstCurrency}</TextViewMR>{secondCurrency}</TextViewMR>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.vol_24h} {Volume.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText, }}>{R.strings.h}: {High.toFixed(8)}</TextViewHML>
                        </View>

                        <View style={{ width: '30%' }}>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{LTP.toFixed(8)}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{' '}</TextViewHML>
                            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.l}: {Low.toFixed(8)}</TextViewHML>
                        </View>

                        <View style={{ width: typeof isBoth === 'undefined' ? '26%' : '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TextViewHML style={{
                                width: '75%',
                                padding: R.dimens.widgetMargin,
                                backgroundColor: changeColor,
                                color: R.colors.white,
                                fontSize: R.dimens.secondCurrencyText,
                                textAlign: 'center',
                                alignSelf: 'center'
                            }}>
                                {sign + ChangePer.toFixed(2) + '%'}
                            </TextViewHML>
                        </View>
                    </View>
                    {index !== size - 1 &&
                        <Separator />
                    }
                </View>
            </CustomView>
        )
    }
}

function CustomView(props) {
    if (props.isBoth) {
        return <View {...props} />
    } else {
        return <AnimatableItem>{props.children}</AnimatableItem>
    }
}