import { fabric } from 'fabric';
import { IDataURLOptions } from 'fabric/fabric-impl';

import {
	Blueprint,
	HelperObject,
	HelperZoom,
	HelperGuideline,
	HelperGrid,
	HelperInteraction,
	HelperWorkspace,
	HelperShortcuts,
	HelperEvents,
} from './Helpers';

import {
	ObservableObject,
	FabricObject,
	InteractionMode,
	KeyEvent,
	FabricObjectOption,
	FabricCanvas,
	FabricGroup,
	FabricEvent,
	ResizeEvent,
} from './Utils';

export interface HandlerOptions {
	canvas?: FabricCanvas;
	static?: boolean;
	activeSelection?: FabricObjectOption;
	keyEvent?: KeyEvent;
	[key: string]: any;

	onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;
}

class Handler extends ObservableObject implements HandlerOptions {
	public canvas: FabricCanvas;
	public keyEvent?: KeyEvent;
	public activeSelection?: Partial<FabricObjectOption<fabric.ActiveSelection>>;

	public onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	public onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;

	private _id: string;
	private _width?: number;
	private _height?: number;
	private _static?: boolean;
	private _helperObject: HelperObject;
	private _helperZoom: HelperZoom;
	private _helperInteraction: HelperInteraction;
	private _helperGrid: HelperGrid;
	private _helperGuideline: HelperGuideline;
	private _helperWorkspace: HelperWorkspace;
	private _helperShortcuts: HelperShortcuts;
	private _helperEvents: HelperEvents;

	constructor(options: HandlerOptions) {
		super();

		this.init(options);
		this.initCallback(options);
		this.initHelpers(options);

		this.trigger('ready');
	}

	public init = (options: HandlerOptions) => {
		this.canvas = options.canvas; // TODO: make private???

		this.activeSelection = options.activeSelection; // TODO: make private
		this.keyEvent = options.keyEvent; // TODO: make private

		this._id = options.id;
		this._width = options.width;
		this._static = options?.static;

		this._width = 0;
		this._height = 0;
	}

	public initCallback = (options: HandlerOptions) => {
		this.onClick = options.onClick;
		this.onDblClick = options.onDblClick;
	}

	public initHelpers = (options: HandlerOptions) => {
		this._helperObject = new HelperObject(this);
		this._helperZoom = new HelperZoom(this);
		this._helperInteraction = new HelperInteraction(this);
		this._helperGuideline = new HelperGuideline(this);
		this._helperGrid = new HelperGrid(this);
		this._helperShortcuts = new HelperShortcuts(this);
		this._helperWorkspace = new HelperWorkspace(this);
		this._helperEvents = new HelperEvents(this);

		if (this.isStatic()) {
			this._helperGuideline?.setEnabled(false)
			this._helperInteraction?.grab();
		}
	}

	/** Start Handler General API */
	public id = (): string => this._id;
	public idGrid = (): string => 'grid';
	public idWorkarea = (): string => 'workarea';
	public width = (): number => this._width;
	public height = (): number => this._height;
	public isStatic = (): boolean => this._static;
	public attachEventListener = () => this._helperEvents?.attachEventListener();
	public detachEventListener = () => this._helperEvents?.detachEventListener();
	public setWidth = (width: number) => this._width = width;
	public setHeight = (height: number): number => this._height = height;
	public resize = (nextWidth: number, nextHeight: number) => {
		this.canvas.setWidth(nextWidth).setHeight(nextHeight);
		this.trigger('resize', { width: nextWidth, height: nextHeight } as ResizeEvent)
	}

	public getObjects = (): FabricObject[] => {
		const objects = this.canvas.getObjects().filter((obj: FabricObject) => {
			if (obj.id === this.idWorkarea()) {
				return false;
			} else if (obj.id === this.idGrid()) {
				return false;
			} else if (!obj.id) {
				return false;
			}
			return true;
		}) as FabricObject[];

		return objects;
	}

	public clear = (update?: boolean, includeWorkarea?: boolean) => {
		this.canvas.discardActiveObject();
		this.getObjects().forEach((obj: any) => {
			if (obj.type === this.idGrid()) {
				return;
			}
			if (!includeWorkarea && obj.id === this.idWorkarea()) {
				return;
			}
			this.canvas.remove(obj);
		});
		update && this.canvas.renderAll();
	}

