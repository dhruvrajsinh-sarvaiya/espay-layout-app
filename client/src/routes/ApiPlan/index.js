// component for display Api plan Details By Tejas 26/2/2019

// import necessary components and react for component
import React, { Fragment, Component } from 'react';

// import for connect store
import { connect } from 'react-redux';

// import api plan component for list
import ViewApiPlan from "Components/ApiPlan/ViewApiPlanDetails";

import NotAvailable from "Components/ApiPlan/ApiPlanNotAvailable";

// used for display notifications
import { NotificationManager } from 'react-notifications';

import { getCurrencyList } from 'Actions/Trade';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import neccessary actions for fetch records
import {
    getApiPlanList,
    getUserActivePlan
} from 'Actions/ApiPlan';

// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// for cinvert language object into string
import { injectIntl } from 'react-intl';

// class for Api plan Component
class ApiPlanComponent extends Component {


    // make default state values on load
    constructor(props) {
        super(props);
        this.state = {
            apiPlanList: [],
            getApiPlanList: 0,
            UserActivePlanList: 0,
            SubscribeID: 0,
            activePlanId: 0,
            SubscribeData: {},
            IsActivePlan: false,
            wallets:[]
        }
    }

    // invoke after render component
    componentDidMount() {
        this.setState({
            getApiPlanList: 1,
            UserActivePlanList: 1
        })
        this.props.getApiPlanList({})
        this.props.getUserActivePlan({})
        this.props.getCurrencyList();
    }

    // invoke when success from subscribe
    callRecords = () => {
        this.setState({
            getApiPlanList: 1,
            UserActivePlanList: 1
        })
        this.props.getApiPlanList({})
        this.props.getUserActivePlan({})
    }

    // Invoke when component will about to recieve props
    componentWillReceiveProps(nextprops) {

        // set state for user plans
        if (this.state.UserActivePlanList && typeof (nextprops.UserPlanList) !== undefined || typeof (nextprops.UserPlanList) !== null) {
            this.setState({
                UserActivePlanList: 0,
                //SubscribeID:nextprops.UserPlanList.PlanID,                
                SubscribeData: nextprops.UserPlanList
            })
        }

        if (this.state.UserActivePlanList && nextprops.userPlanError.ReturnCode == 1 && nextprops.userPlanError.ErrorCode == 4501) {
            this.setState({
                UserActivePlanList: 0,
                SubscribeData: []
            })
        }

        // set plan list in state or display error if data not found
        if (this.state.getApiPlanList && nextprops.apiPlanList && nextprops.apiPlanList.length !== 0) {
            nextprops.apiPlanList.map((value, key) => {

                if (value.IsSubscribePlan == 1) {
                    this.setState({
                        SubscribeID: value.ID,
                    })
                }
            })

            this.setState({
                getApiPlanList: 0,
                apiPlanList: nextprops.apiPlanList,
            })
        }else if(this.state.getApiPlanList && nextprops.apiPlanList == null){
            this.setState({
                getApiPlanList: 0,
                apiPlanList: [],
            })
        }
        if (nextprops.apiPlanList && nextprops.apiPlanList.length == 0 && this.state.getApiPlanList && nextprops.errorCode == 4501) {
            NotificationManager.error(<IntlMessages id="error.trading.transaction.4501" />);
            this.setState({
                getApiPlanList: 0,
                apiPlanList: []
            })
        }

        if (nextprops.wallets && nextprops.wallets !== null) {
            
            this.setState({
                wallets: nextprops.wallets
            })          
        }
    }



    //renders the  component
    render() {

        return (
            <Fragment>

                {this.props.loading &&
                    this.props.userPlanLoading &&
                    <JbsSectionLoader />
                }

                <div className="charts-widgets-wrapper">
                    <PageTitleBar title={<IntlMessages id="sidebar.ApiPlan" />} match={this.props.match} />

                    {(this.state.apiPlanList.length > 0 && this.state.UserActivePlanList == 0 && this.state.getApiPlanList == 0
                        && this.state.SubscribeData !== {}
                    ) &&
                        <ViewApiPlan
                            data={this.state.apiPlanList}
                            history={this.props.history}
                            SubscribeID={this.state.SubscribeID}
                            SubscribeData={this.state.SubscribeData}
                            callRecords={this.callRecords}
                            wallets={this.state.wallets}
                        />


                    }

                    {
                        (this.state.apiPlanList.length == 0 && this.state.UserActivePlanList == 0 && this.state.getApiPlanList == 0
                            && this.state.SubscribeData !== {}
                        ) &&
                        <NotAvailable />
                    }

                </div>
            </Fragment>
        )
    }
}

//export default ApiPlanComponent;
// map states to props when changed in states from reducer
const mapStateToProps = ({ apiPlan,currency }) => {
    const {
        apiPlanList,
        loading,
        errorCode,
        userPlanError,
        userPlanLoading,
        UserPlanList,
        userPlanBit
    } = apiPlan;

    const {wallets} = currency;
    return {
        apiPlanList,
        loading,
        errorCode,
        userPlanError,
        userPlanLoading,
        UserPlanList,
        userPlanBit,
        wallets
    }
}

// export this component with action methods and props
export default connect(mapStateToProps, { getApiPlanList, getUserActivePlan,getCurrencyList })
    (injectIntl(ApiPlanComponent));