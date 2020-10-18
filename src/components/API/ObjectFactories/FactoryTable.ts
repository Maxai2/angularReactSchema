import { 
    Factory,
    FabricObject, 
    FabricObjectOption, 
    Table
} from '..';

export default class FactoryDoor implements Factory {
    public make: (options: Partial<FabricObject>) => FabricObject;

    public static make = (options: Partial<FabricObject>): FabricObject => {
        const _options: FabricObjectOption = {
            groupType: 'table',
            superType: 'table',
            width: 200,
            height: 120,
            rx: 10,
            ry: 10,
            strokeWidth: 1,
            fill: 'rgb(75, 75, 75)',
            stroke: 'rgba(70, 70, 70, 0.5)',
            name: '',
            _controlsVisibility: {
                "ml": true,
                "mt": true,
                "mr": true,
                "mb": true,
                "mtr": true
            },
            ...options,
        }
        return new Table(_options) as FabricObject;
    }
}