
import { 
    Svg, 
    Factory, 
    FabricObject 
} from '..';

export default class FactoryDoor implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'stairs') {
            if (options.subType) {
                const opts = {
                    ...options,
                    superType: 'stairs',
                    groupType: 'seat',
                }
                
                switch (options.subType.toLowerCase()) {
                    case 'single': return new Svg({ ...opts, svg: 'StairsSingle', subType: 'single', width: 130, height: 200 });
                    case 'cross': return new Svg({ ...opts, svg: 'StairsCross', subType: 'cross', width: 190, height: 240 });
                    default: return null;
                }
            }
        }
        return null;
    }
}