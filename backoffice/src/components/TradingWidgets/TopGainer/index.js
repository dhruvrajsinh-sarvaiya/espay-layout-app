import React, { Fragment } from 'react';

import { CardType5 } from '../DashboardCard/CardType5';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";


class Gainers extends React.Component {

    render() {

        return (
            <Fragment>
                <CardType5
                    title={<IntlMessages id="trading.topgainers.label.title" />}
                    count="10"
                    icon="zmdi zmdi-grid"
                    bgClass="bg-dark"
                />
            </Fragment>

        )
    }
}

export default Gainers;


