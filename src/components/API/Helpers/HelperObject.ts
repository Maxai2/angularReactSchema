import { fabric } from 'fabric';
import { v4 } from 'uuid';
import { debounce, omit } from 'lodash';

import {
    Handler,
    FabricObject,
    FabricGroup,
    FabricEvent,
    FabricObjectOption,
    HoldingObjects
} from '..';

class HelperObject {
    private _handler?: Handler;

    constructor(handler: Handler) {
        this._handler = handler;
        fabric.Object.prototype.objectCaching = false;
        fabric.Object.prototype.setControlsVisibility({
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mb: false,
            mt: false,
            ml: false,
            mr: false
        });

        fabric.Object.prototype.strokeUniform = true;
        fabric.Object.prototype.padding = 0;
        fabric.Object.prototype.cornerStyle = "circle";
        fabric.Object.prototype.cornerSize = 20;
        fabric.Object.prototype.cornerColor = "#90caf9";
        fabric.Object.prototype.cornerStrokeColor = "#648dae";
        fabric.Object.prototype.borderColor = "#648daefa";
        fabric.Object.prototype.selectionBackgroundColor = "#cdcdcd25"; //PRO
        fabric.Object.prototype.borderOpacityWhenMoving = 0.25;
        fabric.Object.prototype.borderDashArray = [5, 5];
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.originX = 'center';
        fabric.Object.prototype.originY = 'center';
        fabric.Object.prototype['_updateCacheCanvas'] = (function (_updateCacheCanvas) {
            return function () {
                if (this.canvas && this.canvas['zooming']) return false;
                return _updateCacheCanvas.call(this);
            };
        })(fabric.Object.prototype['_updateCacheCanvas']);


        this._handler.on('object:selection', this.onSelection);
    }

    public destroy() {
        this._handler.off('object:selection', this.onSelection);
    }

    public activeObject = (): FabricObject | null => {
        return this._handler?.canvas?.getActiveObject() as FabricObject;
    }

    public set = (key: keyof FabricObject, value: any) => {
        const activeObject = this.activeObject();

        if (!activeObject) {
            return;
        }
        activeObject.set(key, value);
        activeObject.setCoords();
        this._handler?.canvas?.requestRenderAll();
        activeObject.fire('modified', { target: activeObject });
        this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
        this.debounceModified({ target: activeObject } as FabricEvent);
    }

    public setObject = (option: Partial<FabricObject>) => {
        Object.keys(option).forEach((key) => {
            this.set(key, option[key]);
        });
    }

    public setById = (id: string, key: string, value: any) => {
        const findObject = this.findById(id);
        findObject && this.set(key, value);
    }

    public setByPartial = (obj: FabricObject, option: FabricObjectOption) => {
        if (!obj) {
            return;
        }
        obj.set(option);
        obj.setCoords();
        this._handler?.canvas?.requestRenderAll();

        obj.fire('modified', { target: obj });
        this._handler.trigger('object:modified', { target: obj } as FabricEvent);
        this.debounceModified({ target: obj } as FabricEvent);
    }

    public setVisible = (visible?: boolean) => {
        this.set('visible', visible);
    }

    public centerObject = (obj: FabricObject, centered?: boolean) => {
        if (centered) {
            this._handler?.canvas?.centerObject(obj);
            obj.setCoords();
            this._handler?.canvas?.requestRenderAll();
        } else {
            this.setByPartial(obj, {
                left:
                    obj.left / this._handler.zoom(true) -
                    obj.width / 2 -
                    this._handler?.canvas?.viewportTransform[4] / this._handler.zoom(true),
                top:
                    obj.top / this._handler.zoom(true) -
                    obj.height / 2 -
                    this._handler?.canvas?.viewportTransform[5] / this._handler.zoom(true),
            });
        }
    }

