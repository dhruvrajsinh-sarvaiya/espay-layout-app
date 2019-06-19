/* 
    Developer : Nishant Vadgama
    Date : 13-11-2018
    File Comment : route index to render sub component for member topup
*/

import React, { Component } from "react";
// import { connect } from "react-redux";
// import { getInternalTransferHistory } from "Actions/TransferInOut";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import TopupForm from "Components/MemberTopup/TopupForm";

class MemberTopupIndex extends Component {
    componentWillMount() {
        // this.props.getInternalTransferHistory();
    }
    render() {
        return (
            <div className="data-table-wrapper mb-20">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.topup" />}
                    match={this.props.match}
                />
                <TopupForm />
            </div>
        );
    }
}

/* const mapStateToProps = ({ transferIn }) => {
    const { internalTransferHistory } = transferIn;
    return { internalTransferHistory };
};

export default connect(mapStateToProps, {
    getInternalTransferHistory
})(TransferIN);
 */

export default MemberTopupIndex;