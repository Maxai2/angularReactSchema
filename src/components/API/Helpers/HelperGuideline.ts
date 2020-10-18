import { fabric } from 'fabric';

import {
	Handler,
	FabricObject,
	FabricEvent
} from '..';

class HelperGuideline {
	private _handler: Handler;
	private _verticalLines: { x?: number; y1?: number; y2?: number }[];
	private _horizontalLines: { y?: number; x1?: number; x2?: number }[];
	private _ctx: CanvasRenderingContext2D;
	private _viewportTransform: number[];

	private _aligningLineOffset: number;
	private _aligningLineMargin: number;
	private _aligningLineWidth: number;
	private _aligningLineColor: string;
	private _zoom: number;
	private _enabled: boolean;

	constructor(handler: Handler) {
		this._handler = handler;

		this._ctx = this._handler.canvas.getSelectionContext();
		this._aligningLineOffset = 5;
		this._aligningLineMargin = 4;
		this._aligningLineWidth = 1;
		this._aligningLineColor = '#4051b5';
		this._viewportTransform = this._handler.canvas.viewportTransform;
		this._zoom = 1;
		this._verticalLines = [];
		this._horizontalLines = [];

		this.setEnabled();
	}

	public enabled = (): boolean => this._enabled;
	public setEnabled = (enabled: boolean = true) => {
		if (this._enabled === enabled) return;
		if (enabled) {
			this.attachListeners()
		} else {
			this.detachListeners();
		}
		this._enabled = enabled;
	}

	private attachListeners = () => {
		this._handler.on('object:moving', this.onMoving);
		this._handler.on('mouse:down', this.onMousedown);
		this._handler.on('mouse:up', this.onMouseup);
		this._handler.on('before:render', this.onBeforeRender);
		this._handler.on('after:render', this.onAfterRender);
	}

	private detachListeners = () => {
		this._handler.off('object:moving', this.onMoving);
		this._handler.off('mouse:down', this.onMousedown);
		this._handler.off('mouse:up', this.onMouseup);
		this._handler.off('before:render', this.onBeforeRender);
		this._handler.off('after:render', this.onAfterRender);
	}

	private onMoving = (opt: FabricEvent) => {
		const { target } = opt as any;
		this.movingGuidelines(target);
	}

	private onMousedown = (opt: FabricEvent) => {
		this._viewportTransform = this._handler.canvas.viewportTransform;
		this._zoom = this._handler.zoom();
	}

	private onMouseup = (opt: FabricEvent) => {
		this._verticalLines.length = 0;
		this._horizontalLines.length = 0;
		this._handler.canvas.renderAll();
	}

	private onBeforeRender = (opt: FabricEvent) => {
		this._handler.canvas.clearContext(this._ctx);
	}

	private onAfterRender = (opt: FabricEvent) => {
		for (let i = this._verticalLines.length; i--;) {
			this.drawVerticalLine(this._verticalLines[i]);
		}
		for (let i = this._horizontalLines.length; i--;) {
			this.drawHorizontalLine(this._horizontalLines[i]);
		}
		this._verticalLines.length = 0;
		this._horizontalLines.length = 0;
	}

	private drawVerticalLine = (coords: { x?: number; y1?: number; y2?: number }) => {
		this.drawLine(
			coords.x + 0.5,
			coords.y1 > coords.y2 ? coords.y2 : coords.y1,
			coords.x + 0.5,
			coords.y2 > coords.y1 ? coords.y2 : coords.y1,
		);
	}

	private drawHorizontalLine = (coords: { y?: number; x1?: number; x2?: number }) => {
		this.drawLine(
			coords.x1 > coords.x2 ? coords.x2 : coords.x1,
			coords.y + 0.5,
			coords.x2 > coords.x1 ? coords.x2 : coords.x1,
			coords.y + 0.5,
		);
	}

	private drawLine = (x1: number, y1: number, x2: number, y2: number) => {
		const { _ctx: ctx, _aligningLineWidth: aligningLineWidth, _aligningLineColor: aligningLineColor, _viewportTransform: viewportTransform, _zoom: zoom } = this;
		ctx.save();
		ctx.lineWidth = aligningLineWidth;
		ctx.strokeStyle = aligningLineColor;
		ctx.beginPath();
		ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
		ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
		ctx.stroke();
		ctx.restore();
	}

	private isInRange = (v1: number, v2: number) => {
		const { _aligningLineMargin: aligningLineMargin } = this;
		v1 = Math.round(v1);
		v2 = Math.round(v2);
		for (let i = v1 - aligningLineMargin, len = v1 + aligningLineMargin; i <= len; i++) {
			if (i === v2) {
				return true;
			}
		}
		return false;
	}

