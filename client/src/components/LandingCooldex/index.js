import React, { Component } from "react";
import { connect } from "react-redux";
//Components
import Banner from './components/banner';
import Coinslider from './components/coinslider';
import Whycooldex from './components/whycooldex';
import Featuresbox from './components/features';
import OurWebsitesec from './components/ourwebsite';
import Simplesteps from './components/simplesteps';
import Testimonial from './components/testimonial';
import CooldexFooter from 'Components/Footer/CooldexFooter';
//Import List Region Actions...
import { getRegions } from "Actions/Regions";
import regionContent from '../../data/region.json';

class LandingCooldesk extends Component {
  constructor() {
    super();
    this.state = {
      loading: false, // loading activity
      regioncontent: [],
    };
  }

  // For Get All Active Region Action if found json data from file then load data from file other wise call api
  componentWillMount() {

    if (typeof regionContent != 'undefined' && regionContent != '' && Object.keys(regionContent).length > 0) {
      this.setState({
        regioncontent: regionContent,
        loading: false
      });
    } else {
      this.props.getRegions();
    }

  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.regioncontent != 'undefined' && nextProps.regioncontent != '') {
      this.setState({
        regioncontent: nextProps.regioncontent,
        loading: false
      });
    }
    if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({ errors: nextProps.data.errors });
    }
  }

  render() {
    const { regioncontent } = this.state;
    return (
      <div>
        <Banner />
        <Coinslider />
        <Whycooldex content={regioncontent.why_cooldex} />
        <Featuresbox content={regioncontent.features} />
        <OurWebsitesec content={regioncontent.our_website} />
        <Simplesteps content={regioncontent.simple_steps} />
        <Testimonial />
        <CooldexFooter />
      </div>
    )
  }
}
const mapStateToProps = ({ regions }) => {

  var response = {
    data: regions.data,
    loading: regions.loading,
    regioncontent: regions.regioncontent
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    getRegions
  }
)(LandingCooldesk);