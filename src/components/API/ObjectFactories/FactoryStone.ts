import { fabric } from 'fabric';

import { 
    Factory, 
    FabricObject, 
    FabricObjectOption 
} from '..';

export default class FactoryDoor implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        const _options: FabricObjectOption = {
            groupType: 'schema',
            superType: 'stone',
            width: 80,
            height: 80,
            fill: "rgb(110,110,110)",
            _controlsVisibility: {
                ml: true,
                mt: true,
                mr: true,
                mb: true,
                mtr: true
            },
            ...options,
        }
        
        return new fabric.Rect(_options) as FabricObject;
    }
}