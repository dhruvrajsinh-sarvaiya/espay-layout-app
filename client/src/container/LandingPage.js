import React, { Component } from 'react'
import { Row , Col } from 'reactstrap';
import { Helmet } from 'react-helmet';
//Components
import Index from '../components/LandingWidget/index';

export default class Landingdemo extends Component {
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