/**
 * React Dnd
 */
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// fake data generator
const getItems = count =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `This is draggable item ${k}`,
		content: `This is draggable item ${k}`,
	}));
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};
// const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
	...draggableStyle,
});
const getListStyle = isDraggingOver => ({

});

export default class ReactDND extends Component {

	constructor(props) {
		super(props);
		this.state = {
			items: getItems(10),
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		const items = reorder(
			this.state.items,
			result.source.index,
			result.destination.index
		);
		this.setState({
			items,
		});
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<div className="dragula-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.reactDnd" />} match={this.props.match} />
				<JbsCollapsibleCard heading="React DND">
					<DragDropContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
								<ul className="list-unstyled list-group drag-list-wrapper" ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
									{this.state.items.map((item, index) => (
										<Draggable key={item.id} draggableId={item.id} index={index}>
											{(innProvided, innSnapshot) => (
												<li className="list-group-item">
													<div
														ref={innProvided.innerRef}
														{...innProvided.draggableProps}
														{...innProvided.dragHandleProps}
														className="drag-list"
														style={getItemStyle(
															innSnapshot.isDragging,
															innProvided.draggableProps.style
														)}>
														{item.content}
													</div>
													{innProvided.placeholder}
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					</DragDropContext>
				</JbsCollapsibleCard>
			</div>
		);
	}
}
