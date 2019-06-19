/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';

export class CardWidgetPolicies extends Component {
    state = {
        expanded: null,
    };
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
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                     maximus est, id dignissim quam.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')} className="my-0">
                        <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                            <Typography>Usage Policy</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                     maximus est, id dignissim quam.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')} className="my-0">
                        <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>}>
                            <Typography>Commission Policy</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                     maximus est, id dignissim quam.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </JbsCardContent>
            </JbsCard >
        )
    }
}