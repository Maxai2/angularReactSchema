
import { 
    Svg, 
    Factory, 
    FabricObject 
} from '..';

export default class FactoryPlant implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'plant') {
            if (options.subType) {
                const opts = {
                    ...options,
                    superType: 'plant',
                    groupType: 'misc',
                }
                
                switch (options.subType.toLowerCase()) {
                    case 'a': return new Svg({ ...opts, svg: 'PlantA', subType: 'a', width: 90, height: 90 });
                    case 'b': return new Svg({ ...opts, svg: 'PlantB', subType: 'b', width: 100, height: 100 });
                    case 'c': return new Svg({ ...opts, svg: 'PlantC', subType: 'c', width: 90, height: 90 });
                    case 'd': return new Svg({ ...opts, svg: 'PlantD', subType: 'd', width: 100, height: 100 });
                    default: return null;
                }
            }
        }
        return null;
    }
}