    public add = (obj: Partial<FabricObject>, selected = false, centered = false, loaded = false): FabricObject => {
        const option: FabricObjectOption = Object.assign(
            {},
            obj,
            {
                locked: false,
                strokeUniform: true,

                resource: {},
                reservation: {
                    enabled: false,
                },
                userProperty: {},
            }
        );

        let createdObj;
        if (obj.type === 'group') {
            const objects = this.addGroup(obj as FabricGroup, false, false, true);
            createdObj = new fabric.Group(objects);
        } else {
            createdObj = HoldingObjects.make(option);
        }
        if (!createdObj) return;
        createdObj['stateBoundary'] = ['cornerColor', 'borderColor', 'cornerStrokeColor'];
        createdObj.saveState({ propertySet: 'stateBoundary' });
        this._handler.canvas.add(createdObj);

        if (!loaded && centered) {
            this.centerObject(createdObj, centered);
        }

        if (!loaded) {
            this._handler?.trigger('object:add', { target: createdObj } as FabricEvent);
        }

        selected && this._handler.canvas.setActiveObject(createdObj);

        return createdObj;
    }

    public addGroup = (obj: FabricGroup, selected = false, centered = false, loaded = false) => {
        return obj.objects.map(child => {
            return this.add(child, selected, centered, loaded);
        });
    }

    public insert(obj: FabricObject, index: number) {
        this._handler.canvas.insertAt(obj, index, false);
        obj.indexInStack = index;
    }

    public replace = (obj: FabricObjectOption, propertiesToInclude: string[] = []) => {
        const currentObject = this.activeObject();

        propertiesToInclude = [...this._handler.propertiesToInclude(), ...propertiesToInclude]
        const newOption = {
            ...omit(currentObject.toObject(propertiesToInclude),
                ['scaleX', 'scaleY', 'width', 'height']),
            ...obj
        };

        this._handler.canvas.renderOnAddRemove = false;
        this.remove(currentObject);
        this._handler.canvas.renderOnAddRemove = true;

        this.add(newOption, true);
    }

    public remove = (target?: FabricObject, fx?: boolean) => {
        const activeObject = target || (this.activeObject());

        if (!activeObject) {
            return;
        }
        if (typeof activeObject.deletable !== 'undefined' && !activeObject.deletable) {
            return;
        }
        if (activeObject.type !== 'activeSelection') {
            this._handler?.canvas?.discardActiveObject();
            if (fx) { this._handler?.canvas?.fxRemove(activeObject) }
            else { this._handler?.canvas?.remove(activeObject); }
        } else {
            const { _objects: activeObjects } = activeObject;
            const existDeleted = activeObjects.some(
                (obj: any) => typeof obj.deletable !== 'undefined' && !obj.deletable,
            );
            if (existDeleted) {
                return;
            }
            this._handler?.canvas?.discardActiveObject();
            activeObjects.forEach((obj: any) => {
                if (fx) { this._handler?.canvas?.fxRemove(obj) }
                else { this._handler?.canvas?.remove(obj); }
            });
        }
        if (this._handler.canvas.renderOnAddRemove) {
            if (fx) {
                setTimeout(() => {
                    this._handler?.trigger('object:remove', { target: activeObject } as FabricEvent);
                }, this._handler.canvas.FX_DURATION * 2);
            }
            else { this._handler?.trigger('object:remove', { target: activeObject } as FabricEvent); }
        }
    }

    public duplicate = () => {
        const shiftAmount = this._handler.gridStep();

        const activeObject = this.activeObject();
        if (!activeObject) {
            return;
        }
        if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
            return;
        }

        activeObject.clone((clonedObj: FabricObject) => {
            this._handler?.canvas?.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + shiftAmount,
                top: clonedObj.top + shiftAmount,
                evented: true,
                cornerColor: fabric.Object.prototype.cornerColor,
                cornerStrokeColor: fabric.Object.prototype.cornerStrokeColor,
                borderColor: fabric.Object.prototype.borderColor,
            });

            clonedObj['stateBoundary'] = ['cornerColor', 'borderColor', 'cornerStrokeColor'];
            clonedObj.saveState({ propertySet: 'stateBoundary' });

