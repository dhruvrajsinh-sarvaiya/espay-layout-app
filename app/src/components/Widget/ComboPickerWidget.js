import React from 'react'
import { Component } from 'react';
import { View, } from 'react-native'
import Picker from '../../native_theme/components/Picker';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';

class ComboPickerWidget extends Component {

    render() {

        // Get required params from props
        let props = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={[props.style]}>
                    {
                        props.firstPicker &&
                        <TitlePicker
                            title={props.firstPicker.title}
                            array={props.firstPicker.array}
                            searchable={props.firstPicker.searchable}
                            withIcon={props.withIcon}
                            selectedValue={props.firstPicker.selectedValue}
                            onPickerSelect={props.firstPicker.onPickerSelect} />
                    }
                    {
                        props.secondPicker &&
                        <TitlePicker
                            title={props.secondPicker.title}
                            array={props.secondPicker.array}
                            searchable={props.secondPicker.searchable}
                            selectedValue={props.secondPicker.selectedValue}
                            withIcon={props.withIcon}
                            onPickerSelect={props.secondPicker.onPickerSelect}
                            style={{ marginTop: R.dimens.widget_top_bottom_margin }} />
                    }
                    {
                        props.pickers && props.pickers.length > 0 &&
                        props.pickers.map((item, index) => <TitlePicker
                            key={index.toString()}
                            title={item.title}
                            array={item.array}
                            searchable={item.searchable}
                            selectedValue={item.selectedValue}
                            onPickerSelect={item.onPickerSelect}
                            withIcon={item.withIcon}
                            style={{ marginTop: R.dimens.widget_top_bottom_margin }} />
                        )
                    }
                </View>
            </View>
        );
    }
}

export function TitlePicker(props) {

    // get required params from props
    let value = props.selectedValue ? props.selectedValue : (props.array.length > 0 ? props.array[0].value : '');
    let disabled = props.disabled !== undefined ? props.disabled : false;
    let isRequired = props.isRequired !== undefined ? props.isRequired : false;
    let withIcon = props.withIcon !== undefined ? props.withIcon : false;

    return (
        <View style={[{ flex: 1 }, props.style]}>

            <TextViewMR style={[{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }, props.headerStyle]}>
                {props.title}
                {isRequired && <TextViewMR style={{ color: R.colors.failRed, fontSize: R.dimens.smallText }}> *</TextViewMR>}
            </TextViewMR>

            <Picker
                data={props.array}
                value={value}
                title={props.title}
                onPickerSelect={props.onPickerSelect}
                displayArrow={'true'}
                searchable={props.searchable}
                width={'100%'}
                cardStyle={{ marginTop: R.dimens.CardViewElivation, marginBottom: 0, }}
                disabled={disabled}
                withIcon={withIcon}
            />
        </ View>)
}

export default ComboPickerWidget;