import React from 'react';

import Switch from '@material-ui/core/Switch';

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// import Component For table
import { Table } from "reactstrap";

import Detail from './MarketDetail';


import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

const data = [
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    },
    {
        "id": 1, 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "website_slug": "bitcoin", 
        "rank": 1, 
        "price": 3705.21032758, 
        "volume_24h": 6434960578.39441, 
        "market_cap": 64456024119.0, 
        "percent_change_1h": -1.01, 
        "percent_change_24h": -6.95, 
        "percent_change_7d": -19.43,
        "circulating_supply": 17396050.0, 
        "total_supply": 17396050.0, 
        "max_supply": 21000000.0,         
        "last_updated": 1543311022
    }
]

// componenet listing
const components = {
    TodaysTrade: Detail,
};

class MarketData extends React.Component{
    constructor(props){
        super(props)
        this.state={
            baseCurrency : 'usd',
            data:[],
            open: false,
            defaultIndex: 0,        
            checked: false,
            modal: false,
            modalInfo: 0,
            sectionReload: false,
        }
        this.openModal = this.openModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleToggle() {
		//let items = this.state.items;
		
		this.setState({ checked : !this.state.checked});
    }

    //Open Modal add new Schedule dailog
    openModal = (index) => {        
        // console.log(index)
        this.setState({ modalInfo: index, modal: true });        
    }

    // handle close add new Schedule dailog
    handleClose() {
        this.setState({ modal: false });
    }
    
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName:''
        })
    }

    showComponent = (componentName,index) => {
        this.setState({
            modalInfo: index,
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    }

    render(){
        const { drawerClose } = this.props;    

        return(
            <div className={this.state.checked ? 'MarketHistoryTabel-darkmode':''}>
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>Markets</h2>
                    </div>

                   
                    <div className="page-title-wrap">
                    
                        <span className="mb-10">LightMode</span>
                        <Switch onChange={() => this.handleToggle()} checked={this.state.checked} />
                        <span className="mr-20 mb-10">DarkMode</span>                    

                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
            <div className="m-20 p-10">
                <div className="table-responsive-design">
                {data ?               
                 <Table >
                     <thead>
                            <tr>
                                <th>Name</th>
                                <th>Market Cap</th>
                                <th>Price</th>
                                <th>Volume (24h)</th>
                                <th>Circulating Supply</th>
                                <th>Change (24hr)</th>
                            </tr>
                            </thead> 
                            <tbody>
                            {data.map((value,key) => {
                               return <tr 
                                        onClick={(e) => this.showComponent('TodaysTrade',key)}
                                        style={{ cursor: "pointer" }}
                                        key={key}
                                        // onClick={() => this.openModal(key)}
                                        >
                                    <td> <img
                                        src={require("Assets/icon/btc.png")} 
                                        style={{height:"20px",width:"20px"}}
                                        alt="alt"
                                        /> 
                                         {value.name}   
                                        <span className="badge badge-primary">
                                            {value.symbol}
                                        </span>
                                     
                                      </td>
                                    <td>{value.market_cap}</td>
                                    <td>{value.price}</td>
                                    <td>{value.volume_24h}</td>
                                    <td>{value.circulating_supply}</td>
                                    <td>{value.percent_change_24h}</td>                               
                                </tr>
                             })}
                            </tbody>
                            </Table>
                : ''}              
                </div>
            </div>
            <Drawer
                width="100%"
                handler={false}
                open={this.state.open}
                onMaskClick={this.toggleDrawer}
                className="drawer2"
                level=".drawer1"
                placement="right"
                levelMove={100}
                >
                <Detail {...this.props} drawerClose={this.toggleDrawer}
                         closeAll={this.closeAll} data={data}
                         index={this.state.modalInfo}/>
                </Drawer>
                
            </div>
        )
    }
}

export default MarketData;