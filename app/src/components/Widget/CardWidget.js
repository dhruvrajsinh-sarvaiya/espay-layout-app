import React from 'react'
import { Component } from 'react';
import { View, Text, Image } from 'react-native'
import R from '../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import { getCardStyle } from '../../native_theme/components/CardView';

//Create Common class for card View
export default class CardWidget extends Component {

    render() {

        // Get required fields from props
        let props = this.props;
        let iselevation = props.iselevation ? 0 : R.dimens.CardViewElivation

        return (

            <View style={[this.styles().container]}>
                <LinearGradient style={{
                    borderRadius: R.dimens.margin_left_right,
                    ...getCardStyle(iselevation)
                }}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={[props.firstColor, props.secondColor]}>

                    <View style={{
                        paddingTop: R.dimens.padding_top_bottom_margin,
                        paddingBottom: R.dimens.padding_top_bottom_margin,
                        paddingLeft: R.dimens.margin,
                        paddingRight: R.dimens.margin
                    }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }}>
                            {props.title && <Text style={{ flex: 1, color: R.colors.white, fontSize: R.dimens.smallText }}>{props.title}</Text>}
                            {props.valueText && <Text style={{ color: R.colors.white, fontSize: R.dimens.secondCurrencyText }}>{props.valueText}</Text>}
                            <View style={{ marginLeft: R.dimens.widget_left_right_margin, }}>
                                {props.icon && <Image
                                    source={props.icon}
                                    style={{ tintColor: R.colors.eyeColor, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />}
                            </View>
                        </View>

                        <View>
                            {props.amount && <Text style={{
                                marginTop: R.dimens.widget_top_bottom_margin,
                                marginLeft: R.dimens.widget_left_right_margin,
                                color: R.colors.white,
                                fontSize: R.dimens.mediumText
                            }}>{props.amount}</Text>}
                            {props.totalAmount && <Text style={{
                                marginTop: R.dimens.widgetMargin,
                                marginLeft: R.dimens.widget_left_right_margin,
                                color: R.colors.white,
                                fontSize: R.dimens.smallestText
                            }}>{'= ' + props.totalAmount}</Text>}
                        </View>

                    </View>
                </LinearGradient>
            </View>
        );
    }

    //Common Style For Filter Navigation Drawer View
    styles = () => {
        return {
            container: {
                marginLeft: R.dimens.activity_margin,
                marginRight: R.dimens.activity_margin,
            },
        }
    }
}
