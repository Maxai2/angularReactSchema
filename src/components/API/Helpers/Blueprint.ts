import { v4 } from 'uuid';
import { fabric } from 'fabric';
import { throttle, toInteger } from 'lodash';

import {
    Handler,
    HelperTransaction,
    FabricObject,
    FabricObjectOption,
    InteractionEvent,
    ResizeEvent,
    FabricEvent
} from '..';
import { TransactionEvent } from '../Utils';

const defaultWorkareaOption: Partial<FabricObject> = {
    width: 3000,
    height: 2000,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    fill: 'rgb(220,220,220)',//'rgb(179,179,179)',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    padding: 0,
    strokeWidth: 0
};

class Blueprint {
    private _handler: Handler;
    private _id?: string;
    private _name?: string;
    private _objects?: FabricObject[];
    private _workarea?: FabricObject;
    private _transaction?: HelperTransaction;
    private _initialized: boolean;
    private _prevWorkareaLeft: number;
    private _prevWorkareaTop: number;

    constructor(handler: Handler) {
        this._handler = handler;
        this._initialized = false;
    }

    public name = (): string => this._name;
    public id = (): string => this._id;
    public objects = (): FabricObject[] => { this.commit(); return this._objects; }
    public transaction = (): HelperTransaction => this._transaction;
    public workarea = (): FabricObject => this._workarea;
    public undo = () => this._transaction?.undo();
    public redo = () => this._transaction?.redo();
    public canUndo = (): boolean => this._transaction?.canUndo();
    public canRedo = (): boolean => this._transaction?.canRedo();

    public init(obj: any) {
        obj = obj ?? {}
        if (typeof obj === 'string') {
            obj = JSON.parse(obj);
        }
        this._id = obj.id ?? v4();
        this._name = obj.name ?? 'Default';
        this._objects = obj.objects ?? [];
        this._workarea = new fabric.Rect({ id: this._handler.idWorkarea(), ...defaultWorkareaOption, ...obj.workarea }) as FabricObject;
    }

    public commit() {
        this._objects = this._handler.getObjects();
    }

    public load(onLoad?: (blueprint?: Blueprint) => void) {
        this._handler.canvas.insertAt(this._workarea, 0, false);
        this._prevWorkareaLeft = this._workarea.left;
        this._prevWorkareaTop = this._workarea.top;

        if (!this._initialized) {
            const objects: FabricObject[] = [...this._objects];
            this._objects = [];
            fabric.util.enlivenObjects(objects as FabricObject[], (enlivenObjects: FabricObject[]) => {
                enlivenObjects.forEach(obj => {
                    obj.setCoords();
                    this._objects.push(obj);
                });
            }, null);
            this._initialized = true;
        }
        this._handler.canvas.renderOnAddRemove = false;
        this._handler.canvas.add(...this._objects);
        this._handler.canvas.renderOnAddRemove = true;

        this.attachListeners();
        this.fixPositions();

        setTimeout(() => {
            if (!this._handler.isStatic()) {
                if (!this._transaction) {
                    this._transaction = new HelperTransaction(this._handler);
                    this._transaction.save('initial');
                }
                this._transaction.setEnabled(true);
            }

            if (onLoad)
                onLoad(this);
        }, 300)
    }

    public unload = (commit?: boolean) => {
        this._handler.canvas.renderOnAddRemove = false;
        this._handler.canvas.remove(this._workarea);
        commit && this.commit();
        this._transaction?.setEnabled(false);
        this.detachListeners();
        this._handler.clear();
        this._handler.canvas.renderOnAddRemove = true;
    }

    public serialize = (): Partial<FabricObject> => {
        let target: Partial<FabricObject> = {
            id: this._id,
            name: this._name,
            workarea: {
                width: this._workarea.width,
                height: this._workarea.height,
                left: this._workarea.left,
                top: this._workarea.top
            },
            objects: [],
        };

        if (this._initialized) {
            this._objects.forEach(obj => {
                obj = obj as FabricObject;
                target.objects.push(obj.toDatalessObject(this._handler.propertiesToInclude()));
            });
        } else {
            target.objects = this._objects;
        }

        return target;
    }

    public setName = (name: string) => {
        if (name !== this._name) {
            this._name = name;
            this._handler.trigger('blueprint:modified');
        }
    }

    public resizeWorkarea = (width: number, height: number) => {
        if (width !== this._workarea.width || height !== this._workarea.height) {
            this._workarea.set({ width, height });
            this._workarea.setCoords();
            this._handler.centerObject(this._workarea, true);
            this._handler.canvas.renderAll();
            this._handler.trigger('blueprint:resize');
        }
    }

