/**
 * Create By San/jay 
 * Created Date 18/03/2019
 * Plan user Linear Graph Component
 */
import React, { Component, Fragment } from 'react';
import { Progress } from 'reactstrap';
import IntlMessages from "Util/IntlMessages";

export default class PlanUsersLinearGraph extends Component {
    render() {
        const { PlanUsers } = this.props;
        const Max = Math.max.apply(Math, PlanUsers.map(function (o) { return o.APIUsers; }))
        return (
            <Fragment>
                <div>
                    <h1><IntlMessages id="apiPlanConfiguration.planUsers" /></h1>
                </div>
                <div className="planUserLinear">
                    {PlanUsers.length > 0 && PlanUsers.map((res, key) =>
                        <div className="row" key={key}>
                            <div className="col-3">
                                <p>{res.PlanName}</p>
                            </div>
                            <div className="col-9">
                                <Progress animated value={res.APIUsers} max={Max}>{res.APIUsers}</Progress>
                            </div>
                        </div>
                    )
                    }
                </div>
            </Fragment>
        )
    }
}