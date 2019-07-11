//component for display Configuration card By Tejas
import React, { Fragment } from 'react';
// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
// used for connect component to reducer/store
import { connect } from 'react-redux';

// Dashboard card for display card 
import { CardType5 } from '../DashboardCard/CardType5';
// action for get configuration count
import { getConfigurationCount } from 'Actions/Trading';

// class for configuration card in trading
class Configuration extends React.Component {
    // constructor for initial state
    constructor(props) {
        super(props);
        //set default state
        this.state = {
            configurationsCounts: [],
            //added by parth andhariya
            marginTradingBit: props.marginTradingBit
        };
    }

    // invoke after render function
    componentDidMount() {
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getConfigurationCount({ IsMargin: 1 });
        } else {
            this.props.getConfigurationCount({});
        }
    }

    // call count method on click of refresh button
    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getConfigurationCount({ IsMargin: 1 });
        } else {
            this.props.getConfigurationCount({});
        }
    }

    // invoke when component about to get props
    componentWillReceiveProps(nextprops) {
        if (nextprops.configurationsCounts) {
            this.setState({
                configurationsCounts: nextprops.configurationsCounts
            })
        }
    }

    // render the component
    render() {
        // returns the component
        return (
            <Fragment>
                <CardType5
                    title={<IntlMessages id="card.list.title.configuration" />}
                    count={this.state.configurationsCounts ? this.state.configurationsCounts.Count : 0}
                    icon="fa fa-cogs"
                />
            </Fragment>
        )
    }
}

// used for set state and props (get props from reducer)
const mapStateToProps = state => ({
    configurationsCounts: state.totalCount.configurationsCounts
});

// export this component with action methods and props
export default connect(mapStateToProps, {
    getConfigurationCount,
})(Configuration);
