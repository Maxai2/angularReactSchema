import { fabric } from 'fabric';
import { omit } from 'lodash';
import * as Color from 'color-js';

import {
    toObject,
    FabricObjectOption
} from '.';

import * as SvgObjects from '../Objects';

export interface OptionsObjectSvg extends FabricObjectOption {
    svg?: string
}

const Svg = fabric.util.createClass(fabric.Group, {
    type: 'svg',
    svg: null,

    initialize(options: OptionsObjectSvg) {
        options = options || {};
        options.objectCaching = true;
        options.subTargetCheck = false;
        options.noScaleCache = true;
        options.evented = true;

        const svgString = SvgObjects[options.svg];
        svgString && (fabric.loadSVGFromString(svgString, function (objects: fabric.Object[]) {
            objects.forEach(obj => {
                obj.set({
                    selectable: false,
                    evented: false,
                    objectCaching: false,
                    noScaleCache: true,
                    fill: typeof obj.fill === 'string' ? Color(obj.fill as string).desaturateByRatio(1).toCSS() : obj.fill
                });
            });
            this.callSuper('initialize', objects, omit(options, ['width', 'height', 'angle']));
            this.scaleToWidth(options.width);
            this.scaleToHeight(options.height);
        }.bind(this)));


        this.set(omit(options, ['width', 'height']));
        this.svg = options.svg;
    },

    toObject(propertiesToInclude: string[]) {
        return this.toDatalessObject(propertiesToInclude);
    },

    toDatalessObject(propertiesToInclude: string[]) {
        return toObject(this, propertiesToInclude, { objects: this.svg });
    },

    clone(callback: Function, propertiesToInclude: string[]) {
        const options = this.toDatalessObject(propertiesToInclude);
        Svg.fromObject(options, callback);
    }
});

Svg.fromObject = function (object: OptionsObjectSvg, callback: (obj: OptionsObjectSvg) => any) {
    var objects = object.objects,
        options = fabric.util.object.clone(object);
    delete options.objects;
    if (typeof objects === 'string') {
        options.svg = objects;
        callback && callback(new Svg(options));
        return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
            var options = fabric.util.object.clone(object);
            options.clipPath = enlivedClipPath[0];
            delete options.objects;
            callback && callback(new fabric.Group(enlivenedObjects, options, true));
        }, null);
    }, null);
};
// @ts-ignore
window.fabric.Svg = Svg;

export default Svg;
