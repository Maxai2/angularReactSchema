import { Component } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testApi';

  constructor(private canvas: CanvasComponent) {

  }

  ngOnInit() {
    this.canvas.ngOnInit();

    this.canvas.handler.loadWorkspace('[{"id":"e07e94bc-a795-4f1e-8701-62dfc56706de","name":"Default","workarea":{"width":3000,"height":2000,"left":496.79998779296875,"top":309.70001220703125},"objects":[{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-325.03,"top":-169.15,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"2dba6e8e-420f-43e6-8104-66bcc62b575e","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-325.36,"top":-307.1,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"85cfa5eb-51eb-4c14-8966-8c6ec9c987cb","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"rect","version":"3.6.3","originX":"center","originY":"center","left":196.82,"top":-474.42,"width":600,"height":30,"fill":"rgb(110, 110, 110)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":3.01,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"id":"31f2dfe4-1bf5-48d0-8ba4-1c1e15eab550","superType":"wall","subType":"outer","groupType":"scheme","_controlsVisibility":{"ml":true,"mr":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"rect","version":"3.6.3","originX":"center","originY":"center","left":-687.38,"top":217.23,"width":600,"height":30,"fill":"rgb(110, 110, 110)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.36,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"id":"29359e3c-11c0-4a89-a6a4-1f20f66e844b","superType":"wall","subType":"outer","groupType":"scheme","_controlsVisibility":{"ml":true,"mr":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"rect","version":"3.6.3","originX":"center","originY":"center","left":196.44,"top":910.42,"width":600,"height":30,"fill":"rgb(110, 110, 110)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.98,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"id":"b6b4679d-3e55-4b63-8628-00704c8d3abd","superType":"wall","subType":"outer","groupType":"scheme","_controlsVisibility":{"ml":true,"mr":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":-325.36,"top":-238.2,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"4780bef9-4de2-48d1-bc93-e22a816f9903","superType":"table","subType":"default","groupType":"table","name":"Table 1","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"10","guestMin":"2","guestMax":"4"}},{"type":"rect","version":"3.6.3","originX":"center","originY":"center","left":1084.26,"top":-294.52,"width":150,"height":30,"fill":"rgb(148, 148, 148)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.59,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"id":"c939b7f0-d8cb-4d85-8541-e918c631dd0a","superType":"window","subType":"outer","groupType":"scheme","_controlsVisibility":{"ml":true,"mr":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"rect","version":"3.6.3","originX":"center","originY":"center","left":1079.04,"top":497.82,"width":600,"height":30,"fill":"rgb(110, 110, 110)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.4,"scaleY":1,"angle":90.73,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"id":"f435eba9-bb4a-4de4-b2bb-e70d447456aa","superType":"wall","subType":"outer","groupType":"scheme","_controlsVisibility":{"ml":true,"mr":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":1113.76,"top":-8.54,"width":184.33,"height":90.04,"fill":"rgb(75,75,75)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"DoorDouble","id":"58339c29-e7e6-463b-ae52-690b72a5758e","superType":"door","subType":"double","groupType":"scheme","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-324.7,"top":270.71,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"5751b2f5-643c-49f9-bf52-80085eb3da23","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-325.03,"top":132.75,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"93cf17b4-8b34-4961-b19b-41e24b793466","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":-325.03,"top":201.65,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"3985acac-8b41-4840-9566-4fe71b08f64d","superType":"table","subType":"default","groupType":"table","name":"Table 3","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"7","guestMin":"2","guestMax":"4"}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":292.45,"top":-169.14,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"d2168db2-253b-44c8-81e8-23366091319a","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":292.12,"top":-307.1,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"6d528e8e-566a-40d9-b9a6-d2e2ca7e77e8","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":292.12,"top":-238.2,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"e51e5898-a95c-4c5a-8e10-b4185b1ba89e","superType":"table","subType":"default","groupType":"table","name":"Table 2","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"5","guestMin":"3","guestMax":"4"}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-324.7,"top":661.13,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"ddb47a28-920d-45d1-9fb1-3e2bba1585a6","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":-325.03,"top":523.17,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"a932dbed-1ce0-46cb-8667-0b6d79d20f96","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":-325.03,"top":592.07,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"768cf341-ab5e-43c9-bf8b-e6dd9be23b78","superType":"table","subType":"default","groupType":"table","name":"Table 5","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"7","guestMin":"2","guestMax":"4"}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":299.35,"top":270.71,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"fc040a3b-0694-42b9-8965-b83f4b6d9e3a","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":299.02,"top":132.75,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"10acc8f0-ee4a-4ea7-b37a-54ce51742f1b","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":299.02,"top":201.65,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"e079d2cc-3580-4c9e-9f3f-f2a7462797e7","superType":"table","subType":"default","groupType":"table","name":"Table 4","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"7","guestMin":"2","guestMax":"4"}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":292.78,"top":658.01,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"c7bd4210-ce5d-4547-8010-1f6a634c9e58","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"svg","version":"3.6.3","originX":"center","originY":"center","left":292.45,"top":520.05,"width":162.83,"height":90.54,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.99,"scaleY":0.99,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.25)","blur":5,"offsetX":5,"offsetY":0,"affectStroke":true,"nonScaling":false,"id":4},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":"SofaA","id":"8e8ccd8d-6e77-4ce0-8526-864ad2a09a45","superType":"seat","subType":"sofaA","groupType":"seat","_controlsVisibility":{"tl":false,"tr":false,"br":false,"bl":false,"ml":false,"mt":false,"mr":false,"mb":false,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":true,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"subTargetCheck":false,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":false}},{"type":"table","version":"3.6.3","originX":"center","originY":"center","left":292.45,"top":588.95,"width":200,"height":120,"fill":"rgb(75, 75, 75)","stroke":"rgba(70, 70, 70, 0.5)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.48,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":10,"ry":10,"id":"2cd71ee9-79c7-41db-b91b-5577e9fd019d","superType":"table","subType":"default","groupType":"table","name":"Table 6","_controlsVisibility":{"ml":true,"mt":true,"mr":true,"mb":true,"mtr":true},"padding":0,"cornerStyle":"circle","cornerSize":20,"cornerColor":"#90caf9","cornerStrokeColor":"#648dae","transparentCorners":false,"borderColor":"#648daefa","objectCaching":false,"userProperty":{},"strokeUniform":true,"noScaleCache":true,"evented":true,"selectable":true,"resource":{},"reservation":{"enabled":true,"deposite":"7","guestMin":"2","guestMax":"4"}}]}]');

  }

}
