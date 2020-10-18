import React, { Component } from 'react';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';

import Handler, { HandlerOptions } from './Handler';
import { FabricCanvas } from './Utils';
import { debounce } from 'lodash';

const defaultCanvasOption = {
	preserveObjectStacking: true,
	width: -1,
	height: -1,
	selection: true,
	defaultCursor: 'default',
	backgroundColor: '#f3f3f3',
};

const defaultKeyboardEvent = {
	move: true,
	all: true,
	esc: true,
	del: true,
	transaction: true,
	zoom: true,
	clone: true,
};

export type CanvasProps = HandlerOptions & {
	style?: React.CSSProperties;
	ref?: React.RefAttributes<Handler>;
};

class Canvas extends Component<CanvasProps> {
	public handler: Handler;
	public canvas: FabricCanvas;
	public container = React.createRef<HTMLDivElement>();
	private resizeObserver: ResizeObserver;

	state = {
		id: v4(),
	};

	componentDidMount() {
		const {
			canvasOption,
			width,
			height,
			keyEvent,
			propertiesToInclude,
			gridOption,
			...other
		} = this.props;
		const { id } = this.state;
		this.createObserver();
		const mergedCanvasOption = Object.assign({}, defaultCanvasOption, canvasOption, {
			width,
			height,
		});
		this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
		this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		this.canvas.FX_DURATION = 250;
		this.canvas.renderAll();

		this.handler = new Handler({
			id,
			canvas: this.canvas,
			keyEvent: Object.assign({}, defaultKeyboardEvent, keyEvent),
			canvasOption: mergedCanvasOption,
			...other,
		});

		this.handler.attachEventListener();
	}

	componentDidUpdate(prevProps: CanvasProps) {
		if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
			this.handler.canvas.setBackgroundColor(
				this.props.canvasOption.backgroundColor,
				this.canvas.renderAll.bind(this.handler.canvas),
			);
		}

		if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
			this.handler.keyEvent = Object.assign({}, defaultKeyboardEvent, this.props.keyEvent);
		}
	}

	componentWillUnmount() {
		this.handler.detachEventListener();
		this.handler.clear(false, true);
		this.cancelObserver();
	}

	createObserver = () => {
		const resize = debounce((width: number, height: number) => this.handler.resize(width, height), 500, { leading: true, trailing: true });
		this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};
			resize(width, height);
		});
		this.resizeObserver.observe(this.container.current);
	};

	cancelObserver = () => {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
	};

	render() {
		const { style } = this.props;
		const { id } = this.state;
		return (
			<div
				ref={this.container}
				id={id}
				className="br-canvas"
				style={{ ...style }}
			>
				<canvas id={`canvas_${id}`} />
			</div>
		);
	}
}

export default Canvas;
