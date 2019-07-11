/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Commission Pattern
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { getAffiliateCommissionPattern } from "Actions/MyAccount";

class CommissionPattern extends Component {
    constructor() {
        super();
        this.state = {
            expanded: 'panel0',
            planDetails: [],
            loading: false,
            type: 1 //0 For basic & 1 for full details
        };
    }

    componentWillMount() {
        this.props.getAffiliateCommissionPattern({ type: this.state.type });
    }

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : null,
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            this.setState({ planDetails: [] });
        } else if (nextProps.data.ReturnCode === 0 && nextProps.data.hasOwnProperty('Response') && nextProps.data.Response.length > 0) {
            this.setState({ planDetails: nextProps.data.Response });
        }
    }

    render() {
        const { expanded, loading, planDetails } = this.state;
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                {planDetails.length > 0
                    ? planDetails.map((plist, index) => (
                        <ExpansionPanel key={index} className="epd_panel m-0" square expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index)}>
                            <ExpansionPanelSummary className="epd_tlt" expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                                {plist.Value + " : " + plist.Name}
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className="epd_detail">
                                <p>Commission Count on:</p>
                                {plist.AvailableScheme.length > 0 &&
                                    plist.AvailableScheme.map((pScheme, pindex) => (
                                        <Fragment key={pindex}>
                                            <h4>{pScheme.SchemeName}</h4>
                                            <ul>
                                                {pScheme.SchemeDetail.length > 0 &&
                                                    pScheme.SchemeDetail.map((psDetails, psindex) => (
                                                        <li key={psindex}>{psDetails}</li>
                                                    ))
                                                }
                                            </ul>
                                        </Fragment>
                                    ))
                                }
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))
                    : <div className="text-center">No data found.</div>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = ({ affiliateRdcer }) => {
    const response = {
        data: affiliateRdcer.getPlan,
        loading: affiliateRdcer.loading
    }
    return response;
};

export default connect(mapStateToProps, {
    getAffiliateCommissionPattern
})(CommissionPattern);