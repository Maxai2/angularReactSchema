import { fabric } from 'fabric';

export interface ReservationProperty {
	enabled?: boolean;
	state?: 'reserved' | 'free' | 'reserving';
	guestMin?: number;
	guestMax?: number;
	deposite?: number;
	[key: string]: any;
}

export interface FabricCanvasOption {
	wrapperEl?: HTMLElement;
}

export type FabricCanvas<T extends any = fabric.Canvas> = T & FabricCanvasOption;

export type FabricObjectOption<T extends any = fabric.IObjectOptions> = T & {
	id?: string;
	indexInStack?: number
	groupType?: string,
	superType?: string,
	subType?: string,
	parentId?: string;
	editable?: boolean;
	description?: string;
	reservation?: ReservationProperty;
	deletable?: boolean;
	dblclick?: boolean;
	cloneable?: boolean;
	locked?: boolean;
	interactive?: boolean;
	[key: string]: any;
}

export type FabricObject<T extends any = fabric.Object> = T & FabricObjectOption;

export type FabricGroup = FabricObject<fabric.Group> & {
	objects?: FabricObject[];
}

export interface CanvasOption {
	id?: string;
	preserveObjectStacking?: boolean;
	width?: number;
	height?: number;
	selection?: boolean;
	defaultCursor?: string;
	backgroundColor?: string | fabric.Pattern;
}

export interface KeyEvent {
	move?: boolean;
	all?: boolean;
	esc?: boolean;
	del?: boolean;
	clone?: boolean;
	transaction?: boolean;
	zoom?: boolean;
}

export type InteractionMode = 'selection' | 'grab';

export interface FabricEvent<T extends any = Event> extends Omit<fabric.IEvent, 'e'> {
	e: T;
	target?: FabricObject;
	subTargets?: FabricObject[];
	button?: number;
	isClick?: boolean;
	pointer?: fabric.Point;
	absolutePointer?: fabric.Point;
	transform?: { corner: string; original: FabricObject; originX: string; originY: string; width: number }
}

export interface ZoomEvent extends FabricEvent {
	ratio?: number;
	fixed?: number;
}

export interface InteractionEvent extends FabricEvent {
	mode: InteractionMode;
}

export interface ResizeEvent extends FabricEvent {
	width: number;
	height: number;
}

export type TransactionType = 'initial' | 'add' | 'remove' | 'moved' | 'scaled' | 'rotated' | 'modified' | 'group' | 'ungroup' | 'redo' | 'undo';

export interface TransactionEvent extends FabricEvent {
	json: FabricObject [];
	type: TransactionType;
}

export interface Factory {
	 make: (options: Partial<FabricObject>, replace?: boolean, current?: Partial<FabricObject>) => FabricObject;
}
 
export const toObject = (obj: any, propertiesToInclude: string[], properties?: { [key: string]: any }) =>
	fabric.util.object.extend(
		obj.callSuper('toObject'),
		propertiesToInclude.reduce(
			(prev, property) =>
				Object.assign(prev, {
					[property]: obj.get(property),
				}),
			Object.assign({}, properties),
		),
	);
