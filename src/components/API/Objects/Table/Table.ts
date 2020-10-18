import { fabric } from 'fabric';
import { clamp } from 'lodash';
import { toObject, FabricObjectOption } from '../../Utils/CommonTypes';


const Table = fabric.util.createClass(fabric.Rect, {
    type: 'table',

    initialize(options: any) {
        options = options || {};

        this.callSuper('initialize', options);
        this.text = new fabric.Text(options.name, {
            fontSize: 16,
            fontFamily: 'Saira, Roboto, Helvetica, Arial, sans-serif',
            fill: '#fff',
            fontWeight: 600,
            selectable: false,
            evented: false,
            hasBorders: false,
            hasControls: false
        });
    },

    toObject(propertiesToInclude: string[]) {
        return toObject(this, propertiesToInclude);
    },

    _render(ctx: CanvasRenderingContext2D) {
        this.callSuper('_render', ctx);

        ctx.save();
        if (this.name !== this.text.text) {
            this.text.set('text', this.name);
            this.text.setCoords();
        }
        const textArea = this.text.width * this.text.height;
        const area = this.getScaledWidth() * this.getScaledHeight() * this.canvas.getZoom();
        const originalTransform = ctx.getTransform();
        ctx.setTransform(this.canvas.getRetinaScaling(), 0, 0, this.canvas.getRetinaScaling(), originalTransform.e, originalTransform.f);
        const opacity = (area / ( textArea * 2 / this.canvas.getZoom())) - 1;
        ctx.globalAlpha = clamp(opacity, 0, 1);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'transparent';


        this.text._render(ctx);

        ctx.restore();
    },
});

Table.fromObject = (options: FabricObjectOption, callback: (obj: FabricObjectOption) => any) => {
    return callback(new Table(options));
};

// @ts-ignore
window.fabric.Table = Table;

export default Table;
