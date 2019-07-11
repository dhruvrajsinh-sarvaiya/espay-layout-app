/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

export class CardWidgetWalletUsers extends Component {
    render() {
        return (
            <JbsCard colClasses="col-sm-full">
                <div className="jbs-block-title py-5">
                    <h4><IntlMessages id="walletDeshbard.walletUsers" /></h4>
                </div>
                <Divider />
                <JbsCardContent>
                    <h1 className="w-100 text-center display-4 font-weight-normal mb-0">2415 </h1>
                    <p className="w-100 text-center mb-0"><IntlMessages id="walletDeshbard.totalUsers" /></p>
                    <ul className="list-group new-customer-list">
                        <li className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-start">
                                <div className="media">
                                    <div className="media-left mr-15">
                                        <Avatar>{"R"}</Avatar>
                                    </div>
                                    <div className="media-body">
                                        <span className="d-block fs-14">{"Rukshana Shaikh"}</span>
                                        <span className="d-block fs-12 text-muted">{"Rukshana@example.com"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <a href="javascript:void(0)" color="primary">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-start">
                                <div className="media">
                                    <div className="media-left mr-15">
                                        <img src={"http://reactify.theironnetwork.org/data/images/user-1.jpg"} alt="project logo" className="media-object rounded-circle" width="40" height="40" />
                                    </div>
                                    <div className="media-body">
                                        <span className="d-block fs-14">{"Lisa Roy"}</span>
                                        <span className="d-block fs-12 text-muted">{"Lisa@example.com"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <a href="javascript:void(0)" color="primary">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-start">
                                <div className="media">
                                    <div className="media-left mr-15">
                                        <Avatar>{"M"}</Avatar>
                                    </div>
                                    <div className="media-body">
                                        <span className="d-block fs-14">{"Mickel Chow"}</span>
                                        <span className="d-block fs-12 text-muted">{"Mickel@example.com"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <a href="javascript:void(0)" color="primary">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-start">
                                <div className="media">
                                    <div className="media-left mr-15">
                                        <img src={"http://reactify.theironnetwork.org/data/images/user-4.jpg"} alt="project logo" className="media-object rounded-circle" width="40" height="40" />
                                    </div>
                                    <div className="media-body">
                                        <span className="d-block fs-14">{"Sukhpal"}</span>
                                        <span className="d-block fs-12 text-muted">{"Sukhpal@example.com"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <a href="javascript:void(0)" color="primary">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div className="d-flex align-items-start">
                                <div className="media">
                                    <div className="media-left mr-15">
                                        <img src={"http://reactify.theironnetwork.org/data/images/user-5.jpg"} alt="project logo" className="media-object rounded-circle" width="40" height="40" />
                                    </div>
                                    <div className="media-body">
                                        <span className="d-block fs-14">{"Admini Hei"}</span>
                                        <span className="d-block fs-12 text-muted">{"Admini@example.com"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <a href="javascript:void(0)" color="primary">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </div>
                        </li>
                    </ul>
                    <h2 className="w-100 text-center mb-0"><a href="javascript:void(0)">....</a></h2>
                </JbsCardContent>
            </JbsCard >
        )
    }
}