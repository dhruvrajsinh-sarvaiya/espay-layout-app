/**
 * Added By Devang Parekh
 * This route for handle pair Configuration component
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";

import PairConfigurationComponent from "Components/PairConfiguration/component/PairConfigurationList";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';


class PairConfiguration extends Component {

  componentWillReceiveProps(nextprops) {
    if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
      this.setState({
        open: false,
      })
    }
  }

  render() {
    //BreadCrumbData
    const BreadCrumbData = [
      {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
      },
      {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
      },
      {
        title: this.props.ConfigurationShowCard === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 0
      },
      {
        title: <IntlMessages id="card.list.title.configuration" />,
        link: '',
        index: 1
      },
      {
        title: <IntlMessages id="sidebar.pairConfiguration.title" />,
        link: '',
        index: 2
      }
    ];

    const { drawerClose } = this.props;
    // used for close drawer
    return (
      <div className="data-table-wrapper mb-20 jbs-page-content">
        { <WalletPageTitle title={<IntlMessages id="sidebar.pairConfiguration.title" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.props.closeAll} /> }
        <PairConfigurationComponent
          title={<IntlMessages id="sidebar.pairConfiguration.title" />}
          closeAll={this.props.closeAll}
          ConfigurationShowCard={this.props.ConfigurationShowCard}
          marginTradingBit={this.props.marginTradingBit}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ drawerclose }) => {
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { drawerclose };
};

// connect component with store
export default connect(mapStateToProps, null)(PairConfiguration);