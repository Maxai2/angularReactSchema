import { 
	Handler, 
	FabricEvent 
} from '..';

class HelperEvents {
	_handler: Handler;

	constructor(handler: Handler) {
		this._handler = handler;
	}

	public attachEventListener = () => {
		this._handler.canvas.on({
			'object:modified': this.modified,
			'object:scaling': this.scaling,
			'object:scaled': this.scaled,
			'object:moving': this.moving,
			'object:moved': this.moved,
			'object:rotating': this.rotating,
			'object:rotated': this.rotated,
			'mouse:wheel': this.mousewheel,
			'mouse:down': this.mousedown,
			'mouse:move': this.mousemove,
			'mouse:up': this.mouseup,
			'selection:cleared': this.selection,
			'selection:created': this.selection,
			'selection:updated': this.selection,
			'before:render': this.beforeRender,
			'after:render': this.afterRender,
		});
		this._handler.canvas.wrapperEl.tabIndex = 9000;
		this._handler.canvas.wrapperEl.addEventListener('mousedown', this.onmousedown, false);
	}

	public detachEventListener = () => {
		this._handler.canvas.off({
			'object:modified': this.modified,
			'object:scaling': this.scaling,
			'object:scaled': this.scaled,
			'object:moving': this.moving,
			'object:moved': this.moved,
			'object:rotating': this.rotating,
			'object:rotated': this.rotated,
			'mouse:wheel': this.mousewheel,
			'mouse:down': this.mousedown,
			'mouse:move': this.mousemove,
			'mouse:up': this.mouseup,
			'selection:cleared': this.selection,
			'selection:created': this.selection,
			'selection:updated': this.selection,
			'before:render': this.beforeRender,
			'after:render': this.afterRender,
		});

		this._handler.canvas.wrapperEl.removeEventListener('mousedown', this.onmousedown);
	}

	private mouseout = () => { }
	private onmousedown = (e: MouseEvent) => { /* e.preventDefault(); */ }
	private selection = (opt: FabricEvent) => this._handler.trigger('object:selection', opt);
	private modified = (opt: FabricEvent) => { this._handler.trigger('object:modified', opt);}
	private moving = (opt: FabricEvent) => { this._handler.trigger('object:moving', opt); this._handler.trigger('object:updating', opt); }
	private scaling = (opt: FabricEvent) => { this._handler.trigger('object:scaling', opt); this._handler.trigger('object:updating', opt); }
	private rotating = (opt: FabricEvent) => { this._handler.trigger('object:rotating', opt); this._handler.trigger('object:updating', opt); }
	private moved = (opt: FabricEvent) => { this._handler.trigger('object:moved', opt); this._handler.trigger('object:updated', opt); }
	private scaled = (opt: FabricEvent) => { this._handler.trigger('object:scaled', opt); this._handler.trigger('object:updated', opt); }
	private rotated = (opt: FabricEvent) => { this._handler.trigger('object:rotated', opt); this._handler.trigger('object:updated', opt); }
	private mousewheel = (opt: FabricEvent) => this._handler.trigger('mouse:wheel', opt);
	private mousedown = (opt: FabricEvent) => this._handler.trigger('mouse:down', opt);
	private mousemove = (opt: FabricEvent) => this._handler.trigger('mouse:move', opt);
	private mouseup = (opt: FabricEvent) => this._handler.trigger('mouse:up', opt);
	private beforeRender = (opt: FabricEvent) => this._handler.trigger('before:render', opt);
	private afterRender = (opt: FabricEvent) => this._handler.trigger('after:render', opt);

	public object = {
		mousedown: (opt: FabricEvent) => {
			const { target } = opt;
			if (target && target.reservation && target.reservation.enabled) {
				const { onClick } = this._handler;
				if (onClick) {
					onClick(this._handler.canvas, target);
				}
			}
		},

		mousedblclick: (opt: FabricEvent) => {
			const { target } = opt;
			if (target) {
				const { onDblClick } = this._handler;
				if (onDblClick) {
					onDblClick(this._handler.canvas, target);
				}
			}
		},
	}
}

export default HelperEvents;