    public resizeWorkareaFit = () => {
        const objects = this.objects();

        let aX = [],
            aY = [],
            prop: string,
            props = ['tr', 'br', 'bl', 'tl'],
            i = 0, iLen = objects.length,
            j = 0, jLen = props.length;

        for (; i < iLen; ++i) {
            const o = objects[i] as FabricObject;
            for (j = 0; j < jLen; j++) {
                prop = props[j];
                aX.push(o.aCoords[prop].x);
                aY.push(o.aCoords[prop].y);
            }
        }
        const min = fabric.util.array.min;
        const max = fabric.util.array.max;

        const shift = 10;
        let minXY = new fabric.Point(min(aX, null), min(aY, null)),
            maxXY = new fabric.Point(max(aX, null), max(aY, null)),
            top = minXY.y - shift || 0, left = minXY.x - shift || 0,
            width = (maxXY.x - minXY.x + shift * 2) || 200,
            height = (maxXY.y - minXY.y + shift * 2) || 200;

        this._workarea.width = toInteger(width < 200 ? 200 : width);
        this._workarea.height = toInteger(height < 200 ? 200 : height);
        this._workarea.setPositionByOrigin({ x: left, y: top } as fabric.Point, 'left', 'top');
        this._workarea.setCoords();
        this._prevWorkareaLeft = this._workarea.getPointByOrigin('center', 'center').x;
        this._prevWorkareaTop = this._workarea.getPointByOrigin('center', 'center').y;

        this.fixPositions();

        this._handler.trigger('blueprint:resize');
    }

    private fixPositions = () => {
        this._handler.centerObject(this._workarea, true);

        if (this._workarea.left !== this._prevWorkareaLeft || this._workarea.top !== this._prevWorkareaTop) {
            const diffLeft = this._workarea.left - this._prevWorkareaLeft;
            const diffTop = this._workarea.top - this._prevWorkareaTop;
            this._prevWorkareaLeft = this._workarea.left;
            this._prevWorkareaTop = this._workarea.top;

            this.objects().forEach((obj: FabricObjectOption) => {
                const left = obj.left + diffLeft;
                const top = obj.top + diffTop;
                obj.set({
                    left,
                    top,
                });
                obj.setCoords();
            });
            this._handler.canvas.sendToBack(this._workarea);
            this._handler.canvas.renderAll();
        }
    }

    private onObjectAdd = () => {
        this._handler.canvas.sendToBack(this._workarea);
    }

    private onObjectStackChanged = () => {
        this._handler.canvas.sendToBack(this._workarea);
    }

    private onInteraction = (opt: InteractionEvent) => {
        this._workarea.hoverCursor = this._handler.canvas.defaultCursor;
    }

    private onResize = (opt?: ResizeEvent) => {
        this.fixPositions();
    }

    private checkObjectBounds = (opt: FabricEvent) => {
        const target = opt.target as FabricObject;
        this.validateObjectInWorkarea(target);
    }

    private validateObjectInWorkarea = throttle((target: FabricObject, absolute = true, calculated = true) => {
        const contained = target.isContainedWithinObject(this._workarea, absolute, calculated);
        //const intersects = target.intersectsWithObject(this._workarea, absolute, calculated);
        try {
            if (!contained) {
                if (!target.hasStateChanged('stateBoundary')) {
                    target.saveState({ propertySet: 'stateBoundary' });
                    Object.assign(target, {
                        borderColor: '#d32f2f75',
                        cornerColor: '#f44336',
                        cornerStrokeColor: '#d32f2f',
                    });
                    this._handler.canvas.requestRenderAll();
                }

            } else {
                if (target.hasStateChanged('stateBoundary')) {
                    Object.assign(target, target._stateBoundary);
                    this._handler.canvas.requestRenderAll();
                }
            }
        } catch {
            target['stateBoundary'] = ['cornerColor', 'borderColor', 'cornerStrokeColor'];
            target.saveState({ propertySet: 'stateBoundary' });
        }
    }, 250)

    private onBlueprintResize = () => {
        this._handler.getObjects().forEach(obj => {
            this.validateObjectInWorkarea(obj);
        });
    }

    private onTransactionReplay = (opt?: TransactionEvent) => {
        const workarea = (opt.json as FabricObject[])[0];
        this._prevWorkareaLeft = workarea.left;
        this._prevWorkareaTop = workarea.top;

        this.fixPositions();
    }

    private attachListeners = () => {
        this._handler.on('object:add', this.onObjectAdd);
        this._handler.on('object:add', this.checkObjectBounds);
        this._handler.on('object:updated', this.checkObjectBounds);
        this._handler.on('object:updating', this.checkObjectBounds);
        this._handler.on('blueprint:resize', this.onBlueprintResize);
        this._handler.on('object:stackchanged', this.onObjectStackChanged);
        this._handler.on('interaction', this.onInteraction);
        this._handler.on('resize', this.onResize);
        this._handler.on('transaction:replay', this.onTransactionReplay);
    }

    private detachListeners = () => {
        this._handler.off('object:add', this.onObjectAdd);
        this._handler.off('object:add', this.checkObjectBounds);
        this._handler.off('object:updated', this.checkObjectBounds);
        this._handler.off('object:updating', this.checkObjectBounds);
        this._handler.off('blueprint:resize', this.onBlueprintResize);
        this._handler.off('object:stackchanged', this.onObjectStackChanged);
        this._handler.off('interaction', this.onInteraction);
        this._handler.off('resize', this.onResize);
        this._handler.off('transaction:replay', this.onTransactionReplay);
    }
}

export default Blueprint;