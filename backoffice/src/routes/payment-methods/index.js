import React, { Component } from "react";
import { connect } from "react-redux";
import { getPaymentMethod } from "Actions/PaymentMethod";
import IntlMessages from "Util/IntlMessages";
import PaymentMethodComponent from "../../components/PaymentMethod/paymentMethod";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class PaymentMethod extends Component {
  state = {
    open: false
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };
  componentWillMount() {
    this.props.getPaymentMethod();
  }
  render() {
    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="sidebar.paymentMethod" />}</span>
          </h2>
          <div className="page-title-wrap">
            <Button
              className="btn-warning text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={drawerClose}
            >
              <i className="zmdi zmdi-mail-reply" />
            </Button>
            <Button
              className="btn-info text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={this.closeAll}
            >
              <i className="zmdi zmdi-home" />
            </Button>
          </div>
        </div>
        <PaymentMethodComponent
          title={<IntlMessages id="sidebar.paymentMethod" />}
          data={this.props.paymentMethodData}
          closeAll={this.closeAll}
        />
      </JbsCollapsibleCard>
    );
  }
}

const mapStateToProps = ({ paymetMethod }) => {
  const { paymentMethodData } = paymetMethod;
  return { paymentMethodData };
};

export default connect(
  mapStateToProps,
  {
    getPaymentMethod
  }
)(PaymentMethod);