            this._handler.canvas.renderOnAddRemove = false;
            if (clonedObj.type === 'activeSelection') {
                const activeSelection = clonedObj as fabric.ActiveSelection;
                activeSelection.canvas = this._handler?.canvas;
                activeSelection.forEachObject((obj: any) => {
                    obj.set('id', v4());
                    this._handler.canvas.add(obj);
                });
                activeSelection.setCoords();
            } else {
                if (activeObject.id === clonedObj.id) {
                    clonedObj.set('id', v4());
                }
                if (activeObject.name) {
                    clonedObj.set('name', activeObject.name + ' copy');
                }
                this._handler.canvas.add(clonedObj);
            }

            this._handler.canvas.setActiveObject(clonedObj);
            this._handler.canvas.renderOnAddRemove = true;
            this._handler?.canvas?.requestRenderAll();
            this._handler?.trigger('object:add', { target: clonedObj as FabricObject } as FabricEvent);

        }, this._handler.propertiesToInclude());
    }

    public find = (obj: FabricObject): FabricObject | null => {
        return this.findById(obj.id);
    }

    public findById = (id: string): FabricObject | null => {
        let findObject;
        const exist = this._handler.getObjects().some(obj => {
            if (obj.id === id) {
                findObject = obj;
                return true;
            }
            return false;
        });

        return exist ? findObject : null;
    }

    public select = (obj: FabricObject, find?: boolean) => {
        let findObject = obj;
        if (find) {
            findObject = this.find(obj);
        }
        if (findObject) {
            this._handler?.canvas?.setActiveObject(findObject);
        }
    }

    public selectById = (id: string) => {
        const findObject = this.findById(id);
        if (findObject) {
            this.select(findObject);
        }
    }

    public selectAll = () => {
        this._handler?.canvas?.discardActiveObject();
        const filteredObjects = this._handler?.canvas?.getObjects().filter((obj: any) => {
            if (obj.id === this._handler.idWorkarea() || obj.id === this._handler.idGrid()) {
                return false;
            } else if (!obj.evented) {
                return false;
            } else if (obj.locked) {
                return false;
            }
            return true;
        });
        if (!filteredObjects.length) {
            return;
        }
        if (filteredObjects.length === 1) {
            this._handler?.canvas?.setActiveObject(filteredObjects[0]);
            this._handler?.canvas?.renderAll();
            return;
        }
        const activeSelection = new fabric.ActiveSelection(filteredObjects, {
            canvas: this._handler?.canvas,
            ...this._handler?.activeSelection,
        });
        this._handler?.canvas?.setActiveObject(activeSelection);
        this._handler?.canvas?.requestRenderAll();
    }

    public originScaleToResize = (obj: FabricObject, width: number, height: number) => {
        if (obj.id === this._handler.idWorkarea()) {
            this.setByPartial(obj, {
                workareaWidth: obj.width,
                workareaHeight: obj.height,
            });
        }
        this.setByPartial(obj, {
            scaleX: width / obj.width,
            scaleY: height / obj.height,
        });
    }

    public scaleToResize = (width: number, height: number) => {
        const activeObject = this.activeObject();
        const { id } = activeObject;

        (width < 0) && (width = 0);
        (height < 0) && (height = 0);

        const obj = {
            id,
            scaleX: width / activeObject.width,
            scaleY: height / activeObject.height,
        };

        this.setByPartial(activeObject, obj);
    }

    public scaledWidth = (): number => {
        const activeObject = this.activeObject();
        return activeObject.scaleX * activeObject.width;
    }

    public scaledHeight = (): number => {
        const activeObject = this.activeObject();
        return activeObject.scaleY * activeObject.height;
    }

    public toGroup = (target?: FabricObject) => {
        const activeObject = target || (this.activeObject() as fabric.ActiveSelection);
        if (!activeObject) {
            return;
        }
        if (activeObject.type !== 'activeSelection') {
            return;
        }

        const group = activeObject.toGroup() as any;
        group.set({
            id: v4(),
            name: 'New group',
            type: 'group',
            locked: false,
            strokeUniform: true,
            resource: {},
            reservation: {
                enabled: false,
            },
            userProperty: {},
        });

        this._handler.trigger('object:selection', { target: group } as FabricEvent);
        this._handler.trigger('object:groupped', { target: group } as FabricEvent);
        this._handler?.canvas?.requestRenderAll();
        return group;
    }

    public toActiveSelection = (target?: FabricObject) => {
        const activeObject = target || (this.activeObject() as fabric.Group);
        if (!activeObject) {
            return;
        }
        if (activeObject.type !== 'group') {
            return;
        }
        const activeSelection = activeObject.toActiveSelection();
        this._handler.trigger('object:selection', { target: activeSelection } as FabricEvent);
        this._handler.trigger('object:ungroupped', { target: activeSelection } as FabricEvent);
        this._handler?.canvas?.requestRenderAll();
        return activeSelection;
    }

    public bringForward = () => {
        const activeObject = this.activeObject();
        if (activeObject) {
            this._handler?.canvas?.bringForward(activeObject);
            this._handler.trigger('object:stackchanged', { target: activeObject } as FabricEvent);
            this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
            this.debounceModified({ target: activeObject } as FabricEvent);
        }
    }

    public bringToFront = () => {
        const activeObject = this.activeObject();
        if (activeObject) {
            this._handler?.canvas?.bringToFront(activeObject);
            this._handler.trigger('object:stackchanged', { target: activeObject } as FabricEvent);
            this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
            this.debounceModified({ target: activeObject } as FabricEvent);
        }
    }

    public sendBackwards = () => {
        const activeObject = this.activeObject();
        if (activeObject) {
            const firstObject = this._handler?.canvas?.getObjects()[1] as FabricObject;
            if (firstObject.id === activeObject.id) {
                return;
            }
            this._handler?.canvas?.sendBackwards(activeObject);
            this._handler.trigger('object:stackchanged', { target: activeObject } as FabricEvent);
            this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
            this.debounceModified({ target: activeObject } as FabricEvent);
        }
    }

    public sendToBack = () => {
        const activeObject = this.activeObject();
        if (activeObject) {
            this._handler?.canvas?.sendToBack(activeObject);
            this._handler.trigger('object:stackchanged', { target: activeObject } as FabricEvent);
            this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
            this.debounceModified({ target: activeObject } as FabricEvent);
        }
    }

    public rotate = (angle: number) => {
        const activeObject = this.activeObject();
        if (activeObject) {
            activeObject.rotate(angle);
            this._handler?.canvas.requestRenderAll();
            activeObject.fire?.('modified', { target: activeObject });
            this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
            this.debounceModified({ target: activeObject } as FabricEvent);
        }
    }

    public fxRotate = (angle: number, fromCurrentAngle: boolean = true, onComplete?: () => void) => {
        const activeObject = this.activeObject();
        if (activeObject) {
            angle = fromCurrentAngle && (activeObject.angle + angle);

            fabric.util.animate({
                startValue: activeObject.get('angle'),
                endValue: angle,
                duration: this._handler?.canvas?.FX_DURATION,
                onChange: (value) => {
                    activeObject.rotate(value);
                    this._handler?.canvas.requestRenderAll();
                    activeObject.fire?.('modified', { target: activeObject });
                },
                onComplete: () => {
                    activeObject.angle = angle + Math.ceil(-angle / 360) * 360;
                    activeObject.setCoords();
                    onComplete && onComplete();
                    this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
                    this.debounceModified({ target: activeObject } as FabricEvent);
                },
            });
        }
    }

    public fxStraighten = (onComplete?: () => void) => {
        const activeObject = this.activeObject();
        if (activeObject) {
            activeObject.fxStraighten({
                onChange: () => {
                    this._handler?.canvas.requestRenderAll();
                    activeObject.fire('modified', { target: activeObject });
                },
                onComplete: () => {
                    activeObject.setCoords();
                    onComplete && onComplete();
                    this._handler.trigger('object:modified', { target: activeObject } as FabricEvent);
                    this.debounceModified({ target: activeObject } as FabricEvent);
                },
            });
        }
    }

    private onSelection = (opt: FabricEvent) => {
        const { activeSelection } = this._handler;
        const target = opt.target as FabricObject<fabric.ActiveSelection>;
        if (target && target.type === 'activeSelection') {
            target.set({
                ...activeSelection,
            });
        }
    }

    private debounceModified = debounce((opt: FabricEvent) => {
        this?._handler?.trigger('object:d_modified', opt);
    }, 500);
}

export default HelperObject;
