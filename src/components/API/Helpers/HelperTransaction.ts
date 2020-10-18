import { fabric } from 'fabric';
import { throttle } from 'lodash';

import {
    Handler,
    FabricObject,
    FabricEvent,
    TransactionEvent,
    TransactionType
} from '..';

class HelperTransaction {
    private _handler: Handler;
    private _redos: TransactionEvent[];
    private _undos: TransactionEvent[];
    private _active: boolean;
    private _state: FabricObject[];
    private _enabled: boolean;

    constructor(handler: Handler) {
        this._handler = handler;
        this._redos = [];
        this._undos = [];
        this._active = false;
        this._enabled = false;

        //this.save('initial');

        //this.setEnabled(false);
    }

    public canUndo = (): boolean => this._undos.length > 0;
    public canRedo = (): boolean => this._redos.length > 0;
    public enabled = (): boolean => this._enabled;

    public setEnabled = (enabled: boolean = true) => {
        if (this._enabled === enabled) return;
        enabled ? this.attachListeners() : this.detachListeners();
        this._enabled = enabled;
    }

    public save = (type: TransactionType, canvasJSON?: any) => {
        if (type === 'initial') {
            this._redos = [];
            this._undos = [];
            this._state = null;
        } else if (this._active || !this._enabled) {
            return;
        }
        try {
            if (this._state) {
                const json = this._state;
                this._redos = [];
                this._undos.push({
                    type,
                    json,
                } as TransactionEvent);
            }

            const { objects }: { objects: FabricObject[] } = canvasJSON || this._handler.canvas.toDatalessObject(this._handler.propertiesToInclude());

            this._state = objects.filter(obj => {
                if (!obj.id || !obj.id.length) { return false; }
                if (obj.id === this._handler.idGrid()) {
                    return false;
                }
                return true;
            });

            this._handler.trigger('transaction:commit', {} as TransactionEvent)
        } catch (error) {
            console.error(error);
        }
    }

    public undo = throttle(() => {
        if (!this._enabled) return;

        const undo = this._undos.pop();
        if (!undo) {
            return;
        }
        this._redos.push({
            type: 'redo',
            json: this._state,
        } as TransactionEvent);
        this.replay(undo);
        this._handler.trigger('transaction:undo', {} as TransactionEvent)
    }, 100);

    public redo = throttle(() => {
        if (!this._enabled) return;

        const redo = this._redos.pop();
        if (!redo) {
            return;
        }
        this._undos.push({
            type: 'undo',
            json: this._state,
        } as TransactionEvent);
        this.replay(redo);
        this._handler.trigger('transaction:redo', {} as TransactionEvent)
    }, 100);

    private replay = (transaction: TransactionEvent) => {
        const objects = transaction.json as FabricObject[];
        this._state = objects;
        this._active = true;
        this._handler.canvas.renderOnAddRemove = false;
        this._handler.clear();

        fabric.util.enlivenObjects(objects, (enlivenObjects: FabricObject[]) => {
            enlivenObjects.forEach(obj => {
                if (obj.id !== this._handler.idWorkarea()) {
                    const targetIndex = this._handler.canvas._objects.length;
                    this._handler.canvas.insertAt(obj, targetIndex, false);
                }
            });
        }, null);

        this._handler.canvas.renderOnAddRemove = true;
        this._active = false;
        this._handler.canvas.renderAll();
        this._handler.trigger('transaction:replay', transaction as TransactionEvent)
    }

    private onAdd = (opt: FabricEvent) => this.save('add');
    private onRemove = (opt: FabricEvent) => this.save('remove');
    private onMoved = (opt: FabricEvent) => this.save('moved');
    private onScaled = (opt: FabricEvent) => this.save('scaled');
    private onRotated = (opt: FabricEvent) => this.save('rotated');
    private onModified = (opt: FabricEvent) => this.save('modified');
    private onGroupped = (opt: FabricEvent) => this.save('group');
    private onUngroupped = (opt: FabricEvent) => this.save('ungroup');

    private attachListeners = () => {
        this._handler.on('object:add', this.onAdd);
        this._handler.on('object:remove', this.onRemove);
        this._handler.on('object:moved', this.onMoved);
        this._handler.on('object:scaled', this.onScaled);
        this._handler.on('object:rotated', this.onRotated);
        this._handler.on('object:d_modified', this.onModified);
        this._handler.on('object:groupped', this.onGroupped);
        this._handler.on('object:ungroupped', this.onUngroupped);
    }

    private detachListeners = () => {
        this._handler.off('object:add', this.onAdd);
        this._handler.off('object:remove', this.onRemove);
        this._handler.off('object:moved', this.onMoved);
        this._handler.off('object:scaled', this.onScaled);
        this._handler.off('object:rotated', this.onRotated);
        this._handler.off('object:d_modified', this.onModified);
        this._handler.off('object:groupped', this.onGroupped);
        this._handler.off('object:ungroupped', this.onUngroupped);
    }

}

export default HelperTransaction;
