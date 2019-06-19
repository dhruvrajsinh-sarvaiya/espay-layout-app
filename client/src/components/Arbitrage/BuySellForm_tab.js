/**
 * Author : Salim Deraiya
 * Created : 28/05/2019
 *  Arbitrage Buy/Sell Form component..
*/

// import scrollbar
import React, { Component } from "react";
import { TabProvider, Tab, TabPanel, TabList } from "react-web-tabs";
import { Form, FormGroup, Label, Input} from "reactstrap";

class BuySellForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
            data : {
                orderType : '',
                quantity : 0,
                rate : 0,
                fees : 0,
                total : 0
            },
            defaultTab : 'buy',
            errors : {}
		};
    }
    
    onChange = (event) => {
        console.log('onChange :',event.target.name,event.target.value);
    }

	// Render Component for Buyer Order
	render() {
        const { orderType, quantity, rate, fees, total } = this.state.data;
		return (
			<TabProvider defaultTab={this.state.defaultTab}>
                <TabList className="arb_buy_sell_frm row">
                    <Tab tabFor="buy" className="col-6">Buy</Tab>
                    <Tab tabFor="sell" className="col-6">Sell</Tab>
                </TabList>
                <TabPanel tabId="buy">
                    <Form className="tradefrm">
                        <FormGroup>
                            <Label forHtml="orderType">Order Type</Label>
                            <Input type="text" tabIndex="1" name="orderType" value={orderType} id="orderType" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="quantity">Quantity</Label>
                            <Input type="text" tabIndex="1" name="quantity" value={quantity} id="quantity" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="rate">Buy Rate</Label>
                            <Input type="text" tabIndex="1" name="rate" value={rate} id="rate" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="fees">Fees</Label>
                            <Input type="text" tabIndex="1" name="fees" value={fees} id="fees" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="total">Total</Label>
                            <Input type="text" tabIndex="1" name="total" value={total} id="total" onChange={this.onChange} />
                        </FormGroup>
                    </Form>
                </TabPanel>
                <TabPanel tabId="sell">
                    <Form className="tradefrm">
                        <FormGroup>
                            <Label forHtml="orderType">Order Type</Label>
                            <Input type="text" tabIndex="1" name="orderType" value={orderType} id="orderType" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="quantity">Quantity</Label>
                            <Input type="text" tabIndex="1" name="quantity" value={quantity} id="quantity" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="rate">Sell Rate</Label>
                            <Input type="text" tabIndex="1" name="rate" value={rate} id="rate" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="fees">Fees</Label>
                            <Input type="text" tabIndex="1" name="fees" value={fees} id="fees" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label forHtml="total">Total</Label>
                            <Input type="text" tabIndex="1" name="total" value={total} id="total" onChange={this.onChange} />
                        </FormGroup>
                    </Form>
                </TabPanel>
            </TabProvider>
		);
	}
}

export default BuySellForm;