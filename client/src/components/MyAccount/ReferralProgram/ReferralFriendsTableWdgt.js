/**
 * Login History Simple Table
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Import Referral Friends Actions...
import { referralFriends } from 'Actions/MyAccount';

//Table Object...
const columns = ["Email", "Date"];
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

class ReferralFriendsTableWdgt extends Component {	   
    componentWillMount() {
        this.props.referralFriends();
    }
	render() {
        const data = this.props.list;
		return (
			<Fragment>
                <MUIDataTable
                    title={<IntlMessages id="sidebar.referralFriends" />}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </Fragment>
		);
	}
}

const mapStateToProps = ({ refFrndRdcer }) => {
	const { list, loading } = refFrndRdcer;
    return { list, loading }
}

export default connect(mapStateToProps,{
    referralFriends
}) (ReferralFriendsTableWdgt);

