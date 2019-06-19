import React, { Component } from "react";

//Components
import Header from './components/header';
import Banner from './components/banner';
import Totalsupport from './components/support';
import Tabledata from './components/tabledata';
import Detail from './components/detail';
import Logos from './components/logo';
import Footer from './components/footer';
import Copyright from './components/copyright';

export default class index extends Component {
  render() {
    return (
      <div>
          <Header />    
          <Banner />
          <Tabledata />
          <Totalsupport />
          <Detail />
          <Logos />
          <Footer />
          <Copyright />
      </div>
    )
  }
}