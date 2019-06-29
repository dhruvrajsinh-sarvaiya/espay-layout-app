// component for Top Loser Data By:Tejas Date : 4-1-2019

// import react and component
import React, { Component } from "react";

//import method for connect store in component
import { connect } from "react-redux";

// import section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import method for get top Losers data list
import { getTopLosersData } from "Actions/Trade";

// import component
import { Card, Table, Input } from 'reactstrap';

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

// create class for Top Loser component
class TopLoser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topLoserList: [],
            open: false,
            componentName: '',
            selectedType: 2
        };
    }

    // call api for get top Losers data
    componentDidMount() {
        this.props.getTopLosersData({ Type: this.state.selectedType })
    }

    // method for set component
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    // handle close drawer
    closeAll = () => {
        this.setState({
            open: false,
        });
    }

    // used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
        });
    }

    componentWillReceiveProps(nextprops) {

        if (nextprops.topLoserList.length !== 0 && nextprops.error.length == 0) {
            this.setState({
                topLoserList: nextprops.topLoserList,
            })
        }
        else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0) {
            this.setState({
                topLoserList: [],
            })
        }

    }

    // handle selected type for call api
    handleChange = (event) => {

        this.props.getTopLosersData({ Type: event.target.value })

        this.setState({
            selectedType: event.target.value
        })
    }

    render() {

        const topLosers = []

        if (this.state.topLoserList.length !== 0) {
            this.state.topLoserList.map((value, key) => {
                if (key < 10) {
                    topLosers.push(value)
                }
            })
        }

        return (
            <Card className="mb-10">
                {this.props.loading && <JbsSectionLoader />}

                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="trading.toplosers.label.title" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <Input
                            type="select"
                            name="currency"
                            value={this.state.selectedType}
                            onChange={(e) => this.handleChange(e)}
                        >
                            <IntlMessages id="widgets.volume">
                                {(select) =>
                                    <option value="1">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.topgainerslosers.label.changeper">
                                {(select) =>
                                    <option value="2">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.marketcap.label.lastprice">
                                {(select) =>
                                    <option value="3">{select}</option>
                                }
                            </IntlMessages>

                            <IntlMessages id="trading.topgainerslosers.label.changeval">
                                {(select) =>
                                    <option value="4">{select}</option>
                                }
                            </IntlMessages>
                        </Input>
                    </div>
                </div>
                <div className="StackingHistory">
                    <Table>
                        <thead>
                            <tr>
                                <th><IntlMessages id="trading.topgainerslosers.pair" /></th>
                                {this.state.selectedType == 1 && <th><IntlMessages id="widgets.volume" />  </th>}
                                {this.state.selectedType == 2 && <th><IntlMessages id="trading.topgainerslosers.label.changeper" />  </th>}
                                {this.state.selectedType == 3 && <th><IntlMessages id="trading.marketcap.label.lastprice" />  </th>}
                                {this.state.selectedType == 4 && <th><IntlMessages id="trading.topgainerslosers.label.changeval" />  </th>}
                                <th><IntlMessages id="widgets.high" /></th>
                                <th><IntlMessages id="widgets.low" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {topLosers.length !== 0 && topLosers.map((topLoser, key) =>
                                <tr key={key}>
                                    <td className="text-center">{topLoser.PairName}</td>
                                    {this.state.selectedType == 1 && <td className="text-center">{parseFloat(topLoser.Volume).toFixed(8)}</td>}
                                    {this.state.selectedType == 2 && <td className="text-center">{parseFloat(topLoser.ChangePer).toFixed(2)}</td>}
                                    {this.state.selectedType == 3 && <td className="text-center">{parseFloat(topLoser.LTP).toFixed(8)}</td>}
                                    {this.state.selectedType == 4 && <td className="text-center">{parseFloat(topLoser.ChangeValue).toFixed(8)}</td>}
                                    <td className="text-center">{parseFloat(topLoser.High).toFixed(8)}</td>
                                    <td className="text-center">{parseFloat(topLoser.Low).toFixed(8)}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    topLoserList: state.topGainerLoser.topLosers,
    loading: state.topGainerLoser.loadingLosers,
    error: state.topGainerLoser.errorLosers,
});
export default connect(
    mapStateToProps,
    {
        getTopLosersData,
    }
)(TopLoser);