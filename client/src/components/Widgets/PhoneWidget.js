/**
 * Phone nuber Widget
 */

import React, { Component } from 'react';
import 'react-phone-number-input/style.css'
import 'react-responsive-ui/style.css'
 
// Supplies custom `countrySelectComponent` property.
import PhoneInput from 'react-phone-number-input'

 
class PhoneNumber extends Component {

  state = {
    values: ''
  }
 
  render() {
    const { values } = this.state
    // If `country` property is not passed
    // then "International" format is used.
    return (
        <div>
        <PhoneInput
            placeholder="Enter phone number"
            value={ values }
            onChange={ value => this.setState({ values }) }/>
      </div>
    )
  }
}

export default (PhoneNumber);