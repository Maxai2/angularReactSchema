import { fabric } from 'fabric';

import {
    Factory,
    FabricObject,
    FabricObjectOption
} from '..';

export default class FactoryWall implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;
    public properties: (type?: string) => string[];

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'wall') {
            if (options.subType) {
                switch (options.subType) {
                    case 'inner': return FactoryWall.makeInner(options);
                    default: return FactoryWall.makeOuter(options);
                }
            }
            return FactoryWall.makeOuter(options);
        }
        return null;
    }

    private static makeInner = (obj: Partial<FabricObject>): FabricObject => {
        return FactoryWall.create(obj).set({
            subType: 'inner',
            height: 15,
        });
    }

    private static makeOuter = (obj: Partial<FabricObject>): FabricObject => {
        return FactoryWall.create(obj).set({
            subType: 'outer',
            height: 30,
        });
    }

    private static create = (obj: Partial<FabricObject>): FabricObject => {
        const options: FabricObjectOption = {
            groupType: 'schema',
            superType: 'wall',
            width: 600,
            fill: 'rgb(110, 110, 110)',
            strokeWidth: 0,
            _controlsVisibility: {
                ml: true,
                mr: true,
                mtr: true
            },
            ...obj,
        }

        return new fabric.Rect(options) as FabricObject;
    }
}
