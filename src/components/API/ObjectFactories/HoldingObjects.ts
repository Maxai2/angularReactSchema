import { 
    Factory, 
    FabricObject 
} from '..';

import { 
    FactoryWall, 
    FactoryWindow, 
    FactoryDoor, 
    FactoryStairs, 
    FactoryStone, 
    FactoryTable, 
    FactoryPlant, 
    FactorySeat 
} from '.';

export type TypeFactories = 'wall'
    | 'window'
    | 'door'
    | 'stairs'
    | 'stone'
    | 'table'
    | 'seat'
    | 'plant';

export default class HoldingObjects implements Factory {
    public make: (options: Partial<FabricObject>, replace?: boolean, current?: Partial<FabricObject>) => FabricObject;
    public properties: (type?: string) => string[];

    public static make = (options: Partial<FabricObject>, replace?: boolean, current?: Partial<FabricObject>): FabricObject => {
        const factory: Factory = HoldingObjects.factory(options.superType as TypeFactories);
        return factory?.make(options) as FabricObject;
    }

    public static factory = (type: TypeFactories): Factory => {
        switch (type) {
            case 'wall': return FactoryWall;
            case 'window': return FactoryWindow;
            case 'door': return FactoryDoor;
            case 'stairs': return FactoryStairs;
            case 'stone': return FactoryStone;
            case 'table': return FactoryTable;
            case 'plant': return FactoryPlant;
            case 'seat': return FactorySeat;
            default: return null;
        }
    }
}