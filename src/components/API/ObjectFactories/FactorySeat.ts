
import { 
    Svg, 
    Factory, 
    FabricObject 
} from '..';

export default class FactorySeat implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        if (options.superType && options.superType === 'seat') {
            if (options.subType) {
                const opts = {
                    ...options,
                    superType: 'seat',
                    groupType: 'seat',
                }
                
                switch (options.subType.toLowerCase()) {
                    case 'chaira': return new Svg({ ...opts, svg: 'ChairA', subType: 'chairA', width: 48, height: 68 });
                    case 'armchaira': return new Svg({ ...opts, svg: 'ArmchairA', subType: 'armchairA', width: 100, height: 90 });
                    case 'sofaa': return new Svg({ ...opts, svg: 'SofaA', subType: 'sofaA', width: 163, height: 90 });
                    case 'sofab': return new Svg({ ...opts, svg: 'SofaB', subType: 'sofaB', width: 226, height: 90 });
                    case 'sofac': return new Svg({ ...opts, svg: 'SofaC', subType: 'sofaC', width: 400, height: 219 });
                    default: return null;
                }
            }
        }
        return null;
    }
}