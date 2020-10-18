import { fabric } from 'fabric';

import {
	Handler,
	FabricObject,
	FabricEvent
} from '..';

class HelperGrid {
	private _handler: Handler;
	private _ctx: CanvasRenderingContext2D;
	private _aligningLineWidth: number;
	private _aligningLineColor: string;
	private _enabled: boolean;
	private _gridStep: number;
	private _gridStepRelative: number;
	private _snapToGrid: boolean;

	constructor(handler: Handler) {
		this._handler = handler;
		this._ctx = this._handler.canvas['contextTop'];
		this._gridStep = 10;

		this.setSnapToGrid(false);
		this.setEnabled();
	}

	public enabled = (): boolean => this._enabled;
	public snapToGrid = (): boolean => this._snapToGrid;
	public gridStep = (): number => this._gridStep;

	public setSnapToGrid = (snapToGrid: boolean = true) => this._snapToGrid = snapToGrid;
	public setEnabled = (enabled: boolean = true) => {
		if (this._enabled === enabled) return;
		if (enabled) {
			this.attachListeners()
		} else {
			this.detachListeners();
		}
		this._handler.canvas.requestRenderAll();
		this._enabled = enabled;
	}

	private setCoords = (target: FabricObject | fabric.ActiveSelection) => {
		if (this._enabled && this._snapToGrid) {
			if (target.type === 'activeSelection') {
				const activeSelection = target as fabric.ActiveSelection;
				activeSelection.set({
					left: Math.round(target.left / this._gridStepRelative) * this._gridStepRelative,
					top: Math.round(target.top / this._gridStepRelative) * this._gridStepRelative,
				});
				activeSelection.setCoords();
				return;
			}
			const obj = target as FabricObject;
			obj.set({
				left: Math.round(target.left / this._gridStepRelative) * this._gridStepRelative,
				top: Math.round(target.top / this._gridStepRelative) * this._gridStepRelative,
			});
			target.setCoords();
		}
	}

	private scale = (minStep: number, srcSteps: number[]): number => {
		const power = Math.floor(Math.log10(minStep) || (Math.log(minStep) / Math.log(10)));
		let order = Math.pow(10, power);
		let steps = srcSteps.map(function (v) {
			return v * order;
		});
		order = Math.pow(10, power + 1);
		steps = steps.concat(srcSteps.map(function (v) {
			return v * order;
		}));
		let step = 0;
		for (let i = 0; i < steps.length; i++) {
			step = steps[i];
			if (step >= minStep) break;
		}
		return step;
	}

	private mapRange = (x: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	private drawLine = (x1: number, y1: number, x2: number, y2: number) => {
		const { _ctx: ctx, _aligningLineWidth: aligningLineWidth, _aligningLineColor: aligningLineColor } = this;
		ctx.save();
		ctx.lineWidth = aligningLineWidth;
		ctx.strokeStyle = aligningLineColor;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.restore();
	}

	private onBeforeRender = (opt: FabricEvent) => {
		this._handler.canvas.clearContext(this._ctx);
	}

	private onAfterRender = (opt?: FabricEvent) => {
		const colorLine = 'rgba(0, 0, 0, 0.08)';
		const colorBorderSub = 'rgba(0, 0, 0, 0.1)';
		const colorBorderMain = 'rgba(0, 0, 0, 0.12)';

		const canvasCenter = this._handler.canvas.getCenter();
		const vpLeft = this._handler.canvas.vptCoords.tl.x;
		const vpRight = this._handler.canvas.vptCoords.br.x;
		const vpTop = this._handler.canvas.vptCoords.tl.y;
		const vpBottom = this._handler.canvas.vptCoords.br.y;

		const minStep = this._gridStep / (this._handler.zoom(true) / (this._handler.zoomMax() - this._handler.zoomMin()));
		this._gridStepRelative = this.scale(minStep, [1, 2, 3, 4, 5]);
		const distance = this._handler.canvas.width > this._handler.canvas.height ?
			this._handler.canvas.width :
			this._handler.canvas.height;
		const totalSteps = Math.ceil(distance * (this._gridStep / this._gridStepRelative) * 0.5);

		for (let i = -totalSteps; i < totalSteps; ++i) {
			this._aligningLineColor = colorLine;
			this._aligningLineWidth = 0.5;

			const x = canvasCenter.left + i * this._gridStepRelative;
			const y = canvasCenter.top + i * this._gridStepRelative;

			if ((x < vpLeft || x > vpRight) && (y < vpTop || y > vpBottom)) continue;

			if (i % 6 === 0) {
				this._aligningLineColor = colorBorderMain;
				this._aligningLineWidth = 1;
			} else if (i % 3 === 0) {
				this._aligningLineColor = colorBorderSub;
				this._aligningLineWidth = 0.75;
			}

			const vl = fabric.util.transformPoint(new fabric.Point(x, distance * this._gridStep), this._handler.canvas.viewportTransform);
			const hl = fabric.util.transformPoint(new fabric.Point(distance * this._gridStep, y), this._handler.canvas.viewportTransform);
			this.drawLine(vl.x, 0, vl.x, vl.y);
			this.drawLine(0, hl.y, hl.x, hl.y);
		}
	}

	private onMoved = (opt: FabricEvent) => {
		const { target } = opt;
		this.setCoords(target);
	}

	private onAdd = (opt: FabricEvent) => {
		const { target } = opt;
		this.setCoords(target);
	}

	private attachListeners = () => {
		this._handler.on('object:moved', this.onMoved);
		this._handler.on('object:add', this.onAdd);
		this._handler.on('before:render', this.onBeforeRender);
		this._handler.on('after:render', this.onAfterRender);
	}

	private detachListeners = () => {
		this._handler.off('mouse:moved', this.onMoved);
		this._handler.off('object:add', this.onAdd);
		this._handler.off('before:render', this.onBeforeRender);
		this._handler.off('after:render', this.onAfterRender);
	}
}

export default HelperGrid;
