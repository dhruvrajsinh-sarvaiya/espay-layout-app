// component for report card in trading dashboard by tejas
import React, { Fragment } from 'react';

// import card for report
import { CardType5 } from '../DashboardCard/CardType5';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// used for connect component to store
import { connect } from 'react-redux';

//import actions for get user trade count
import { getReportCount } from 'Actions/Trading';

// class for reports components
class Reports extends React.Component {

    // onclick of refresh call count api
    fetchRecords = (e) => {
        e.stopPropagation();
        this.props.getUserTradeCount();
    }

 // call action after component render
 componentDidMount() {  
        this.props.getReportCount({});    
}

    // render the component 
    render() {

        // return  the component
        return (
            <Fragment>
                <CardType5
                    title={<IntlMessages id="card.list.title.report" />}
                    count={this.props.reportTotalCounts ? this.props.reportTotalCounts.TotalCount : 0}
                    icon="fa fa-flag"

                    bgClass="bg-dark"
                    refresh={this.props.userTradeCount.TotalCount > 0 ? "zmdi zmdi-refresh" : undefined}
                    getData={this.props.userTradeCount.TotalCount > 0 && this.fetchRecords}
                />
            </Fragment>
        )
    }
}

// used for set state and props (get props from reducer)
const mapStateToProps = state => ({
    userTradeCount: state.totalCount.userTradeCounts,
    reportTotalCounts:state.totalCount.reportTotalCounts
});

// export this component with action methods and props
export default connect(mapStateToProps, {
    getReportCount
})(Reports);

