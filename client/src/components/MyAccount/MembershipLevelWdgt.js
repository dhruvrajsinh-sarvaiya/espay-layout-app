/**
 * CreatedBy - Kevin Ladani
 * Date - 04/10/2018
 */
/**
 * MemberShip Level
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import {  Alert } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// redux action
import { membershipLevel } from "Actions/MyAccount";

const MembershipButton = ({ plan_type, button_type }) => {
	let ButtonLevel = "";
	
	if (plan_type === "Basic") {
		ButtonLevel = <Button color="primary" className="btn-block btn-lg">{button_type}</Button>;
	} else if (plan_type === "Standard") {
	ButtonLevel = <Button disabled="disabled" color="warning" className="btn-block text-white btn-lg">{button_type}</Button>;
	} else if (plan_type === "Premium") {
		ButtonLevel = <Button disabled="disabled" color="info" className="btn-block btn-lg">{button_type}</Button>;
	} else {
		ButtonLevel = <Button color="primary" className="btn-block btn-lg">Basic</Button>;
	}
	return ButtonLevel;
};

const MemeberShipTitle = ({typeId}) => {
	var lblClass = '';
	if(typeId === "Standard") {
		lblClass = 'text-warning';
	} else if(typeId === "Premium") {
		lblClass = 'text-info';
	} else {
		lblClass = 'text-primary';
	}

	return (
		<h1 className={lblClass +' pricing-title'}>{typeId}</h1>
	)
}

class MembershipLevelWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			membershipList : [],			
            err_msg: '',
            loading : false
		}
	}

	componentWillMount() {
		this.props.membershipLevel({});
	}

	componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading, err_msg: '' });

        if (nextProps.memberShipData.ReturnCode === 1) {
			var errMsg = nextProps.memberShipData.ErrorCode === 1 ? nextProps.memberShipData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.memberShipData.ErrorCode}`} />;
			this.setState({ err_msg: errMsg });
		} else if (nextProps.memberShipData.ReturnCode === 0) {
            this.setState({ membershipList : nextProps.memberShipData.ProfileList });
        }
    }

	render() {
		const { membershipList, loading, err_msg } = this.state;
		return (
			<Fragment>
				{err_msg && <div className="alert_area">
					<Alert color="danger">{err_msg}</Alert>
				</div>}
				{
					loading
					? 
					<div className="text-center py-40 w-50 mx-auto">
						<CircularProgress className="progress-primary" />
					</div>
					:
					<div className="mt-20 row">
					{membershipList.length > 0 && membershipList.map((list,key) => (						
						<div className="col-md-4" key={key}>
							<JbsCollapsibleCard customClasses="text-center">
								<div className="pricing-icon mb-30 mt-30">
									<img
										src={require("Assets/img/pricing-icon.png")}
										alt="pricing icon"
										className="img-fluid"
										width=""
										height=""
									/>
								</div>
								<div className={`text-center pl-10`}>
									<MemeberShipTitle typeId={list.TypeId} />
									<div>
										<span className="pricing-main"><sup></sup>{list.Price}</span>
									</div>
									<div className="row">
										<div className="col-sm-2" />
										<div className="col-sm-8">
											<h4 style={{ minHeight: "50px" }}>{list.Description}</h4>
										</div>
										<div className="col-sm-2" />
									</div>

									<div className="mt-30">
										<div className="w-75 mx-auto">
											<MembershipButton plan_type={list.TypeId} button_type={list.LevelName} />
										</div>
									</div>

									<div className="mt-20 text-left row">
										<div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
											{<IntlMessages id="my_account.membershipLevel.depositFee" />}
										</div>
										<div className="col-md-4 col-sm-4">{list.DepositFee}</div>
									</div>
									<div className="mt-20 text-left row">
										<div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
											{<IntlMessages id="my_account.membershipLevel.withdarwlFee" />}
										</div>
										<div className="col-md-4 col-sm-4">{list.Withdrawalfee}</div>
									</div>
									<div className="mt-20 text-left row">
										<div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
											{<IntlMessages id="my_account.membershipLevel.tradingFee" />}
										</div>
										<div className="col-md-4 col-sm-4">{list.Tradingfee}</div>
									</div>
									<div className="mt-20 text-left row mb-30">
										<div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
											{<IntlMessages id="my_account.membershipLevel.widFee" />}
										</div>
										<div className="col-md-4 col-sm-4">{list.WithdrawalLimit} BTC</div>
									</div>
								</div>
							</JbsCollapsibleCard>
						</div>
					))}
					</div>
				}
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ membershipLevelRdcer }) => {
    var response = {
        memberShipData : membershipLevelRdcer.data,
        loading: membershipLevelRdcer.loading
    };
    return response;
};

export default connect(mapStateToProps, {
    membershipLevel
})(MembershipLevelWdgt);