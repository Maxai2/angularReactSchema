import { fabric } from 'fabric';

import { 
    Factory,
    FabricObject, 
    FabricObjectOption 
} from '..';

export default class FactoryWindow implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;
    public properties: (type?: string) => string[];

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'window') {
            if (options.subType) {
                switch (options.subType) {
                    case 'inner': return FactoryWindow.makeInner(options);
                    default: return FactoryWindow.makeOuter(options);
                }
            }
            return FactoryWindow.makeOuter(options);
        }
        return FactoryWindow.makeOuter({});
    }

    public static properties = (type?: string): string[] => {
        return [];
    };

    private static makeInner = (obj: Partial<FabricObject>): FabricObject => {
        return FactoryWindow.create(obj).set({
            subType: 'inner',
            height: 15,
        });
    }

    private static makeOuter = (obj: Partial<FabricObject>): FabricObject => {
        return FactoryWindow.create(obj).set({
            subType: 'outer',
            height: 30,
        });
    }

    private static create = (obj: Partial<FabricObject>): FabricObject => {
        const options: FabricObjectOption = {
            groupType: 'schema',
            superType: 'window',
            width: 150,
            fill: 'rgb(148, 148, 148)',
            paintFirst: 'stroke',
            _controlsVisibility: {
                ml: true,
                mr: true,
                mtr: true
            },
            ...obj
        }

        return new fabric.Rect(options) as FabricObject;
    }
}