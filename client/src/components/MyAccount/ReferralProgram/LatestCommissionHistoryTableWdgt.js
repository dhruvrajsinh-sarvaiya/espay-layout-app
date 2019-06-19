/**
 * Login History Simple Table
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Import Referral Latest Commission History Actions...
import { referralLatestCommissionHistory } from 'Actions/MyAccount';

const columns = ["Commission", "Email", "Date"];
const options = {
    filterType: 'dropdown',
    responsive: 'scroll',
    selectableRows : false,
    resizableColumns : false,
    rowsPerPage : 5,
    viewColumns : false,
    filter : false,
    rowsPerPageOptions : [5, 10, 15, 20]
};

class ReferralLatestCommissionHistoryTableWdgt extends Component {    
    componentWillMount() {
        this.props.referralLatestCommissionHistory();
    }

	render() {
        const data = this.props.list;

		return (
			<Fragment>
                <MUIDataTable
                    title={<IntlMessages id="sidebar.estimatedCommissionValue" />}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </Fragment>
		);
	}
}

const mapStateToProps = ({refLtstCmsnHstRdcer}) => {
    const { list, loading } = refLtstCmsnHstRdcer;
    return { list, loading };
}

export default connect(mapStateToProps,{referralLatestCommissionHistory}) (ReferralLatestCommissionHistoryTableWdgt);

