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
import Switch from 'react-toggle-switch';

export class CardWidgetSwitch extends Component {
    state = {
        typelist: []
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data.length) {
            this.setState({ typelist: nextProps.data });
        }
    }
    // toggle switch
    toggleSwitch = (key) => {
        let tempObj = this.state.typelist;
        tempObj[key].Status = tempObj[key].Status ? 0 : 1;
        this.setState({ typelist: tempObj });
    }
    render() {
        return (
            <JbsCard colClasses="col-sm-full">
                <div className="jbs-block-title py-5">
                    <h4><IntlMessages id="walletDeshbard.walletTrnTypes" /></h4>
                </div>
                <Divider />
                <JbsCardContent customClasses="">
                    <ul className="list-unstyled mt-15">
                        {this.state.typelist.slice(0, 8).map((list, key) => (
                            <React.Fragment key={key}>
                                {key != 0 && <Divider />}
                                <li className="d-flex justify-content-between px-30 py-10">
                                    <div className="">
                                        <h3 className="mb-0 mt-1">{list.TypeName}</h3>
                                    </div>
                                    <Switch
                                        onClick={() => this.toggleSwitch(key)}
                                        on={(list.Status) ? true : false}
                                    />
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                    <h2 className="w-100 text-center mb-1"><a href="javascript:void(0)" onClick={() => (console.log('clicked'))} >....</a></h2>
                </JbsCardContent>
            </JbsCard >
        )
    }
}