import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import R from '../R';
import TextViewHML from './TextViewHML';

export function contentContainerStyle(array) {
    return [
        { flexGrow: 1 },
        array.length ? null : { justifyContent: 'center' }
    ]
}

export class ListEmptyComponent extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props === nextProps) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let msg = this.props.message ? this.props.message : R.strings.noRecordsFound;
        let module = this.props.module ? this.props.module : null;

        //If tintColor is null then it will not used tintColor style
        let needTint = (this.props.iconStyle != undefined && this.props.iconStyle.tintColor != undefined) ? this.props.iconStyle.tintColor !== null : true;

        return (
            <View style={[{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: R.dimens.margin
            }, this.props.style]}>
                <Image
                    resizeMode={'contain'}
                    style={[{
                        width: R.dimens.listEmptyImageWidgetWidth,
                        height: R.dimens.listEmptyImageWidgetHeight,
                    }, needTint ? { tintColor: R.colors.textPrimary } : {}, this.props.iconStyle]}
                    source={this.props.icon !== undefined ? this.props.icon : R.images.ic_question_mark} >
                </Image>
                <TextViewHML style={{
                    marginTop: R.dimens.margin,
                    fontSize: R.dimens.smallestText,
                    color: R.colors.textPrimary
                }}>
                    {msg}
                </TextViewHML>
                {module &&
                    <TouchableWithoutFeedback onPress={this.props.onPress ? this.props.onPress : null}>
                        <View>
                            <TextViewHML style={{
                                marginTop: R.dimens.widgetMargin,
                                fontSize: R.dimens.smallestText,
                                color: R.colors.accent
                            }}>
                                {R.strings.formatString(R.strings.Empty_List_Link_Msg, { module })}
                            </TextViewHML>
                        </View>
                    </TouchableWithoutFeedback>}
            </View>
        );
    }
}