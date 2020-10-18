import {
	Handler,
	FabricObject,
	KeyboardEventMapper
} from '..';

class HelperShortcuts {
	private _handler?: Handler;
	private _keyboardEventMapper: KeyboardEventMapper;
	private _enabled: boolean;

	constructor(handler: Handler) {
		this._handler = handler;
		this._keyboardEventMapper = new KeyboardEventMapper();
		this.setEnabled(true);
	}

	public setEnabled = (enabled: boolean) => {
		enabled ? this.attachListeners() : this.detachListeners();
		this._enabled = enabled;
	}

	private attachListeners = () => {
		this._handler.canvas.wrapperEl.addEventListener('keydown', this.onKeydown, false);
		this._handler.canvas.wrapperEl.addEventListener('keyup', this.onKeyup, false);
	}

	private detachListeners = () => {
		this._handler.canvas.wrapperEl.removeEventListener('keydown', this.onKeydown);
		this._handler.canvas.wrapperEl.removeEventListener('keyup', this.onKeyup);
	}

	private onKeydown = (e: KeyboardEvent) => {
		const { keyEvent } = this._handler;

		if (!Object.keys(keyEvent).length) {
			return;
		}

		if (this._keyboardEventMapper.isW(e)) {
			this._handler.setInteractionMode('grab');
			return;
		}
		if (e.altKey) {
			this._handler.setInteractionMode('grab');
			return;
		}
		if (this._keyboardEventMapper.isEscape(e)) {
			if (this._handler.isInteractionModeSelection()) {
				this._handler.canvas.discardActiveObject();
				this._handler.canvas.renderAll();
			}
		}
		if (this._handler.canvas.wrapperEl !== document.activeElement) {
			return;
		}
		if (this._keyboardEventMapper.isDelete(e)) {
			this._handler.remove();
		} else if (this._keyboardEventMapper.isArrow(e)) {
			this.arrowmoving(e);
		} else if (this._keyboardEventMapper.isCtrlA(e)) {
			e.preventDefault();
			this._handler.selectAll();
		} else if (this._keyboardEventMapper.isCtrlZ(e)) {
			e.preventDefault();
			this._handler.undo();
		} else if (this._keyboardEventMapper.isCtrlY(e)) {
			e.preventDefault();
			this._handler.redo();
		} else if (this._keyboardEventMapper.isPlus(e)) {
			e.preventDefault();
			this._handler.zoomIn();
		} else if (this._keyboardEventMapper.isMinus(e)) {
			e.preventDefault();
			this._handler.zoomOut();
		} else if (this._keyboardEventMapper.isO(e)) {
			e.preventDefault();
			this._handler.zoomOneToOne();
		} else if (this._keyboardEventMapper.isP(e)) {
			e.preventDefault();
			this._handler.zoomToFit();
		} else if (this._keyboardEventMapper.isCtrlD(e)) {
			e.preventDefault();
			this._handler.duplicate();
		}

		return;
	}

	private arrowmoving = (e: KeyboardEvent) => {
		const activeObject = this._handler.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return false;
		}
		if (activeObject.id === this._handler.idWorkarea() || activeObject.id === this._handler.idGrid()) {
			return false;
		}
		if (e.keyCode === 38) {
			this._handler.set('top', activeObject.top - 1);
			return true;
		} else if (e.keyCode === 40) {
			this._handler.set('top', activeObject.top + 1);
			return true;
		} else if (e.keyCode === 37) {
			this._handler.set('left', activeObject.left - 1);
			return true;
		} else if (e.keyCode === 39) {
			this._handler.set('left', activeObject.left + 1);
			return true;
		}

		return true;
	}

	private onKeyup = (e: KeyboardEvent) => {
		if (!this._keyboardEventMapper.isW(e) && !this._handler.isStatic()) {
			this._handler.setInteractionMode('selection');
		}
	}
}

export default HelperShortcuts;
