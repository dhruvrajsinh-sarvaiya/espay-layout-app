/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Open Orders Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Form,  Label, Input,Col } from 'reactstrap';
import MatButton from "@material-ui/core/Button";

import MUIDataTable from "mui-datatables";

import { hexToRgbA } from 'Helpers/helpers';
import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

// import neccessary actions
import {
	openOrders,
	openOrdersRefresh
} from 'Actions/TradingReport';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// define Open Orders component
class RevenueList extends Component {

	// make default state values on load
	constructor(props) {
		super();
		this.state = {
			start_date: '',
			end_date: '',
			pair: 'all',
			type: 0,
			onLoad: 0
		}
	}

	

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

	// call Open Orders list on load
	componentDidMount() {
		
	}

	render() {
		
        const { drawerClose } = this.props;
		const data = this.props.revenueData;

		// define options for data tables
		const options = {
			filterType: 'dropdown',
			responsive: 'scroll',
			selectableRows: false,
		};
		// define columns for data tables
		const columns = ["Sr No.", "Coin Name", "Revenue"];

		return (
			<Fragment>
				<div className="charts-widgets-wrapper">
                    {/* <PageTitleBar title={this.props.title}/> */}
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>Revenue</h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
				<Col sm={12}>
					<div className="transaction-history-detail">					 
                       <MUIDataTable
                            title=""
                            data={data.map(item => {
								return [
									item.SrNo,
									item.coinName,
									item.revenue,									
								]
							})}
                            columns={columns}
                            options={options}
                            />                        
					</div>
				</Col>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
    revenueData:state.revenueData.revenueList
});

export default connect(mapStateToProps, {    
})(RevenueList);

// // map states to props when changed in states from reducer
// const mapStateToProps = ({ openOrders }) => {
// 	const { openOrdersList, loading } = openOrders;
// 	return { openOrdersList, loading }
// }

// // export this component with action methods and props
// export default connect(mapStateToProps, { openOrders, openOrdersRefresh })(RevenueList);
