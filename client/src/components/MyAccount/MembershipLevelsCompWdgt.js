/**
 * CreatedBy - Kevin Ladani
 * Date - 09/10/2018
 */
/**
 * Membership Level Component Wdgt
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

//Call Action
import { membershipLevel } from "../../actions/MyAccount/MembershipLevel";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

class MembershipLevelsCompWdgt extends Component {
  /**
   * On onChangePersonalVerificationView
   */
  onChangePersonalVerificationView(plan_type) {
   if (plan_type === "Standard") {
      this.props.changeComponentView("View2");
    } 
  }

  componentWillMount() {
    this.props.membershipLevel();
  }

  render() {
    const membershipLevels = this.props.membersData;
    return (
      <div>
      <div className="session-head membershiptitle mt-15 text-center">
      <h2>{<IntlMessages id="sidebar.membershipLevel" />}</h2>
    </div>
      <div className="mt-20 row">
        {membershipLevels.map((item, i) => {
          return [
            <div className="col-md-4" key={i}>
              <JbsCollapsibleCard customClasses="text-center">
                <div className="pricing-icon mb-30 mt-30">
                  <img
                    src={require("Assets/img/pricing-icon.png")}
                    alt="pricing icon"
                    className="img-fluid"
                    width=""
                    height=""
                  />
                </div>
                <div className={`text-center pl-10`}>
                  <h1 className={`text-${item.color} pricing-title`}>
                    {item.planType}
                  </h1>
                  <div>
                    {item.price === "0" ? (
                      <span className="pricing-main">
                        <sup>$</sup>
                        {item.price}{" "}
                      </span>
                    ) : (
                      <span className="pricing-main">
                        <sup>$</sup>
                        {item.price} <sub>   <IntlMessages id="sidebar.year" /></sub>
                      </span>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                      <h4 style={{ minHeight: "50px" }}>{item.description}</h4>
                    </div>
                    <div className="col-sm-2" />
                  </div>

                  <div className="row mt-30">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                      <Button
                        color={`${item.color}`}
                        className={"btn-block btn-lg"}
                        onClick={() =>this.onChangePersonalVerificationView(item.planType)}
                      >
                       <span>{item.buttonType}</span> 
                      </Button>
                    </div>
                    <div className="col-sm-2" />
                  </div>

                  <div className="mt-20 text-left row">
                    <div className="offset-sm-2 col-sm-3 offset-md-2 col-md-6 pl-20">
                      {
                        <IntlMessages id="my_account.membershipLevel.depositFee" />
                      }
                    </div>
                    <div className="col-md-4 col-sm-2">{item.depositFee}</div>
                  </div>
                  <div className="mt-20 text-left row">
                    <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                      {
                        <IntlMessages id="my_account.membershipLevel.withdarwlFee" />
                      }
                    </div>
                    <div className="col-md-4 col-sm-4">{item.withdarwlFee}</div>
                  </div>
                  <div className="mt-20 text-left row">
                    <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                      {
                        <IntlMessages id="my_account.membershipLevel.tradingFee" />
                      }
                    </div>
                    <div className="col-md-4 col-sm-4">{item.tradingFee}</div>
                  </div>
                  <div className="mt-20 text-left row mb-30">
                    <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                      {<IntlMessages id="my_account.membershipLevel.widFee" />}
                    </div>
                    <div className="col-md-4 col-sm-4">{item.widFee}</div>
                  </div>
                </div>
              </JbsCollapsibleCard>
            </div>
          ];
        })}
      </div>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ membershipLevelRdcer }) => {
  var response = {
    membersData: membershipLevelRdcer.membershipData,
    loading: membershipLevelRdcer.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    membershipLevel
  }
)(MembershipLevelsCompWdgt);
