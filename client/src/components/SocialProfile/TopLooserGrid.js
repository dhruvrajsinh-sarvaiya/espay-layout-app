/* 
    Developer : Salim Deraiya
    Date : 14-12-2018
    File Comment : Top Looser Grid
*/
import React, { Fragment, Component } from 'react';
import Slide from '@material-ui/core/Slide';
import { GridLayout } from './Widgets';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const gainerList = [
    {
        image: 'Assets/image/user-profile.png',
        user_name: 'fifty-five',
        full_name: 'Albert Dietrich',
        popular: 1,
        star: 1,
        return: 46.22,
        risk: 1,
        last: '12M',
        copiers: 430,
        last_7d_amt: -2.36,
        watch_list: 1
    },
    {
        image: 'Assets/image/client-1.png',
        user_name: 'fifty-five',
        full_name: 'Albert Dietrich',
        popular: 2,
        star: 5,
        return: 46.22,
        risk: 2,
        last: '12M',
        copiers: 430,
        last_7d_amt: -2.36,
        watch_list: 1
    },
    {
        image: 'Assets/image/client-2.png',
        user_name: 'fifty-five',
        full_name: 'Albert Dietrich',
        popular: 3,
        star: 5,
        return: 46.22,
        risk: 3,
        last: '12M',
        copiers: 1430,
        last_7d_amt: -2.36,
        watch_list: 0
    },
    {
        image: 'Assets/image/client-3.png',
        user_name: 'fifty-five',
        full_name: 'Albert Dietrich',
        popular: 4,
        star: 1,
        return: 46.22,
        risk: 4,
        last: '12M',
        copiers: 430,
        last_7d_amt: -2.36,
        watch_list: 0
    }
];

class TopLooserGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.setState({ data: gainerList });
    }

    render() {
        const { data } = this.state;
        return (
            <Fragment>
                <div className="row">
                    {data.map((list, index) => (
                        <div className="col-md-3 col-sm-4 w-xs-full" key={index}>
                            <GridLayout gridData={list} />
                        </div>
                    ))}
                </div>
            </Fragment>
        )
    }
}

export default TopLooserGrid;