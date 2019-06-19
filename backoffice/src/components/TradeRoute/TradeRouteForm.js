import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    postTradeRouteInfo
} from "Actions/TradeRoute";
// request validator
var validateAddRouteRequest = require("../../validation/TradeRoute/validateAddRouteRequest");
// fake data generator
/* const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    })); */

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    color: 'white',
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
});

class TradeRouteForm extends Component {
    state = this.props.details;
    id2List = {
        droppable: 'availRoutes',
        droppable2: 'selectedRoutes'
    };
    getList = id => this.state[this.id2List[id]];
    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selectedRoutes: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                availRoutes: result.droppable,
                selectedRoutes: result.droppable2
            });
        }
    };
    handleCancel(e){
        e.preventDefault();
        this.setState({ errors : {} });
        this.props.history.push({ pathname: "/app/trade-route" });
    }
    handleSubmit(e){
        e.preventDefault();
        const { errors, isValid } = validateAddRouteRequest(this.state);
        this.setState({ errors : errors});
        if(isValid){
            // console.log(this.state);
            this.props.postTradeRouteInfo(this.state);
        }
    }
    render() {
        return (
            <div className="PatternForm todo-wrapper">
                <JbsCollapsibleCard contentCustomClasses="p-30">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <FormGroup className={"d-flex " + (this.state.errors.currencyPair ? 'mb-0' : '')}>
                            <Label className="w-30 px-20"><IntlMessages id="wallet.currenyPair" /></Label>
                            <Input className="w-40" type="select" name="currencyPair" id="currencyPair"
                                value={this.state.currencyPair}
                                onChange={(e) => this.setState({ currencyPair: e.target.value })} >
                                <option value="">Select Pair</option>
                                <option value="BTC/ETH">BTC/ETH</option>
                                <option value="BCH/ETH">BCH/ETH</option>
                                <option value="BCI/ETh">BCI/ETh</option>
                            </Input>
                        </FormGroup>
                        {this.state.errors.currencyPair && (<FormGroup className="d-flex">
                            <Label className="w-30 px-20"></Label>
                            <Label className="w-70"><span className="text-danger"> <IntlMessages id={this.state.errors.currencyPair} /></span></Label>
                        </FormGroup>)}
                        <FormGroup className={"d-flex " + (this.state.errors.orderType ? 'mb-0' : '')}>
                            <Label className="w-30 px-20"><IntlMessages id="wallet.orderType" /></Label>
                            <Input className="w-40" type="select" name="orderType" id="orderType"
                                value={this.state.orderType}
                                onChange={(e) => this.setState({ orderType: e.target.value })} >
                                <option value="">Select Type</option>
                                <option value="Market">Market</option>
                                <option value="Spot">Spot</option>
                                <option value="Stop Limit">Stop Limit</option>
                            </Input>
                        </FormGroup>
                        {this.state.errors.orderType && (<FormGroup className="d-flex">
                            <Label className="w-30 px-20"></Label>
                            <Label className="w-70"><span className="text-danger"> <IntlMessages id={this.state.errors.orderType} /></span></Label>
                        </FormGroup>)}
                        <FormGroup className={"d-flex " + (this.state.errors.trnType ? 'mb-0' : '')}>
                            <Label className="w-30 px-20"><IntlMessages id="wallet.trnType" /></Label>
                            <Input className="w-40" type="select" name="trnType" id="trnType"
                                value={this.state.trnType}
                                onChange={(e) => this.setState({ trnType: e.target.value })} >
                                <option value="">Select Type</option>
                                <option value="Buy">Buy</option>
                                <option value="Sell">Sell</option>
                            </Input>
                        </FormGroup>
                        {this.state.errors.trnType && (<FormGroup className="d-flex">
                            <Label className="w-30 px-20"></Label>
                            <Label className="w-70"><span className="text-danger"> <IntlMessages id={this.state.errors.trnType} /></span></Label>
                        </FormGroup>)}
                        <FormGroup className={"d-flex " + (this.state.errors.status ? 'mb-0' : '')}>
                            <Label className="w-30 px-20"><IntlMessages id="widgets.status" /></Label>
                            <Input className="w-40" type="select" name="status" id="status"
                                value={this.state.status}
                                onChange={(e) => this.setState({ status: e.target.value })} >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Input>
                        </FormGroup>
                        {this.state.errors.status && (<FormGroup className="d-flex">
                            <Label className="w-30 px-20"></Label>
                            <Label className="w-70"><span className="text-danger"> <IntlMessages id={this.state.errors.status} /></span></Label>
                        </FormGroup>)}
                        <FormGroup className={"d-flex " + (this.state.errors.selectRoute?"mb-0":"")}>
                            <Label className="w-30 px-20"><IntlMessages id="wallet.selectRoute" /></Label>
                        </FormGroup>
                        {this.state.errors.selectRoute && (<FormGroup className="d-flex">
                            <Label className="w-70 px-20"><span className="text-danger"> <IntlMessages id={this.state.errors.selectRoute} /></span></Label>
                        </FormGroup>)}
                        <FormGroup>
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <div className="row">
                                    <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6">
                                        <JbsCollapsibleCard heading={<IntlMessages id="wallet.availableRoute" />}>
                                            <Droppable droppableId="droppable">
                                                {(provided, snapshot) => (
                                                    <ul className="list-unstyled list-group drag-list-wrapper"
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapshot.isDraggingOver)}>
                                                        {this.state.availRoutes.map((item, index) => (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    <li className="list-group-item">
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided.draggableProps.style
                                                                            )}>
                                                                            {item.content}
                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </ul>
                                                )}
                                            </Droppable>
                                        </JbsCollapsibleCard>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6">
                                        <JbsCollapsibleCard heading={<IntlMessages id="wallet.selectedRoute" />}>
                                            <Droppable droppableId="droppable2">
                                                {(provided, snapshot) => (
                                                    <ul className="list-unstyled list-group drag-list-wrapper"
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapshot.isDraggingOver)}>
                                                        {this.state.selectedRoutes.map((item, index) => (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    <li className="list-group-item">
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided.draggableProps.style
                                                                            )}>
                                                                            {item.content}
                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </ul>
                                                )}
                                            </Droppable>
                                        </JbsCollapsibleCard>
                                    </div>
                                </div>
                            </DragDropContext>
                        </FormGroup>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 justify-content-center d-flex">
                        <FormGroup className="mb-10">
                            <Button className="mx-10" color="danger" onClick={(e) => this.handleCancel(e)}><IntlMessages id={"button.cancel"} /></Button>
                            <Button className="mx-10" color="primary" onClick={(e) => this.handleSubmit(e)}>
                                {(this.state.routeId ? <IntlMessages id={"wallet.btnUpdateRoutes"} /> : <IntlMessages id={"wallet.btnAddRoutes"} />)}
                            </Button>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
            </div>
        );
    }
}


const mapStateToProps = ({ tradeRoute }) => {
    const { response, loading } = tradeRoute;
    return { response, loading };
};

export default connect(mapStateToProps, {
    postTradeRouteInfo
})(TradeRouteForm);

