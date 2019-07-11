import React,{Fragment} from 'react';

import {CardType2} from '../DashboardCard/CardType2';

import {
    getOrderSummaryTotalData,    
    getBuyerDataList,
    getSellerDataList,
} from 'Actions/Trading';
import {connect} from 'react-redux';

class OrderSummary extends React.Component{

    componentDidMount(){
        this.props.getOrderSummaryTotalData();
        this.props.getBuyerDataList();
        this.props.getSellerDataList();
    }
    
    render(){


        const data = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];

        return(
            <Fragment>
               <CardType2
                    title="card.list.title.ordersummary"
                    count={this.props.totalCount}
                    icon="zmdi-grid"
                    bgClass="bg-dark"                    
                    data={data}
                    createCount={"08"}
                    createTitle="Created Today"
                    bgColor="rgb(65, 62, 160)"
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    
});

export default connect(mapStateToProps, {
    getOrderSummaryTotalData, 
    getBuyerDataList,
    getSellerDataList,    
})(OrderSummary);

//export default OrderSummary;