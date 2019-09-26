import React, { Component } from 'react'
import { connect } from 'react-redux';
import { View, TouchableWithoutFeedback } from 'react-native'
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';

//Create Common Button Method For Common Use
class StatusChip extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.color === nextProps.color &&
            this.props.style === nextProps.style &&
            this.props.value === nextProps.value &&
            this.props.onPress === nextProps.onPress &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.locale === nextProps.preference.locale) {
            return false
        }
        return true
    }

    render() {

        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: this.props.color,
                    borderRadius: R.dimens.smallText,
                    paddingBottom: R.dimens.CardViewElivation,
                    paddingTop: R.dimens.CardViewElivation,
                    paddingLeft: R.dimens.margin,
                    paddingRight: R.dimens.margin,
                }, this.props.style]}>
                    <TextViewHML style={{ color: 'white', fontSize: R.dimens.smallText, textAlign: 'center' }}>{this.props.value}</TextViewHML>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

function mapStateToProps(state) {
    return {
        preference: state.preference
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusChip)