	public clearSelection = () => {
		this.canvas.discardActiveObject();
		this.trigger('object:selection', { target: null } as FabricEvent);
		this.canvas.requestRenderAll();
	}

	public propertiesToInclude = (): string[] => {
		return [
			'id',
			'superType',
			'subType',
			'groupType',
			'name',
			'_controlsVisibility',
			'padding',
			'cornerStyle',
			'cornerSize',
			'cornerColor',
			'cornerStrokeColor',
			'transparentCorners',
			'borderColor',
			'objectCaching',
			'shadow',
			'userProperty',
			'strokeUniform',
			'noScaleCache',
			'subTargetCheck',
			'evented',
			'editable',
			'selectable',
			'resource',
			'reservation',
			'interactive',
		];
	}
	/** End Handler General API */

	/** Start Zoom API */
	public zoomMin = (): number => this._helperZoom?.zoomMin();
	public zoomMax = (): number => this._helperZoom?.zoomMax();
	public setZoomMin = (value: number) => this._helperZoom?.setZoomMin(value);
	public setZoomMax = (value: number) => this._helperZoom?.setZoomMax(value);
	public zoomToPoint = (point: fabric.Point, zoom: number) => this._helperZoom?.zoomToPoint(point, zoom);
	public zoomOneToOne = () => this._helperZoom?.zoomOneToOne();
	public zoomToFit = () => this._helperZoom?.zoomToFit();
	public zoomIn = () => this._helperZoom?.zoomIn();
	public zoomOut = () => this._helperZoom?.zoomOut();
	public zoom = (fixed?: boolean): number => this._helperZoom?.zoom(fixed);
	/** End Zoom API */


	/** Start Interaction API */
	public setInteractionMode = (mode: InteractionMode) => mode === 'selection' ? this._helperInteraction?.selection() : this._helperInteraction?.grab();
	public interactionMode = (): InteractionMode => this._helperInteraction?.interactionMode();
	public isInteractionModeGrab = (): boolean => this.interactionMode() === 'grab';
	public isInteractionModeSelection = (): boolean => this.interactionMode() === 'selection';
	public isPanning = (): boolean => this._helperInteraction?.panning();
	/** End Interaction API */

	/** Start Grid API */
	public isGridEnabled = (): boolean => this._helperGrid?.enabled();
	public snapToGrid = (): boolean => this._helperGrid?.snapToGrid();
	public gridStep = (): number => this._helperGrid?.gridStep();
	public setSnapToGrid = (snapToGrid?: boolean) => this._helperGrid?.setSnapToGrid(snapToGrid);
	public setGridEnabled = (enabled?: boolean) => this._helperGrid?.setEnabled(enabled);
	/** End Grid API */

	/** Start Guidelines API */
	public setGuidelineEnabled = (enabled?: boolean) => this._helperGuideline?.setEnabled(enabled);
	public isGuidelineEnabled = (): boolean => this._helperGuideline?.enabled();
	/** End Guidelines API */

	/** Start Transaction API */
	public undo = () => this._helperWorkspace?.activeBlueprint()?.undo();
	public redo = () => this._helperWorkspace?.activeBlueprint()?.redo();
	public canUndo = (): boolean => this._helperWorkspace?.activeBlueprint()?.canUndo();
	public canRedo = (): boolean => this._helperWorkspace?.activeBlueprint()?.canRedo();
	/** End Transaction API */

	/** Start Workspace API */
	public loadWorkspace = (json: any) => this._helperWorkspace?.loadJSON(json);
	public serializeWorkspace = (): string => this._helperWorkspace?.serialize();
	public addBlueprint = (blueprint?: any) => this._helperWorkspace?.addBlueprint(blueprint);
	public addAsActiveBlueprint = (blueprint?: any) => this._helperWorkspace?.addAsActiveBlueprint(blueprint);
	public removeBlueprint = (index: number) => this._helperWorkspace?.removeBlueprint(index);
	public removeBlueprintById = (id: string) => this._helperWorkspace?.removeBlueprintById(id);
	public loadBlueprint = (index?: number) => this._helperWorkspace?.loadBlueprint(index);
	public loadBlueprintById = (id: string) => this._helperWorkspace?.loadBlueprintById(id);
	public blueprints = (): Blueprint[] => this._helperWorkspace?.blueprints();
	public activeBlueprint = (): Blueprint => this._helperWorkspace?.activeBlueprint();
	public activeBlueprintIndex = (): number => this._helperWorkspace?.activeBlueprintIndex();
	public workarea = (): Partial<FabricObject> => this._helperWorkspace?.activeBlueprint()?.workarea() ?? { top: 0, left: 0, width: 0, height: 0 };
	public resizeWorkarea = (width: number, height: number) => this._helperWorkspace?.activeBlueprint()?.resizeWorkarea(width, height);
	public resizeWorkareaFit = () => this._helperWorkspace?.activeBlueprint()?.resizeWorkareaFit();
	/** End Workspace API */

