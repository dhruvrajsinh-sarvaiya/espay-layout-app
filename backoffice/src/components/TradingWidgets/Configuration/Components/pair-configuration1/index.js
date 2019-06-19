
/**
 * Added By Devang Parekh
 * This route for handle pair Configuration component
 */

import React, { Component } from "react";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import IntlMessages from "Util/IntlMessages";

import PairConfigurationComponent from "./Component";


import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

export default class PairConfiguration extends Component {
  state={
    open: false,
  }

  showComponent = (componentName) => {
    this.setState({
        componentName: componentName,
        open: !this.state.open,
        componentName:''
    });
}

closeAll = () => {
    this.props.closeAll();
    this.setState({
        open: false,
    });
}

  render() {
    const { drawerClose } = this.props;
    return (
      <div className="data-table-wrapper mb-20">
          
      <div className="m-20 page-title d-flex justify-content-between align-items-center">
        <div className="page-title-wrap">
            <h2>Configurations</h2>
        </div>
        <div className="page-title-wrap">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
        </div>
    </div>


        <PairConfigurationComponent
          title={<IntlMessages id="sidebar.pairConfiguration.title" />}
        />
      </div>
    );
  }
}
