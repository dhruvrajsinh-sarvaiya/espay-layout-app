import React, { Component } from 'react'
import { Text, Platform } from 'react-native'
import { LinearTextGradient as LinearTextGradientAlias } from 'react-native-text-gradient';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import R from '../R';

export default class LinearTextGradient extends Component {
  render() {

    // apply text gradient based on Platform
    if (Platform.OS === 'ios') {
      return (
        <MaskedView maskElement={<Text {...this.props} />}>
          <LinearGradient colors={[R.colors.linearStart, R.colors.linearEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text {...this.props} style={[this.props.style, { opacity: 0 }]} />
          </LinearGradient>
        </MaskedView>)
    } else {
      return (
        <LinearTextGradientAlias
          style={this.props.style}
          colors={[R.colors.linearStart, R.colors.linearEnd]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Text>{this.props.children}</Text>
        </LinearTextGradientAlias>
      )
    }
  }
}