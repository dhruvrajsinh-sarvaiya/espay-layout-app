/* 
    Developer : Salim Deraiya
    Date : 17-12-2018
    File Comment : Top Leaders Grid
*/
import React, { Fragment, Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { GridLayout } from './Widgets';

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

const gainerList = [
    {
        image : 'Assets/image/user-profile.png',
        user_name : 'fifty-five',
        full_name : 'Albert Dietrich',
        popular:1,
        star : 1,
        return : 46.22,
        risk : 1,
        last: '12M',
        copiers : 430,
        last_7d_amt : -2.36,
        watch_list : 1
    },
    {
        image : 'Assets/image/client-1.png',
        user_name : 'fifty-five',
        full_name : 'Albert Dietrich',
        popular:2,
        star : 5,
        return : 46.22,
        risk : 2,
        last: '12M',
        copiers : 430,
        last_7d_amt : -2.36,
        watch_list : 1
    },
    {
        image : 'Assets/image/client-2.png',
        user_name : 'fifty-five',
        full_name : 'Albert Dietrich',
        popular:3,
        star : 5,
        return : 46.22,
        risk : 3,
        last: '12M',
        copiers : 1430,
        last_7d_amt : -2.36,
        watch_list : 0
    },
    {
        image : 'Assets/image/client-3.png',
        user_name : 'fifty-five',
        full_name : 'Albert Dietrich',
        popular:4,
        star : 1,
        return : 46.22,
        risk : 4,
        last: '12M',
        copiers : 430,
        last_7d_amt : -2.36,
        watch_list : 0
    }
];

class TopLeaderGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.setState({ data : gainerList });
    }

    render() {
        const { data } = this.state;
        return (            
            <Fragment>
                <div className="row">
                    { data.map((list,index) => (
                        <div className="col-md-3 col-sm-4 w-xs-full" key={index}>
                            <GridLayout gridData={list} />
                        </div>
                    ))}
                </div>
            {/* {
                watchlist &&
                <Dialog
					open={watchlist}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.watchModelClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle id="alert-dialog-slide-title">
						{"Use Google's location service?"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
            		</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button variant="raised" onClick={this.handleClose} className="btn-danger text-white mr-10">Disagree</Button>
						<Button variant="raised" onClick={this.handleClose} className="btn-success text-white mr-10">Agree</Button>
					</DialogActions>
				</Dialog>
            } */}
            </Fragment>
        )
    }
}

export default TopLeaderGrid;