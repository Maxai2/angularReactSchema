import { 
    Svg, 
    Factory, 
    FabricObject 
} from '..';

export default class FactoryDoor implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'door') {
            if (options.subType) {
                const opts = {
                    ...options,
                    superType: 'door',
                    groupType: 'scheme',
                }
                
                switch (options.subType.toLowerCase()) {
                    case 'single': return new Svg({ ...opts, svg: 'DoorSingle', subType: 'single', width: 90, height: 90 });
                    case 'double': return new Svg({ ...opts, svg: 'DoorDouble', subType: 'double', width: 180, height: 90 });
                    default: return null;
                }
            }
        }
        return null;
    }
}
