// Component for trade summary data by :tejas
// import react 
import React, { Fragment } from 'react';

//import method for connect component
import { connect } from 'react-redux';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// import card for display details
import { CardType5 } from '../DashboardCard/CardType5';

//import action for trade summary count
import { getTradeSummaryCount } from 'Actions/Trading';

/// create component for trade Summary
class TradeSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tradeSummaryCounts: [],
            marginTradingBit: props.marginTradingBit
        };
    }

    componentDidMount() {
        if (this.state.marginTradingBit === 1) {
            this.props.getTradeSummaryCount({ IsMargin: 1 });
        } else {
            this.props.getTradeSummaryCount({});
        }
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.tradeSummaryCounts) {
            this.setState({
                tradeSummaryCounts: nextprops.tradeSummaryCounts
            })
        }
    }

    fetchRecords = (e) => {
        e.stopPropagation();
        if (this.state.marginTradingBit === 1) {
            this.props.getTradeSummaryCount({ IsMargin: 1 });
        } else {
            this.props.getTradeSummaryCount({});
        }
    }

    render() {
        return (
            <Fragment>
                <CardType5
                    title={<IntlMessages id="sidebar.trade-summary" />}
                    count={this.state.tradeSummaryCounts ? this.state.tradeSummaryCounts.TOTALTRADE : 0}
                    icon="fa fa-list-alt"
                />
            </Fragment>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    tradeSummaryCounts: state.totalCount.tradeSummaryCounts
});

// export this component with action methods and props
export default connect(mapStateToProps, {
    getTradeSummaryCount
})(TradeSummary);
