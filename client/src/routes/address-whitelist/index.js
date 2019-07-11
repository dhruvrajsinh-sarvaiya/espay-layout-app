import React, { Component,Fragment } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import { getAllWhithdrawalAddress } from "Actions/AddressWhitelist";
import { connect } from "react-redux";

import AddToWhitelistAddress from "Components/AddressWhitelist/AddToWhitelistAddress";
import WhitelistedAddressesList from "Components/AddressWhitelist/WhitelistedAddressesList";

class index extends Component {
    state = {
        withdrawalAddress: []
    };
    componentWillMount() {
        this.props.getAllWhithdrawalAddress();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            withdrawalAddress: nextProps.addresses
        });
    }
    render() {
        return (
            <Fragment>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.withdrawalAddress" />}
                    match={this.props.match}
                />
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12">
                        <AddToWhitelistAddress {...this.props} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-xl-12">
                        <div className="col-sm-12 col-md-12 col-xl-12">
                            <WhitelistedAddressesList
                                {... this.props}
                                withdrawalAddress={this.state.withdrawalAddress}
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ addressWhitelist }) => {
    const { addresses } = addressWhitelist;
    return { addresses };
};

export default connect(mapStateToProps, {
    getAllWhithdrawalAddress
})(index);