	private movingGuidelines = (target: FabricObject) => {
		const canvasObjects = this._handler.canvas.getObjects() as FabricObject[];
		const activeObjectCenter = target.getCenterPoint();
		const activeObjectLeft = activeObjectCenter.x;
		const activeObjectTop = activeObjectCenter.y;
		const activeObjectBoundingRect = target.getBoundingRect();
		const activeObjectHeight = activeObjectBoundingRect.height / this._viewportTransform[3];
		const activeObjectWidth = activeObjectBoundingRect.width / this._viewportTransform[0];
		let horizontalInTheRange = false;
		let verticalInTheRange = false;
		const { _currentTransform: transform } = this._handler.canvas as any;
		if (!transform) {
			return;
		}

		for (let i = canvasObjects.length; i--;) {
			if (
				canvasObjects[i] === target ||
				!canvasObjects[i].evented
			) {
				continue;
			}

			const objectCenter = canvasObjects[i].getCenterPoint();
			const objectLeft = objectCenter.x;
			const objectTop = objectCenter.y;
			const objectBoundingRect = canvasObjects[i].getBoundingRect();
			const objectHeight = objectBoundingRect.height / this._viewportTransform[3];
			const objectWidth = objectBoundingRect.width / this._viewportTransform[0];

			// snap by the horizontal center line
			if (this.isInRange(objectLeft, activeObjectLeft)) {
				verticalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const y1 = -5000;
					const y2 = 5000;
					this._verticalLines.push({
						x: objectLeft,
						y1,
						y2,
					});
				} else {
					this._verticalLines.push({
						x: objectLeft,
						y1:
							objectTop < activeObjectTop
								? objectTop - objectHeight / 2 - this._aligningLineOffset
								: objectTop + objectHeight / 2 + this._aligningLineOffset,
						y2:
							activeObjectTop > objectTop
								? activeObjectTop + activeObjectHeight / 2 + this._aligningLineOffset
								: activeObjectTop - activeObjectHeight / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
			}

			// snap by the left edge
			if (this.isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
				verticalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const y1 = -5000;
					const y2 = 5000;
					let x = objectLeft - objectWidth / 2;

					this._verticalLines.push({
						x,
						y1,
						y2,
					});
				} else {
					this._verticalLines.push({
						x: objectLeft - objectWidth / 2,
						y1:
							objectTop < activeObjectTop
								? objectTop - objectHeight / 2 - this._aligningLineOffset
								: objectTop + objectHeight / 2 + this._aligningLineOffset,
						y2:
							activeObjectTop > objectTop
								? activeObjectTop + activeObjectHeight / 2 + this._aligningLineOffset
								: activeObjectTop - activeObjectHeight / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(
					new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop),
					'center',
					'center',
				);
			}

			// snap by the right edge
			if (this.isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
				verticalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const y1 = -5000;
					const y2 = 5000;
					let x = objectLeft + objectWidth / 2;
					this._verticalLines.push({
						x,
						y1,
						y2,
					});
				} else {
					this._verticalLines.push({
						x: objectLeft + objectWidth / 2,
						y1:
							objectTop < activeObjectTop
								? objectTop - objectHeight / 2 - this._aligningLineOffset
								: objectTop + objectHeight / 2 + this._aligningLineOffset,
						y2:
							activeObjectTop > objectTop
								? activeObjectTop + activeObjectHeight / 2 + this._aligningLineOffset
								: activeObjectTop - activeObjectHeight / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(
					new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop),
					'center',
					'center',
				);
			}

			// snap by the vertical center line
			if (this.isInRange(objectTop, activeObjectTop)) {
				horizontalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const x1 = -5000;
					const x2 = 5000;
					this._horizontalLines.push({
						y: objectTop,
						x1,
						x2,
					});
				} else {
					this._horizontalLines.push({
						y: objectTop,
						x1:
							objectLeft < activeObjectLeft
								? objectLeft - objectWidth / 2 - this._aligningLineOffset
								: objectLeft + objectWidth / 2 + this._aligningLineOffset,
						x2:
							activeObjectLeft > objectLeft
								? activeObjectLeft + activeObjectWidth / 2 + this._aligningLineOffset
								: activeObjectLeft - activeObjectWidth / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
			}

			// snap by the top edge
			if (this.isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
				horizontalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const x1 = -5000;
					const x2 = 5000;
					let y = objectTop - objectHeight / 2;

					this._horizontalLines.push({
						y,
						x1,
						x2,
					});
				} else {
					this._horizontalLines.push({
						y: objectTop - objectHeight / 2,
						x1:
							objectLeft < activeObjectLeft
								? objectLeft - objectWidth / 2 - this._aligningLineOffset
								: objectLeft + objectWidth / 2 + this._aligningLineOffset,
						x2:
							activeObjectLeft > objectLeft
								? activeObjectLeft + activeObjectWidth / 2 + this._aligningLineOffset
								: activeObjectLeft - activeObjectWidth / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(
					new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2),
					'center',
					'center',
				);
			}

			// snap by the bottom edge
			if (this.isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
				horizontalInTheRange = true;
				if (canvasObjects[i].id === this._handler.idWorkarea()) {
					const x1 = -5000;
					const x2 = 5000;
					let y = objectTop + objectHeight / 2;

					this._horizontalLines.push({
						y,
						x1,
						x2,
					});
				} else {
					this._horizontalLines.push({
						y: objectTop + objectHeight / 2,
						x1:
							objectLeft < activeObjectLeft
								? objectLeft - objectWidth / 2 - this._aligningLineOffset
								: objectLeft + objectWidth / 2 + this._aligningLineOffset,
						x2:
							activeObjectLeft > objectLeft
								? activeObjectLeft + activeObjectWidth / 2 + this._aligningLineOffset
								: activeObjectLeft - activeObjectWidth / 2 - this._aligningLineOffset,
					});
				}
				target.setPositionByOrigin(
					new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2),
					'center',
					'center',
				);
			}
		}

		if (!horizontalInTheRange) {
			this._horizontalLines.length = 0;
		}

		if (!verticalInTheRange) {
			this._verticalLines.length = 0;
		}
	}
}

export default HelperGuideline;
