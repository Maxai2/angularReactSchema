import { fabric } from 'fabric';

import {
	Handler,
	FabricObject,
	InteractionMode,
	FabricEvent,
	InteractionEvent
} from '..';
import { clamp } from 'lodash';

type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

class HelperInteraction {
	private _handler: Handler;
	private _interactionMode: InteractionMode;
	private _panning: boolean;

	constructor(handler: Handler) {
		this._handler = handler;

		this._handler.isStatic() ? this.grab() : this.selection();

		this._handler.on('mouse:down', this.onMousedown);
		this._handler.on('mouse:move', this.onMousemove);
		this._handler.on('mouse:up', this.onMouseup);
		this._handler.on('zoom', this.onZoom);
	}

	public interactionMode = (): InteractionMode => this._interactionMode;
	public panning = (): boolean => this._panning;

	public selection = (callback?: (obj: FabricObject) => IReturnType) => {
		this._interactionMode = 'selection';
		this._handler.canvas.selection = true;
		this._handler.canvas.defaultCursor = 'default';

		this._handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.hoverCursor = 'move';
				obj.selectable = true;
				obj.evented = true;
			}
		});

		const event = { mode: this._interactionMode } as InteractionEvent;
		this._handler.trigger('interaction', event)
		this._handler.canvas.renderAll();
	}

	public grab = (callback?: (obj: FabricObject) => IReturnType) => {
		this._interactionMode = 'grab';
		this._handler.canvas.selection = false;
		this._handler.canvas.defaultCursor = this._handler.isStatic() ? 'default' : 'grab';

		this._handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.hoverCursor = this._handler.canvas.defaultCursor;
				obj.selectable = false;
				obj.evented = this._handler.isStatic() ? false : true;
			}
		});

		const event = { mode: this._interactionMode } as InteractionEvent;
		this._handler.trigger('interaction', event)
		this._handler.canvas.renderAll();
	}

	private moving = (e: MouseEvent) => {
		const delta = new fabric.Point(e.movementX, e.movementY);
		this._handler.canvas.relativePan(delta);
		this.keepPositionInBounds();
	}

	private keepPositionInBounds = () => {
		const canvas = this._handler.canvas;
		const { width, height, left, top } = this._handler.workarea();

		const zoom = canvas.getZoom();
		const xMin = left - width * zoom / 2;
		const xMax = left + width * zoom / 2;
		const yMin = top - height * zoom / 2;
		const yMax = top + height * zoom / 2;

		const point = new fabric.Point(left, top);
		const center = fabric.util.transformPoint(point, canvas.viewportTransform);

		const clampedCenterX = clamp(center.x, xMin, xMax);
		const clampedCenterY = clamp(center.y, yMin, yMax);

		const diffX = clampedCenterX - center.x;
		const diffY = clampedCenterY - center.y;

		if (diffX !== 0 || diffY !== 0) {
			canvas.relativePan(new fabric.Point(diffX, diffY));
		}
	}

	private interactionCallback = (obj: FabricObject, callback?: (obj: FabricObject) => void) => {
		callback(obj);
	}

	private onMousedown = (opt: FabricEvent) => {
		if (this._interactionMode === 'grab') {
			this._panning = true;
			this._handler.canvas.skipTargetFind = true;
		}
	}

	private onMousemove = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;

		if (this._interactionMode === 'grab' && this._panning) {
			this.moving(event.e);
		}

	}

	private onMouseup = (opt: FabricEvent) => {
		this._handler.canvas.skipTargetFind = false;
		if (this._interactionMode === 'grab') {
			this._panning = false;
		}
	}

	private onZoom = () => {
		this.keepPositionInBounds();
	}
}

export default HelperInteraction;
