import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import R from '../R';
import TextViewHML from './TextViewHML';

export default class ListLoader extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        if (this.props === nextProps) {
            return false
        }
        return true
    }

    render() {
        return (
            <View style={[{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1 }, this.props.style]}>
                <ActivityIndicator size={'large'} color={R.colors.accent} />
                <TextViewHML style={{ color: R.colors.textPrimary, marginTop: R.dimens.margin, fontSize: R.dimens.smallText }}>{R.strings.Loading}</TextViewHML>
            </View>
        );
    }
}