	/** Start Object API */
	public activeObject = (): FabricObject | null => this._helperObject?.activeObject();
	public set = (key: keyof FabricObject, value: any) => this._helperObject?.set(key, value);
	public setObject = (option: Partial<FabricObject>) => this._helperObject?.setObject(option);
	public setById = (id: string, key: string, value: any) => this._helperObject?.setById(id, key, value);
	public setByPartial = (obj: FabricObject, option: FabricObjectOption) => this._helperObject?.setByPartial(obj, option);
	public setVisible = (visible?: boolean) => this._helperObject?.setVisible(visible);
	public centerObject = (obj: FabricObject, centered?: boolean) => this._helperObject?.centerObject(obj, centered);
	public add = (obj: FabricObjectOption, selected = false, centered = false, loaded = false) => this._helperObject?.add(obj, selected, centered, loaded);
	public replace = (obj: FabricObjectOption, propertiesToInclude?: string[]) => this._helperObject?.replace(obj, propertiesToInclude);
	public addGroup = (obj: FabricGroup, centered = true, loaded = false) => this._helperObject?.addGroup(obj, centered, loaded);
	public remove = (target?: FabricObject) => this._helperObject?.remove(target, false);
	public fxRemove = (target?: FabricObject) => this._helperObject?.remove(target, true);
	public duplicate = () => this._helperObject?.duplicate();
	public find = (obj: FabricObject): FabricObject | null => this._helperObject?.find(obj);
	public findById = (id: string): FabricObject | null => this._helperObject?.findById(id);
	public select = (obj: FabricObject, find?: boolean) => this._helperObject?.select(obj, find);
	public selectById = (id: string) => this._helperObject?.selectById(id);
	public selectAll = () => this._helperObject?.selectAll();
	public originScaleToResize = (obj: FabricObject, width: number, height: number) => this._helperObject?.originScaleToResize(obj, width, height);
	public scaleToResize = (width: number, height: number) => this._helperObject?.scaleToResize(width, height);
	public scaledWidth = (): number => this._helperObject.scaledWidth();
	public scaledHeight = (): number => this._helperObject.scaledHeight();
	public toGroup = (target?: FabricObject) => this._helperObject?.toGroup(target);
	public toActiveSelection = (target?: FabricObject) => this._helperObject?.toActiveSelection(target);
	public bringForward = () => this._helperObject?.bringForward();
	public bringToFront = () => this._helperObject?.bringToFront();
	public sendBackwards = () => this._helperObject?.sendBackwards();
	public sendToBack = () => this._helperObject?.sendToBack();
	public rotate = (angle: number) => this._helperObject?.rotate(angle);
	public fxRotate = (angle: number, fromCurrentAngle: boolean = true, onComplete?: () => void) => this._helperObject?.fxRotate(angle, fromCurrentAngle, onComplete);
	public fxStraighten = (onComplete?: () => void) => this._helperObject?.fxStraighten(onComplete);
	/** End Object API */


	/** Start Misc API */
	public saveWorkspaceImage = (options = { name: 'New Image', format: 'png', quality: 1 }) => {
		let toogleGrid = false;
		if ((toogleGrid = this.isGridEnabled())) this.setGridEnabled(false);
		const transform = this.canvas.viewportTransform;
		this.zoomToFit();
		const dataUrlOptions: IDataURLOptions = {
			...options,
			enableRetinaScaling: true,
		}
		const dataUrl = this.canvas.toDataURL(dataUrlOptions);
		this.canvas.setViewportTransform(transform);
		if (toogleGrid) this.setGridEnabled();

		if (dataUrl) {
			const anchorEl = document.createElement('a');
			anchorEl.href = dataUrl;
			anchorEl.download = `${options.name}.${options.format}`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
		}
	}
	/** End Misc API */
}

export default Handler;
