/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent } from "Components/JbsCard";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { getWalletUserDetails } from "Actions/Wallet";
import WalletUsers from "Components/WalletUsers/WalletUsers";

class CardWidgetWalletUsers extends Component {
    state = {
        open: false
    };
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true
        });
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    componentWillMount() {
        this.props.getWalletUserDetails();
    }
    render() {
        return (
            <React.Fragment>
                {this.props.walletUserDetails.loading && <PreloadWidget />}
                {!this.props.walletUserDetails.loading && (
                    <JbsCard colClasses="col-sm-full">
                        <div className="jbs-block-title py-5">
                            <h4><IntlMessages id="walletDeshbard.walletUsers" /></h4>
                        </div>
                        <Divider />
                        <JbsCardContent>
                            <h1 className="w-100 text-center display-4 font-weight-normal mb-0">
                                {this.props.walletUserDetails.WalletUserCount}{" "}
                            </h1>
                            <p className="w-100 text-center mb-0">
                                <IntlMessages id="walletDeshbard.totalUsers" />
                            </p>
                            <ul className="list-group new-customer-list">
                                {this.props.walletUserDetails.hasOwnProperty("UserLists") &&
                                    this.props.walletUserDetails.UserLists.length > 0 &&
                                    this.props.walletUserDetails.UserLists.map((user, key) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between"
                                            key={key}
                                        >
                                            <div className="d-flex align-items-start">
                                                <div className="media">
                                                    <div className="media-left mr-15">
                                                        <Avatar>
                                                            {user.FirstName.charAt(0) +
                                                                user.LastName.charAt(0)}
                                                        </Avatar>
                                                    </div>
                                                    <div className="media-body">
                                                        <span className="d-block fs-14">
                                                            {user.FirstName + " " + user.LastName}
                                                        </span>
                                                        <span className="d-block fs-12 text-muted">
                                                            {user.Email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-end">
                                                <a
                                                    href="javascript:void(0)"
                                                    color="primary"
                                                >
                                                    <i className="zmdi zmdi-info-outline" />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            <h2 className="w-100 text-center mb-0">
                                <a href="javascript:void(0)" onClick={e => this.toggleDrawer()}>
                                    ....
                                </a>
                            </h2>
                        </JbsCardContent>
                        <Drawer
                            width="100%"
                            handler={false}
                            open={this.state.open}
                            onMaskClick={this.toggleDrawer}
                            className="drawer1"
                            placement="right"
                        >
                            <WalletUsers
                                {...this.props}
                                drawerClose={this.toggleDrawer}
                                closeAll={this.closeAll}
                            />
                        </Drawer>
                    </JbsCard>
                )}
            </React.Fragment>
        );
    }
}

const mapToProps = ({ superAdminReducer }) => {
    const { walletUserDetails } = superAdminReducer;
    return { walletUserDetails };
};

export default connect(mapToProps, {
    getWalletUserDetails
})(CardWidgetWalletUsers);
