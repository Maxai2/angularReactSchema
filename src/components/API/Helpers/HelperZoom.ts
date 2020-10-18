import { fabric } from 'fabric';

import {
	Handler,
	FabricEvent,
	ZoomEvent,
} from '..';
import { debounce } from 'lodash';

class HelperZoom {
	private _handler?: Handler;
	private _zoomMin: number;
	private _zoomMax: number;
	private _centeredZoom: boolean;
	private _userDefinedZoomMin: boolean;

	constructor(handler: Handler) {
		this._handler = handler;
		this._centeredZoom = false;
		this._userDefinedZoomMin = false;
		this._zoomMin = this.fitScale(this._handler.workarea().width, this._handler.workarea().height) * 100;
		this._zoomMax = 500;

		this._handler.on('mouse:wheel', this.onMousewheel);
		this._handler.on('resize', this.onResize);
		this._handler.on('blueprint:resize', this.onResize);
	}

	public zoomMin = (): number => this._zoomMin;
	public zoomMax = (): number => this._zoomMax;
	public centeredZoom = (): boolean => this._centeredZoom;
	public setZoomMin = (value: number) => {
		this._userDefinedZoomMin = true;
		this._zoomMin = Math.abs(value);
	}
	public setZoomMax = (value?: number) => this._zoomMax = Math.abs(value);
	public setCenteredZoom = (centered: boolean = true) => this._centeredZoom = centered;

	public zoomToPoint = (point: fabric.Point, zoom: number) => {
		let zoomRatio = zoom;
		if (zoom <= this._zoomMin / 100) {
			zoomRatio = this._zoomMin / 100;
		} else if (zoom >= this._zoomMax / 100) {
			zoomRatio = this._zoomMax / 100;
		}

		const canvas = this._handler.canvas;
		if (canvas.getZoom() === zoomRatio) return;
		canvas.skipTargetFind = true;
		canvas['zooming'] = true;
		canvas.zoomToPoint(point, zoomRatio);
		this.update();

		const event = { ratio: this.zoom(), fixed: this.zoom(true) } as ZoomEvent;
		this._handler.trigger('zoom', event);
	}

	public zoomOneToOne = () => {
		const center = this._handler.canvas.getCenter();
		this._handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		this.zoomToPoint(new fabric.Point(center.left, center.top), 1);
	}

	public zoomToFit = () => {
		const center = this._handler.canvas.getCenter();
		this._handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		this.zoomToPoint(new fabric.Point(center.left, center.top), this.fitScale(this._handler.workarea().width, this._handler.workarea().height));
	}

	public zoomIn = (ratio: number = 0.025) => {
		let zoomRatio = this._handler.canvas.getZoom();
		zoomRatio += ratio;
		const center = this._handler.canvas.getCenter();
		this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
	}

	public zoomOut = (ratio: number = 0.025) => {
		let zoomRatio = this._handler.canvas.getZoom();
		zoomRatio -= ratio;
		const center = this._handler.canvas.getCenter();
		this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
	}

	public zoom = (fixed: boolean = false): number => {
		const zoom = this._handler.canvas.getZoom();
		return fixed ? parseInt((zoom * 100).toFixed(2), 10) : zoom;
	}

	private fitScale = (width: number, height: number): number => {
		width <= 0 && (width = 1);
		height <= 0 && (height = 1);
		let scaleX: number, scaleY: number;
		scaleX = this._handler.canvas.getWidth() / width;
		scaleY = this._handler.canvas.getHeight() / height;
		if (height > width) {
			scaleX = scaleY;
			if (this._handler.canvas.getWidth() < width * scaleX) {
				scaleX = scaleX * (this._handler.canvas.getWidth() / (width * scaleX));
			}
		} else {
			scaleY = scaleX;
			if (this._handler.canvas.getHeight() < height * scaleX) {
				scaleX = scaleX * (this._handler.canvas.getHeight() / (height * scaleX));
			}
		}

		return scaleX;
	}

	private onMousewheel = (opt: FabricEvent) => {
		const event = opt as FabricEvent<WheelEvent>;

		const delta = event.e.deltaY;
		let zoomRatio = this.zoom();
		if (delta > 0) {
			zoomRatio -= 0.025;
		} else {
			zoomRatio += 0.025;
		}
		this.zoomToPoint(
			this._centeredZoom ?
				new fabric.Point(this._handler.canvas.getWidth() / 2, this._handler.canvas.getHeight() / 2) :
				new fabric.Point(event.e.offsetX, event.e.offsetY),
			zoomRatio,
		);
		event.e.preventDefault();
		event.e.stopPropagation();
	}

	private onResize = () => {
		const padding = 0.005;
		if (!this._userDefinedZoomMin) {
			this._zoomMin = (this.fitScale(this._handler.workarea().width, this._handler.workarea().height) - padding) * 100;
		}
		this._handler.zoomToFit();
		this.zoomOut(padding);
	}

	private update = debounce(() => {
		const canvas = this._handler.canvas;
		canvas.skipTargetFind = false;
		canvas['zooming'] = false;
		canvas.setViewportTransform(canvas.viewportTransform);
	}, 300, { leading: false, trailing: true });
}

export default HelperZoom;
