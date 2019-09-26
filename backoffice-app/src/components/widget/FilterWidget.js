import React from 'react'
import { Component } from 'react';
import { View, ScrollView, Platform } from 'react-native'
import DatePickerWidget from './DatePickerWidget';
import ComboPickerWidget from './ComboPickerWidget';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import EditText from '../../native_theme/components/EditText';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import CommonToast from '../../native_theme/components/CommonToast';
import { getCardStyle } from '../../native_theme/components/CardView';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';

//Create Common class for Filter View
export default class FilterWidget extends Component {
    constructor(props) {
        super(props)
        this.inputs = {};
        this.toast = React.createRef();
    }
    render() {
        let props = this.props;
        let toastRef = this.props.toastRef;

        return (
            <SafeView style={this.styles().container}>
                <CommonToast ref={component => {
                    if (toastRef) {
                        toastRef(component)
                    } else {
                        this.toast = component;
                    }
                }} styles={{ width: R.dimens.FilterDrawarWidth }} />
                <View style={[this.styles().sub_container, props.sub_container]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                            {
                                props.Header &&
                                <View style={{ alignItems: 'center', marginTop: R.dimens.margin_left_right, marginLeft: R.dimens.margin_left_right }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}>{props.Header}</TextViewMR>
                                </View>
                            }
                            {(this.props.FromDate != undefined || this.props.ToDate != undefined) &&
                                <DatePickerWidget isCancellable={props.isCancellable ? true : false} FromDatePickerCall={(date) => props.FromDatePickerCall(date)} ToDatePickerCall={(date) => props.ToDatePickerCall(date)} FromDate={props.FromDate} ToDate={props.ToDate} />
                            }
                            {(props.textInputs != undefined) &&
                                <View style={[this.styles().textInputStyle, props.textInputStyle]}>
                                    {props.textInputs.map((item, index) => {
                                        return <EditText
                                            key={index.toString()}
                                            validate={item.validate !== undefined ? item.validate : false}
                                            reference={input => { this.inputs['item' + index] = input; }}
                                            header={item.header}
                                            placeholder={item.placeholder}
                                            multiline={item.multiline !== undefined ? item.multiline : false}
                                            keyboardType={item.keyboardType !== undefined ? item.keyboardType : 'default'}
                                            returnKeyType={item.returnKeyType !== undefined ? item.returnKeyType : 'done'}
                                            onChangeText={item.onChangeText !== undefined ? item.onChangeText : (text) => { }}
                                            maxLength={item.maxLength}
                                            secureTextEntry={item.secureTextEntry}
                                            editable={item.editable}
                                            blurOnSubmit={item.blurOnSubmit}
                                            onSubmitEditing={() => {
                                                if (index + 1 < props.textInputs.length) {
                                                    this.inputs['item' + (index + 1)].focus();
                                                }
                                            }}
                                            value={item.value !== undefined ? item.value : ''} />
                                    })}
                                </View>
                            }
                            {(this.props.firstPicker != undefined || this.props.secondPicker != undefined || this.props.pickers != undefined) &&
                                <View style={[this.styles().comboPickerStyle, props.comboPickerStyle]}>
                                    <ComboPickerWidget
                                        firstPicker={props.firstPicker}
                                        secondPicker={props.secondPicker}
                                        pickers={props.pickers}
                                    />
                                </View>
                            }

                            {(this.props.featureSwitchs != undefined && this.props.featureSwitchs != null) &&
                                this.props.featureSwitchs.map((item, index) => {
                                    return (
                                        <FeatureSwitch
                                            key={index.toString()}
                                            backgroundColor={item.backgroundColor}
                                            title={item.title}
                                            style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
                                            isToggle={item.isToggle}
                                            textStyle={{ color: R.colors.textPrimary }}
                                            onValueChange={item.onValueChange}
                                        />
                                    )
                                }
                                )
                            }

                        </View>
                    </ScrollView>
                </View>
                {/* Designing of Reset and Complete Button */}
                {
                    (this.props.onResetPress != undefined || this.props.onCompletePress != undefined) &&
                    <View style={{ height: '10%' }}>

                        {/* It will display button at bottom in 10% */}
                        <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0 }}>
                            <ImageButton
                                name={R.strings.Reset}
                                isMR
                                style={[this.styles().buttonStyle, this.styles().resetButton]}
                                onPress={props.onResetPress} />
                            <ImageButton
                                name={R.strings.Apply}
                                isMR
                                style={[this.styles().buttonStyle, this.styles().submitButton]}
                                onPress={props.onCompletePress} />
                        </View>

                    </View>
                }
            </SafeView>
        );
    }

    //Common Style For Filter Navigation Drawer View
    styles = () => {
        return {
            textInputStyle: {
                // marginTop: R.dimens.widgetMargin,
                marginBottom: R.dimens.widgetMargin
            },
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
            sub_container: {
                height: '90%',
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingTop: R.dimens.padding_top_bottom_margin
            },

            // Main Button Style
            buttonStyle: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: R.dimens.WidgetPadding,
            },

            // Reset Button Style
            resetButton: {
                backgroundColor: R.colors.cardBalanceBlue,
                ...Platform.select({
                    ios: {
                        marginRight: R.dimens.widgetMargin,
                        marginTop: R.dimens.widgetMargin,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        ...getCardStyle(R.dimens.CardViewElivation),
                    },
                    android: {
                        margin: 0
                    }
                })
            },
            // Reset Button Style
            submitButton: {
                backgroundColor: R.colors.buttonBackground,
                ...Platform.select({
                    ios: {
                        marginLeft: R.dimens.widgetMargin,
                        marginTop: R.dimens.widgetMargin,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        ...getCardStyle(R.dimens.CardViewElivation),
                    },
                    android: {
                        margin: 0
                    }
                })
            },
            comboPickerStyle: {
                marginBottom: R.dimens.widgetMargin,
                marginTop: R.dimens.widget_top_bottom_margin
            },
        }
    }
}
