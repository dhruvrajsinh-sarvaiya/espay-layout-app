/* 
    Developer : Nishant Vadgama
    Date : 10-01-2019
    File Comment : wallet activity list component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import AppConfig from 'Constants/AppConfig';
import { Link } from 'react-router-dom'
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import Button from '@material-ui/core/Button';
//initial state
const initState = {
    walletActivity: []
}
//my wallets methods...
import {
    walletRequestAction,
    listWalletRequests
} from 'Actions/MyWallets';

class WalletActivityList extends Component {
    state = initState;
    //will mount fetch data
    componentWillMount() {
        this.props.listWalletRequests();
        if (this.props.location.state.hasOwnProperty("hubConnection")) {
            this.props.location.state.hubConnection.on('RecieveWalletActivity', (newsData) => {
                console.log('newsData');
                newsData = JSON.parse(newsData);
                this.setState({ walletActivity: newsData.Data.Data });
                this.props.setCount(newsData.Data.Data.length);
            });
        }
    }
    //on changing props...
    componentWillReceiveProps(nextProps) {
        // validate response
        if (nextProps.walletRequestResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.walletRequestResponse.ReturnCode == 0) {
                NotificationManager.success(nextProps.walletRequestResponse.ReturnMsg);
                this.props.listWalletRequests();
            } else if (nextProps.walletRequestResponse.ReturnCode == 1) {
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.walletRequestResponse.ErrorCode} />);
            }
        }
        if (nextProps.walletRequests.length) {
            this.setState({ walletActivity: nextProps.walletRequests });
            this.props.setCount(nextProps.walletRequests.length);
        }
    }
    //accept request..
    onAccept(id) {
        this.props.walletRequestAction({
            Status: 1,
            RequestId: id
        });
    }
    //reject request...
    onReject(id) {
        this.props.walletRequestAction({
            Status: 9,
            RequestId: id
        });
    }
    //render component
    render() {
        const { walletActivity } = this.state;
        return (
            // <JbsCollapsibleCard
            //     colClasses="col-sm-6 offset-3"
            //     heading={<IntlMessages id="wallet.pendingRequests" />}
            //     fullBlock>
            <React.Fragment>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <tbody>
                            {walletActivity.length !== 0 && walletActivity.map((activity, key) => (
                                <tr key={key} >
                                    <td>
                                        <div className="media">
                                            <div className="media-left mr-15">
                                                <img src={AppConfig.coinlistImageurl + '/' + activity.WalletType + '.png'} height="40" width="40" className="mr-15" />
                                            </div>
                                            <div className="media-body">
                                                <span className="d-block fw-normal">{"Wallet: "}<strong>{activity.WalletName}</strong></span>
                                                <span className="fs-12 fw-normal"><strong>{activity.FromEmail}</strong>{" has invite you to join as "}<strong>{activity.RoleName}</strong></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <Button variant="raised" size="small" onClick={() => this.onAccept(activity.RequestId)} className="btn-primary mr-20 text-white"><IntlMessages id="button.accept" /></Button>
                                        <Button variant="raised" size="small" onClick={() => this.onReject(activity.RequestId)} className="btn-warning text-white"><IntlMessages id="button.reject" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {this.props.loading && <JbsSectionLoader />}
            </React.Fragment>
            // </JbsCollapsibleCard>
        );
    }
}

const mapStateToProps = ({ MyWalletsReducer }) => {
    const { loading, walletRequestResponse, walletRequests } = MyWalletsReducer;
    return { loading, walletRequestResponse, walletRequests };
}
export default connect(mapStateToProps, {
    walletRequestAction,
    listWalletRequests
})(WalletActivityList);