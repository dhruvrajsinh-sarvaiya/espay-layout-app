import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
//Components
import Index from '../components/LandingWidget/index';

export default class LandingPage extends Component {
  render() {
    return (
      <div className="scroll-main">
        <Helmet>
          <title>Welcome Cooldex</title>
        </Helmet>
        <Index />
      </div>
    )
  }
}