/**
 * Author : Tejas Goswami
 * Created : 3/06/2019
 * update by : devang parekh (7-6-2019)
 *  Arbitrage Pair Selection
*/

import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import Select from "react-select";

class PairSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pairList: this.props.pairData,
        };
    }

    onChangePair(event) {

        this.props.changePairs(event.data)

    }

    render() {

        const pairListData = [];

        this.props.pairData && this.props.pairData.map((item, key) => {
            item.PairList && item.PairList.map((pair, index) => {
                pairListData.push(pair)
            });
        });

        return (
            <Select className="r_sel_20 mb-15"
                value={this.props.currencyPair === null ? null : ({ label: this.props.currencyPair.split("_")[0] + " / " + this.props.currencyPair.split("_")[1] })}
                options={pairListData.map((item) => ({
                    value: item.PairId,
                    label: item.PairName.split("_")[0] + " / " + item.PairName.split("_")[1],
                    data: item
                }))}
                onChange={(e) => this.onChangePair(e)}
                isClearable={false}
                maxMenuHeight={200}
                placeholder={<IntlMessages id="sidebar.searchdot" />}
            />
        );
    }
}

export default PairSelection;