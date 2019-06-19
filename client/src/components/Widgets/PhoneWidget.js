/**
 * Phone nuber Widget
 */

import React, { Component } from 'react';
import 'react-phone-number-input/style.css'
import 'react-responsive-ui/style.css'
 
// Supplies custom `countrySelectComponent` property.
import PhoneInput, { formatPhoneNumber } from 'react-phone-number-input'

 
class PhoneNumber extends Component {

  state = {
    value: ''
  }
 
  render() {
    const { value } = this.state
    // If `country` property is not passed
    // then "International" format is used.
    return (
        <div>
        <PhoneInput
            placeholder="Enter phone number"
            value={ value }
            onChange={ value => this.setState({ value }) }/>
      </div>
    )
  }
}

export default (PhoneNumber);