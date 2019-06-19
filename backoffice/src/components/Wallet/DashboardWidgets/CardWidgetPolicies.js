/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
    getRecentCharges,
    getRecentUsage,
    getRecentCommission
} from "Actions/Wallet";

class CardWidgetPolicies extends Component {
    state = {
        expanded: null,
    };
    componentWillMount() {
        this.props.getRecentCharges();
        this.props.getRecentUsage();
        this.props.getRecentCommission();
    }
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    render() {
        const { expanded } = this.state;
        return (
            <JbsCard colClasses="col-sm-full">
                <div className="jbs-block-title py-5">
                    <h4>{"Policies"}</h4>
                </div>
                <Divider />
                <JbsCardContent customClasses="">
                    <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')} className="my-0">
                        <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                            <Typography>Charges Policy</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {!this.props.recentCharges.hasOwnProperty("ChargePolicyList") && <JbsSectionLoader />}
                            {this.props.recentCharges.hasOwnProperty("ChargePolicyList") && this.props.recentCharges.ChargePolicyList.length && <ul className="list-unstyled m-0 w-100">
                                {this.props.recentCharges.ChargePolicyList.map((rec, key) => (
                                    <React.Fragment key={key}>
                                        {key != 0 && <Divider />}
                                        <li className="d-flex justify-content-between px-30">
                                            <div className="">
                                                <h4 className="my-5">{rec.PolicyName}</h4>
                                            </div>
                                            <div className="">
                                                <span className="my-5">{rec.StrStatus}</span>
                                            </div>
                                        </li>
                                    </React.Fragment>
                                ))}
                                <li className="d-flex justify-content-center px-30">
                                    <h2 className="w-100 text-center mb-1"><a href="javascript:void(0)">....</a></h2>
                                </li>
                            </ul>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')} className="my-0">
                        <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                            <Typography>Usage Policy</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {!this.props.recentUsages.hasOwnProperty("UsageList") && <JbsSectionLoader />}
                            {this.props.recentUsages.hasOwnProperty("UsageList") && this.props.recentUsages.UsageList.length && <ul className="list-unstyled m-0 w-100">
                                {this.props.recentUsages.UsageList.map((rec, key) => (
                                    <React.Fragment key={key}>
                                        {key != 0 && <Divider />}
                                        <li className="d-flex justify-content-between px-30">
                                            <div className="">
                                                <h4 className="my-5">{rec.PolicyName}</h4>
                                            </div>
                                            <div className="">
                                                <span className="my-5">{rec.StrStatus}</span>
                                            </div>
                                        </li>
                                    </React.Fragment>
                                ))}
                                <li className="d-flex justify-content-center px-30">
                                    <h2 className="w-100 text-center mb-1"><a href="javascript:void(0)">....</a></h2>
                                </li>
                            </ul>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')} className="my-0">
                        <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                            <Typography>Commission Policy</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {!this.props.recentCommissions.hasOwnProperty("CommissionPolicyList") && <JbsSectionLoader />}
                            {this.props.recentCommissions.hasOwnProperty("CommissionPolicyList") && this.props.recentCommissions.CommissionPolicyList.length && <ul className="list-unstyled m-0 w-100">
                                {this.props.recentCommissions.CommissionPolicyList.map((rec, key) => (
                                    <React.Fragment key={key}>
                                        {key != 0 && <Divider />}
                                        <li className="d-flex justify-content-between px-30">
                                            <div className="">
                                                <h4 className="my-5">{rec.PolicyName}</h4>
                                            </div>
                                            <div className="">
                                                <span className="my-5">{rec.StrStatus}</span>
                                            </div>
                                        </li>
                                    </React.Fragment>
                                ))}
                                <li className="d-flex justify-content-center px-30">
                                    <h2 className="w-100 text-center mb-1"><a href="javascript:void(0)">....</a></h2>
                                </li>
                            </ul>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </JbsCardContent>
            </JbsCard >
        )
    }
}

const mapToProps = ({ superAdminReducer }) => {
    const { recentCharges, recentUsages, recentCommissions } = superAdminReducer;
    return { recentCharges, recentUsages, recentCommissions };
};

export default connect(mapToProps, {
    getRecentCharges,
    getRecentUsage,
    getRecentCommission
})(CardWidgetPolicies);