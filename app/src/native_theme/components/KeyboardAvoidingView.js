import React from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  View,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

function KeyboardAvoidingView(props) {
  switch (Platform.OS) {
    case 'android':
      return <View {...props} style={[styles.container, props.style]} />;
    case 'ios':
      return <NativeKeyboardAvoidingView
        keyboardVerticalOffset={props.offset || 0}
        behavior="padding"
        {...props}
        style={[styles.container, props.styles]}
      >
        <View style={styles.container}>{props.children}</View>
      </NativeKeyboardAvoidingView>;
    default:
      return <View {...props} style={[styles.container, props.styles]} />
  }
}

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array
}

export default KeyboardAvoidingView
