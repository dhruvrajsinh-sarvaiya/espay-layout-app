//component for display card for user trade  By : Tejas
// import react for create component
import React, { Fragment } from 'react';

// import for connect component with store
import { connect } from 'react-redux';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// import card for display basic details 
import { CardType5 } from '../DashboardCard/CardType5';

//import actions for get user trade count
import { getUserTradeCount } from 'Actions/Trading';

// create class for user trade
class UserTrade extends React.Component {
    // constuctor that set the default state
    constructor(props) {
        super(props);
        this.state = {
            userTradeCount: [],
            marginTradingBit: props.marginTradingBit
        };
    }

    // call action after component render
    componentDidMount() {
        if (this.state.marginTradingBit === 1) {
            this.props.getUserTradeCount({ IsMargin: 1 });
        } else {
            this.props.getUserTradeCount({});
        }
    }

    // onclick of refresh call api for get count 
    fetchRecords = (e) => {
        e.stopPropagation();
        if (this.state.marginTradingBit === 1) {
            this.props.getUserTradeCount({ IsMargin: 1 });
        } else {
            this.props.getUserTradeCount({});
        }
    }

    // set props data in state if found
    componentWillReceiveProps(nextprops) {
        if (nextprops.userTradeCount) {
            this.setState({
                userTradeCount: nextprops.userTradeCount
            })
        }
    }

    //render a component
    render() {
        return (
            <Fragment>
                <CardType5
                    title={<IntlMessages id="card.list.title.usertrade" />}
                    count={this.state.userTradeCount.TotalCount}
                    icon="fa fa-address-book"                    
                />
            </Fragment>
        )
    }
}

// used for set state and props (get props from reducer)
const mapStateToProps = state => ({
    userTradeCount: state.totalCount.userTradeCounts
});

// export this component with action methods and props
export default connect(mapStateToProps, {
    getUserTradeCount,
})(UserTrade);