/* 
    Developer : Salim Deraiya
    Date : 14-12-2018
    File Comment : Social Grid Layout
*/
import React, { Fragment, Component } from 'react';
import IntlMessages from "Util/IntlMessages";

class GridLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            watchlist: false,
            watchListFlag: false
        }
        this.watchModelClose = this.watchModelClose.bind(this);
        this.showWatchList = this.showWatchList.bind(this);
    }

    showWatchList() {
        this.setState({ watchListFlag: false });
    }

    watchModelClose() {
        this.setState({ watchlist: false });
    }

    render() {
        const { watchListFlag } = this.state;
        const { gridData, gridType } = this.props;
        var watchlist = gridData.watch_list !== 'undefined' ? gridData.watch_list : this.state;
        return (
            <Fragment>
                <div className={"grid_layout_area " + gridType}>
                    <div className="clearfix tp_grid_area">
                        <div className="prsn_img">
                            <img src={require('Assets/image/user-profile.png')} alt="Image" />
                            <span className={"sprite-stats popular-" + gridData.popular}></span>
                        </div>
                        <div className="prn_name">
                            <h2>{gridData.user_name}</h2>
                            <h4>{gridData.full_name}</h4>
                        </div>
                    </div>
                    <div className="mdl_grid_area clearfix">
                        <div className="return">
                            <h2><i className={gridData.return > 0 ? "fa fa-arrow-up" : "fa fa-arrow-down"} aria-hidden="true"></i> {gridData.return}%</h2>
                            <p><IntlMessages id="socialProfile.return" /></p>
                            <p className="last"><IntlMessages id="socialProfile.last" values={{ Last: gridData.last }} /></p>
                        </div>
                        <div className="risk">
                            <span className={"risk-label risk-" + gridData.risk}>{gridData.risk}</span><IntlMessages id="socialProfile.risk" />
                        </div>
                    </div>
                    <div className="ftr_grid_area clearfix">
                        <div className="copier">
                            <p className="text">{gridData.copiers} <IntlMessages id="socialProfile.copiers" /></p>
                            <p><span><i className={gridData.last_7d_amt > 0 ? "fa fa-arrow-up" : "fa fa-arrow-down"} aria-hidden="true"></i> {gridData.last_7d_amt}%</span> <IntlMessages id="socialProfile.last7D" /></p>
                        </div>
                        <div className="watchlist_area">
                            {
                                watchlist
                                    ? <span className="icon active"><i className="fa fa-check" aria-hidden="true"></i></span>
                                    : <span className="icon" onClick={this.showWatchList}><i className="fa fa-plus" aria-hidden="true"></i></span>
                            }
                            {
                                watchListFlag &&
                                <div className="watchlist">
                                    <ul>
                                        <li><IntlMessages id="socialProfile.myWatchlist" /></li>
                                        <li><IntlMessages id="socialProfile.addToNewList" /></li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

// type checking props
GridLayout.defaultProps = {
    data: [],
    gridType: 'gainer', //looser, gainer
    limit: 4
}

export default GridLayout;